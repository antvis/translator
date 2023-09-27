---
title: Chart
order: 2
---

Chart 用于提供创建 canvas、添加 Mark 标记、自适应图表大小等能力。

## 开始使用

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

## 选项

| API       | 描述                                                                                                                                                                                          | 类型                    | 默认值 |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ------ |
| container | 指定 chart 绘制的 DOM，可以传入 DOM id，也可以直接传入 dom 实例                                                                                                                               | `string \| HTMLElement` |        |
| width     | 图表宽度                                                                                                                                                                                      | `number`                | 640    |
| height    | 图表高度                                                                                                                                                                                      | `number`                | 480    |
| depth     | 图表深度，在 3D 图表中使用                                                                                                                                                                    | `number`                | 0      |
| renderer  | 指定渲染引擎，默认使用 canvas。                                                                                                                                                               |                         |        |
| plugins   | 指定渲染时使用的插件 ，具体见 [plugin](/api/plugin/rough)                                                                                                                                     | `any[]`                 |        |
| autoFit   | 图表是否自适应容器宽高，默认为 `false`，用户需要手动设置 `width` 和 `height`。<br/>当 `autoFit: true` 时，会自动取图表容器的宽高，如果用户设置了 `height`，那么会以用户设置的 `height` 为准。 | `boolean`               | false  |
| padding   | 图表内边距                                                                                                                                                                                    | `number`                | 30     |
