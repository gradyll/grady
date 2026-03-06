---
url: /grady/ai.md
---
# Agent

## Agent 工作原理

一个 Agent 由三个部分组成。

1. Instruction（指令）。用于引导 agent 行为的 system prompt （系统提示词） 和 rules
2. Tools（工具）。文件编辑、代码库搜索、终端执行等
3. Prompt（提示词/用户消息。用户发出的提示词和后续补充，用于指挥具体工作

## 工具

工具是构建 agent 的基础模块。

## 聊天框里的工作原理

1. Agent 提出澄清性问题以理解你的需求
2. 在你的代码中检索以收集相关上下文
3. 创建一份完整的实现计划
4. 你可以通过聊天或 Markdown 文件审阅并编辑该计划
5. 准备好后点击构建该计划

## 插件

插件会将 rules、skills、agents、commands、MCP servers 和 hooks 打包成可分发的 bundle，可在 Cursor IDE 中使用。你可以浏览社区开发的插件，或构建你自己的插件与其他开发者共享。

### 插件包含的内容

> 插件可以包含以下组件的任意组合：

* Rules       持久化的 AI 指南和编码规范 (.mdc 文件)
* Skills      处理复杂任务的专用 Agent 能力
* Agents      自定义 Agent 配置和提示词
* Commands    Agent 可执行的命令文件
* MCP Servers Model Context Protocol 集成
* Hooks       由事件触发的自动化脚本

示例在`example/mcp-server`
