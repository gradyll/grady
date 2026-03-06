#!/usr/bin/env node
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** 项目根目录：Cursor 从项目根启动时可为 process.cwd()，否则用相对 dist 的上级 */
function getProjectRoot() {
    const envRoot = process.env.MCP_PROJECT_ROOT;
    if (envRoot && fs.existsSync(envRoot))
        return envRoot;
    const fromDist = path.resolve(__dirname, "..", "..");
    if (fs.existsSync(path.join(fromDist, "src", "api", "server.ts")))
        return fromDist;
    const cwd = process.cwd();
    if (fs.existsSync(path.join(cwd, "src", "api", "server.ts")))
        return cwd;
    return fromDist;
}
const PROJECT_ROOT = getProjectRoot();
function readFileSafe(filePath) {
    const full = path.join(PROJECT_ROOT, filePath);
    try {
        return fs.readFileSync(full, "utf-8");
    }
    catch {
        return "";
    }
}
function listDirSafe(dirPath) {
    const full = path.join(PROJECT_ROOT, dirPath);
    try {
        return fs.readdirSync(full);
    }
    catch {
        return [];
    }
}
const TOOLS = [
    {
        name: "get_project_architecture",
        description: "获取 DMS 维修移动端项目的架构说明（技术栈、路径别名、api/store/router/views/components 约定、检查清单与术语）。适合在增删改功能、重构或回答项目组织方式时使用。",
        inputSchema: {
            type: "object",
            properties: {},
        },
    },
    {
        name: "list_api_modules",
        description: "列出 src/api 下的业务模块与 server 中的接口前缀常量，便于查找或新增接口时选用正确前缀。",
        inputSchema: {
            type: "object",
            properties: {},
        },
    },
    {
        name: "list_routes",
        description: "列出路由表（path、name、meta.title 等），便于查找页面或新增路由时参考。",
        inputSchema: {
            type: "object",
            properties: {},
        },
    },
    {
        name: "list_stores",
        description: "列出 Pinia store 文件列表，便于查找状态模块或新增 store 时参考。",
        inputSchema: {
            type: "object",
            properties: {},
        },
    },
    {
        name: "read_project_file",
        description: "读取项目内指定相对路径文件内容（相对项目根，如 src/api/server.ts）。用于在需要查看具体代码时由 AI 按路径读取。",
        inputSchema: {
            type: "object",
            properties: {
                relativePath: {
                    type: "string",
                    description: "相对项目根的路径，例如 src/api/server.ts 或 src/router/index.ts",
                },
            },
            required: ["relativePath"],
        },
    },
];
async function handleGetProjectArchitecture() {
    const skillPath = path.join(PROJECT_ROOT, ".cursor", "skills", "project-architecture", "SKILL.md");
    try {
        return fs.readFileSync(skillPath, "utf-8");
    }
    catch {
        return "项目架构文件未找到: .cursor/skills/project-architecture/SKILL.md";
    }
}
async function handleListApiModules() {
    const serverContent = readFileSafe("src/api/server.ts");
    const entries = listDirSafe("src/api");
    const dirs = [];
    for (const name of entries) {
        if (name.startsWith(".") || name === "server.ts")
            continue;
        try {
            const full = path.join(PROJECT_ROOT, "src/api", name);
            if (fs.statSync(full).isDirectory())
                dirs.push(name);
        }
        catch {
            /* skip */
        }
    }
    dirs.sort();
    return JSON.stringify({
        serverPrefixes: serverContent || "(无法读取 server.ts)",
        modules: dirs,
    }, null, 2);
}
async function handleListRoutes() {
    const content = readFileSafe("src/router/index.ts");
    const routeMatches = content.matchAll(/path:\s*['"`]([^'"`]+)['"`]\s*,\s*name:\s*['"`]?(\w+)['"`]?[\s\S]*?title:\s*['"`]([^'"`]*)['"`]/g);
    const routes = [];
    for (const m of routeMatches) {
        routes.push({ path: m[1], name: m[2], title: m[3] ?? "" });
    }
    return JSON.stringify(routes, null, 2);
}
async function handleListStores() {
    const files = listDirSafe("src/store").filter((f) => f.endsWith(".ts") && f !== "index.ts");
    return JSON.stringify(files.map((f) => f.replace(/\.ts$/, "")), null, 2);
}
async function handleReadProjectFile(args) {
    const relativePath = args?.relativePath;
    if (!relativePath || typeof relativePath !== "string") {
        return JSON.stringify({ error: "缺少参数 relativePath" });
    }
    const normalized = path.normalize(relativePath).replace(/^(\.\.\/)+/, "");
    if (normalized.startsWith("..") || path.isAbsolute(normalized)) {
        return JSON.stringify({ error: "relativePath 必须为相对项目根的路径" });
    }
    const content = readFileSafe(normalized);
    if (content === "") {
        return JSON.stringify({ error: `文件不存在或无法读取: ${normalized}` });
    }
    return content;
}
async function main() {
    const server = new Server({
        name: "dms-repair-mcp",
        version: "1.0.0",
    }, {
        capabilities: {
            tools: {},
        },
    });
    server.setRequestHandler(ListToolsRequestSchema, async () => ({
        tools: TOOLS,
    }));
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;
        const argsObj = args ?? {};
        try {
            let result;
            switch (name) {
                case "get_project_architecture":
                    result = await handleGetProjectArchitecture();
                    break;
                case "list_api_modules":
                    result = await handleListApiModules();
                    break;
                case "list_routes":
                    result = await handleListRoutes();
                    break;
                case "list_stores":
                    result = await handleListStores();
                    break;
                case "read_project_file":
                    result = await handleReadProjectFile(argsObj);
                    break;
                default:
                    result = JSON.stringify({ error: `未知工具: ${name}` });
            }
            return {
                content: [
                    {
                        type: "text",
                        text: result,
                    },
                ],
                isError: false,
            };
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({ error: message }),
                    },
                ],
                isError: true,
            };
        }
    });
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
