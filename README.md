# @antv/translator

Translate by sending a request to Google Translate.

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
