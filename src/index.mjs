#! /usr/bin/env node

import { Command } from "commander";
import { unified } from "unified";
import parse from "remark-parse";
import path from "path";
import fs from "fs";
import * as glob from "glob";
import stringify from "remark-stringify";
import { visit } from "unist-util-visit";
import remarkGfm from "remark-gfm";
import translate from "@tomsun28/google-translate-api";

const program = new Command();
program
  .version("1.0.0")
  .description("An translator for markdown files")
  .option("-d, --dir  [value]", "Directory name")
  .parse(process.argv);

const targetLanguageCode = "en";
/**
 * 去掉文件头部的 yaml,
 * e.g.
 * ---
 * title: <title>
 * order: <order>
 * ---
 */
const yamlHeaderRegx = /---[\s\S]*?---/;

// markdown 和 AST 的转换方法
const toMdAST = (md) => unified().use(parse).use(remarkGfm).parse(md);
const toMarkdown = (ast) => {
  return unified().use(stringify).use(remarkGfm).stringify(ast);
};

// 是否为有效的 url
const isValidHttpUrl = (string) => {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
};
// 是否为数字和英语
const isEnglishOrNumber = (text = "") => {
  const regx = /^[A-Za-z-1-9]*\.*$/;
  const trimText = text.toString().replace(/ /g, "");
  return regx.test(trimText);
};

const cacheMap = new Map();
let cacheCount = 0;

/**
 * google translate API 请求, 中翻英
 */
const getTranslatedText = async (originalText) => {
  let result = [];
  for (const text of originalText) {
    try {
      const res = await translate(text, { to: targetLanguageCode });
      result.push(res.text);
    } catch (e) {
      console.error(e);
    }
  }
  return result;
};

const isLinkType = (node) => {
  return node.type === "link";
};
const formatUrl = (url) => url?.replace(/^#/, "");

/**
 * 请求 google 翻译，将翻译结果写入 AST
 */
const getOriginalTextInfo = (mdAST) => {
  const originalTextArr = [];
  const textMap = new Map();
  let index = 0;

  visit(mdAST, (node) => {
    if (isTranslateText(node)) {
      const nodeVal = node.type === "link" ? formatUrl(node.url) : node.value;
      // // 英文数值不翻译、缓存中有的不翻译、链接不翻译
      // console.log(
      //   isEnglishOrNumber(nodeVal),
      //   cacheMap.has(nodeVal),
      //   isValidHttpUrl(nodeVal),
      // );
      if (
        !nodeVal ||
        isEnglishOrNumber(nodeVal) ||
        cacheMap.has(nodeVal) ||
        isValidHttpUrl(nodeVal)
      ) {
        return;
      }
      if (!textMap.has(nodeVal)) {
        originalTextArr.push(nodeVal);
        textMap.set(nodeVal, index);
        index++;
      }
    }
  });
  return { originalTextArr, textMap };
};

// 判断是否为需要翻译的文本
function isTranslateText(node) {
  return node.type === "text" || node.type === "code" || node.type === "link";
}

const toInSiteLink = (url) => {
  return `${url}`;
};
/**
 * 将翻译后的文本写入 AST
 */
const writeValueToAST = (mdAST, translatedTextList, textMap) => {
  visit(mdAST, (node) => {
    const nodeVal = node.type === "link" ? formatUrl(node.url) : node.value;
    if (isValidHttpUrl(nodeVal) || isEnglishOrNumber(nodeVal)) {
      return;
    }

    if (isLinkType(node)) {
      if (cacheMap.has(nodeVal)) {
        cacheCount++;
        node.url = toInSiteLink(cacheMap.get(nodeVal));
        return;
      }
      const valueIndex = textMap.get(nodeVal);
      node.url = toInSiteLink(translatedTextList[valueIndex]);
      cacheMap.set(nodeVal, translatedTextList[valueIndex]);
    } else if (isTranslateText(node)) {
      if (cacheMap.has(nodeVal)) {
        cacheCount++;
        node.value = cacheMap.get(nodeVal);
        return;
      }
      const valueIndex = textMap.get(nodeVal);
      node.value = translatedTextList[valueIndex];
      cacheMap.set(nodeVal, translatedTextList[valueIndex]);
    }
  });
  return mdAST;
};

/**
 * 将 AST 转换为 markdown 写入文件
 */
const writeToFile = async (pathName, mdAST, yamlHeader) => {
  const writePath = pathName.replace(".zh.md", ".en.md");
  fs.writeFileSync(writePath, yamlHeader + toMarkdown(mdAST), "utf8");
};

const options = program.opts();
if (options.dir) {
  const mdFile = path.join(process.cwd(), options.dir);
  const isDir = fs.lstatSync(mdFile).isDirectory();
  const allFilesName = isDir
    ? glob.sync("*.zh.md", {
        cwd: mdFile,
        realpath: true,
        absolute: true,
      })
    : [mdFile];

  allFilesName.forEach(async (pathName) => {
    let mdContent = fs.readFileSync(pathName, "utf8");

    let yamlHeader = "";
    const yamlHeaderMatches = mdContent.match(yamlHeaderRegx);
    if (yamlHeaderMatches?.[0]) {
      yamlHeader = yamlHeaderMatches?.[0] + "\n\n";
    }
    mdContent = mdContent.replace(yamlHeaderRegx, "");

    const mdAST = toMdAST(mdContent);
    const { originalTextArr, textMap } = getOriginalTextInfo(mdAST);
    const translatedAllText = await getTranslatedText(originalTextArr);
    writeValueToAST(mdAST, translatedAllText, textMap);
    await writeToFile(pathName, mdAST, yamlHeader);

    console.log("Translation completed: ", pathName);
  });
}
