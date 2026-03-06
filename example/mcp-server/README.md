在 `package.json` 里配置  `"mcp:build": "cd mcp-server && npm install && npm run build"`,


# DMS Repair MCP 插件

为 DMS 维修移动端项目（new-app-repair）提供 MCP 工具，供 Cursor Agent 在对话中获取项目架构、API、路由、Store 等上下文。

## 提供的工具 (Tools)

| 工具名                     | 说明                                                                                         |
| -------------------------- | -------------------------------------------------------------------------------------------- |
| `get_project_architecture` | 获取项目架构说明（技术栈、路径别名、api/store/router/views/components 约定、检查清单与术语） |
| `list_api_modules`         | 列出 src/api 下的业务模块与 server 中的接口前缀常量                                          |
| `list_routes`              | 列出路由表（path、name、meta.title）                                                         |
| `list_stores`              | 列出 Pinia store 文件列表                                                                    |
| `read_project_file`        | 读取项目内指定相对路径文件内容（如 `src/api/server.ts`）                                     |

## 安装与构建

```bash
cd mcp-server
npm install
npm run build
```

## 在 Cursor 中启用

项目已配置 `.cursor/mcp.json`，启用步骤：

1. 确保已执行上述 `npm install` 和 `npm run build`
2. 完全重启 Cursor
3. 打开 **Settings** → **Tools & MCP**，确认 `dms-repair-mcp` 已连接

Agent 在对话中会自动在需要时调用这些工具。

## 环境变量

- `MCP_PROJECT_ROOT`：可选，项目根目录绝对路径。默认会根据运行位置自动推断。

## 技术栈

- Node.js ≥ 18
- @modelcontextprotocol/sdk
- TypeScript
- stdio 传输（适合 Cursor 子进程调用）
