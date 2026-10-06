# Dice-Next Log Renderer

Dice-Next 专属的 TRPG 跑团日志渲染器（着色器）网站。

## 关于

本项目是 [Dice-Next](../Dice-Next) 的配套日志渲染工具，基于海豹核心的日志染色器前端
[sealdice/story-painter](https://github.com/sealdice/story-painter)（及其分支 DiceZone/story-painter）
修改而来，界面风格对齐 [Dice-Next-WebUI](../Dice-Next-WebUI)。

上游原项目采用 [MIT](./LICENSE) 协议开源，本项目同样以 MIT 协议发布，并保留上游版权声明。

## 功能

* 支持多种跑团日志格式导入（海豹、Dice!、QQ 导出、SinaNya、DiceKokuna、FVTT、已染色文本等）
* 在线编辑与自动染色（CodeMirror 6）
* 多种预览与导出（BBS / 菠萝论坛 / 回声工坊 / 原始文件 / DOC / DOCX）
* 亮色 / 深色模式

## 开发

```bash
pnpm install
pnpm dev    # 开发
pnpm build  # 构建（含类型检查）
```

## 致谢

* [sealdice/story-painter](https://github.com/sealdice/story-painter)
