# Atoms Demo

> 多 Agent 协作的 AI 代码生成平台 — Take-Home Project

用户输入自然语言需求，6 个 AI Agent（Mike / Emma / Bob / David / Iris / Alex）以团队形式流式协作，最终生成可直接运行的自包含 HTML 应用，并通过 `iframe srcdoc` 实时预览。

**🔗 在线演示：** [https://atoms-demo-zz.loca.lt](https://atoms-demo-zz.loca.lt)

## 功能特性

- **Landing Page** — 深色渐变 + 玻璃拟态品牌首页
- **Project List** — SQLite 持久化的项目管理，含示例 seed 数据
- **Workspace** — 三栏工作台：聊天面板 / 代码编辑器 / 实时预览
- **多 Agent 协作** — Team Lead 接收需求 → 各 Agent 分析 → Engineer 交付代码
- **SSE 流式输出** — Agent 消息与代码生成全程流式，实时可见
- **代码编辑** — CodeMirror 编辑器，支持手动修改并保存
- **分享页** — 独立 URL 直接渲染生成的 HTML 应用
- **Fallback 模式** — 未配置 API Key 时，本地 fallback 保证完整链路可用

## 技术栈

| 层级 | 技术 |
| --- | --- |
| 框架 | Next.js 15 (App Router + Turbopack) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS |
| 数据库 | better-sqlite3 (SQLite) |
| AI 后端 | OpenAI-compatible API |
| 编辑器 | CodeMirror 6 |
| UI 组件 | Radix UI + shadcn 风格 |
| 校验 | Zod v4 |

## 本地运行

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入 OPENAI_API_KEY（支持任何 OpenAI-compatible API）

# 3. 启动开发服务器
npm run dev

# 4. 打开浏览器
open http://localhost:3000
```

## 环境变量

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `OPENAI_API_KEY` | 否 | OpenAI API Key；未配置时使用 fallback 模式 |
| `OPENAI_BASE_URL` | 否 | API 地址，默认 `https://api.openai.com/v1`；支持任何 OpenAI-compatible API |
| `AI_MODEL` | 否 | 模型名称，默认 `gpt-4o` |

> 未配置 API Key 时，系统自动切换到 fallback 模式：使用预设的 Agent 对话和示例 HTML 输出，完整链路仍可正常运行和演示。

## 项目结构

```
atoms-demo/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing Page
│   ├── projects/
│   │   ├── page.tsx              # 项目列表
│   │   └── [projectId]/page.tsx  # Workspace 工作台
│   ├── share/[projectId]/page.tsx # 分享预览页
│   └── api/                      # API Routes
│       └── projects/
│           ├── route.ts          # CRUD
│           └── [projectId]/
│               ├── route.ts     # 单项目操作
│               └── generate/route.ts  # SSE 生成
├── components/                   # React 组件
│   ├── home/                     # Landing 组件
│   ├── projects/                 # 项目列表组件
│   ├── workspace/                # 工作台组件
│   └── ui/                       # 基础 UI 组件
├── lib/                          # 核心逻辑
│   ├── ai.ts                     # AI 客户端 & 生成逻辑
│   ├── agents.ts                 # Agent 定义
│   ├── db.ts                     # SQLite 数据层
│   ├── projects.ts               # 项目 CRUD
│   ├── preview.ts                # HTML 预览 & Fallback
│   ├── types.ts                  # 类型定义
│   └── schemas.ts                # Zod 校验
└── .data/                        # SQLite 数据文件 (gitignored)
```

## 生成流程

```
用户输入 Prompt
    ↓
Mike (Team Lead) 接收需求
    ↓
生成 Team Plan JSON（各 Agent 分工）
    ↓
SSE 流式下发 Agent 消息到工作台
    ↓
Alex (Engineer) 流式生成 Standalone HTML
    ↓
实时注入 iframe srcdoc 预览
    ↓
代码 + HTML 保存到 SQLite
```

## 验证命令

```bash
npm run lint       # ESLint 检查
npm run typecheck  # TypeScript 类型检查
npm run build      # 生产构建
```

## Screenshots

<!-- TODO: 添加功能截图 -->

## License

MIT
