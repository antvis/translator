# @antv/translator

Translate markdown files by sending a request to Google Translate.

- `*.zh.md` -> `*.en.md`
- Local credentials are not required.
- If the document is long it will be slow.

Install:

```bash
$ npm install @antv/translator
```

Translate files under certain directory or a single file:

```bash
$ translate -d docs
$ translate -d docs/chart.zh.md
```

Inspired by:

- https://github.com/antvis/S2/blob/807648180fe64f47e9f70df865890ab480b07603/s2-site/script/translationHtml.mjs
- https://github.com/dromara/issues-translate-action/tree/main/src
