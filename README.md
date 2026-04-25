# Atoms Demo

一个面向 take-home 场景实现的 Atoms 风格 AI Agent 代码生成平台 Demo。用户输入自然语言需求后，Mike / Emma / Bob / David / Iris / Alex 以多 Agent 形式流式协作，最终生成可直接运行的自包含 HTML，并通过 `iframe srcdoc` 实时预览。

## 功能

- Landing page：深色渐变 + 玻璃拟态产品首页
- Project list：SQLite 持久化的项目列表和示例 seed 数据
- Workspace：聊天面板、代码面板、实时预览三栏工作台
- AI pipeline：先生成多 Agent plan，再由 Alex 以 `gpt-4o` 流式输出 standalone HTML
- Preview：将生成结果保存为 `index.html`，实时注入 `iframe srcdoc`
- Share page：独立的分享预览页，可直接渲染 SQLite 中保存的 HTML
- Fallback：未配置 `OPENAI_API_KEY` 时，仍可通过本地 fallback 流程完整联调

## 技术栈

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- better-sqlite3
- OpenAI Node SDK
- CodeMirror
- Radix UI primitives / shadcn 风格基础组件

## 本地运行

1. 安装依赖

```bash
npm install
```

2. 配置环境变量

```bash
cp .env.example .env.local
```

3. 启动开发服务器

```bash
npm run dev
```

4. 打开

```bash
http://localhost:3000
```

## 环境变量

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `OPENAI_API_KEY` | 否 | 配置后走真实 `gpt-4o` 流式生成；未配置时使用 fallback plan + fallback HTML |

## 验证命令

静态检查：

```bash
npm run lint
```

类型检查：

```bash
npm run typecheck
```

生产构建：

```bash
npm run build
```

## 数据与目录

- SQLite 文件：`.data/atoms-demo.sqlite`
- 主要页面：`/`、`/projects`、`/projects/[projectId]`、`/share/[projectId]`
- 主要 API：`/api/projects`、`/api/projects/[projectId]`、`/api/projects/[projectId]/generate`

## 生成流程

1. 用户创建项目并输入 prompt
2. Mike 作为 Team Lead 接收需求并触发多 Agent 协作
3. 服务端先生成 team plan JSON
4. 各 Agent 消息以 SSE 分块下发到工作台
5. Alex 生成完整 standalone HTML，流式写入 `index.html`
6. 前端将内容实时注入 `iframe srcdoc`
7. 用户可继续编辑代码并保存回 SQLite

## 当前状态

- 已完成端到端链路：创建项目、流式生成、HTML 落库、手动保存、分享页渲染
- 已验证 fallback 链路
- 当前环境未配置 `OPENAI_API_KEY`，因此未实测真实 OpenAI streaming
