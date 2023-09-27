---
title: Chart
order: 2
---

Chart is used to provide the ability to create canvas, add Mark tags, adaptive chart size, etc.

## start using

```js
const chart = new Chart({
  container: "container",
  width: 640,
  height: 480,
});

chart
  .interval()
  .data([
    { genre: "Sports", sold: 275 },
    { genre: "Strategy", sold: 115 },
    { genre: "Action", sold: 120 },
    { genre: "Shooter", sold: 350 },
    { genre: "Other", sold: 150 },
  ])
  .encode("x", "genre")
  .encode("y", "sold")
  .encode("color", "genre");

chart.render();
```

## Options

| API       | describe                                                                                                                                                                                                                                                                                                                  | type                    | default value |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ------------- |
| container | Specify the DOM drawn by the chart. You can pass in the DOM id or directly pass in the dom instance.                                                                                                                                                                                                                      | `string \| HTMLElement` |               |
| width     | chart width                                                                                                                                                                                                                                                                                                               | `number`                | 640           |
| height    | chart height                                                                                                                                                                                                                                                                                                              | `number`                | 480           |
| depth     | Chart depth, used in 3D charts                                                                                                                                                                                                                                                                                            | `number`                | 0             |
| renderer  | Specify the rendering engine, using canvas by default.                                                                                                                                                                                                                                                                    |                         |               |
| plugins   | Specify the plug-in used when rendering. For details, see[plugin](/api/plugin/rough)                                                                                                                                                                                                                                      | `any[]`                 |               |
| autoFit   | Whether the chart adapts to the width and height of the container, the default is`false`, users need to manually set`width`and`height`。<br/>when`autoFit: true`, the width and height of the chart container will be automatically taken. If the user sets`height`, then it will be set by the user`height`shall prevail. | `boolean`               | false         |
| padding   | chart padding                                                                                                                                                                                                                                                                                                             | `number`                | 30            |
