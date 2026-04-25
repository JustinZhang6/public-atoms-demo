# Atoms Demo — 交付说明

## 项目简介

Atoms Demo 是一个多 Agent 协作的 AI 代码生成平台，灵感来源于 [atoms.dev](https://atoms.dev)。用户输入自然语言需求后，6 个 AI Agent 以团队形式流式协作，实时生成可运行的 Web 应用并即时预览。

## 演示地址

- **🔗 在线演示：** [https://atoms-demo-zz.loca.lt](https://atoms-demo-zz.loca.lt)
- **📦 GitHub 仓库：** <!-- 创建后填入 -->

## 技术栈

| 技术 | 版本 | 用途 |
| --- | --- | --- |
| Next.js | 15 (App Router) | 全栈框架，Turbopack 开发 |
| TypeScript | 5.x | 类型安全 |
| Tailwind CSS | 3.4 | 样式系统 |
| better-sqlite3 | 12.x | 本地持久化 |
| OpenAI SDK | 6.x | AI 接口（兼容 Step 3.5） |
| Step 3.5 Flash | — | AI 后端（api.stepfun.com） |
| CodeMirror | 6 | 代码编辑器 |
| Radix UI | — | 无头 UI 组件 |
| Zod | 4.x | 运行时校验 |

## 核心功能

### 1. 多 Agent 团队协作
6 个 AI Agent 各司其职，模拟真实产品团队：
- **Mike (Team Lead)** — 接收需求、协调分工、监督全局
- **Emma (PM)** — 需求分析与功能拆解
- **Bob (Architect)** — 技术方案设计
- **David (Data Analyst)** — 数据层与信息架构
- **Iris (Researcher)** — 调研与参考建议
- **Alex (Engineer)** — 交付完整可运行代码

### 2. SSE 流式生成
- 前端通过 Server-Sent Events 实时接收 Agent 消息和代码输出
- 用户可观察到完整的「思考 → 讨论 → 编码」过程
- 代码逐字符流入编辑器和预览区

### 3. 三栏工作台
- **左栏 — 聊天面板**：Agent 对话流，展示各角色讨论过程
- **中栏 — 代码编辑器**：CodeMirror 实时显示生成的 HTML，支持手动编辑和保存
- **右栏 — 实时预览**：`iframe srcdoc` 注入，即时渲染生成结果

### 4. SQLite 持久化
- 项目元数据、消息记录、生成的代码文件全部持久化到 SQLite
- 页面刷新后状态完整保留
- 内置 seed 数据，首次访问即有示例项目

### 5. 分享功能
- 每个项目有独立的分享 URL（`/share/[projectId]`）
- 分享页直接渲染 SQLite 中保存的 HTML 应用

### 6. Fallback 模式
- 未配置 API Key 时，系统使用预设的 Agent 对话和示例 HTML
- 保证端到端链路完整可演示，无需外部依赖

## 架构设计亮点

1. **OpenAI-Compatible 接入层**：通过 OpenAI SDK + 自定义 baseURL，一行配置即可切换不同 AI 后端（当前使用 Step 3.5 Flash）
2. **双阶段生成**：先生成 Team Plan JSON（各 Agent 分工），再由 Alex 流式输出最终 HTML，兼顾协作感与执行效率
3. **SSE 流式架构**：Agent 消息与代码输出统一走 Server-Sent Events，前端按事件类型分流到聊天面板和代码编辑器
4. **SQLite 本地持久化**：better-sqlite3 同步 API，零配置、无外部依赖，适合 Demo 场景
5. **Graceful Degradation**：AI 不可用时自动降级到 fallback，保证核心体验不中断
6. **自包含 HTML 输出**：生成结果为完整的 standalone HTML（内联 CSS/JS），通过 `iframe srcdoc` 安全沙箱渲染，无跨域问题

## 运行方法

```bash
# 克隆仓库
git clone <REPO_URL>
cd atoms-demo

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入 STEP_API_KEY（可选，不填则使用 fallback 模式）

# 启动
npm run dev

# 访问 http://localhost:3000
```

## 验证

```bash
npm run lint       # ✅ ESLint 通过
npm run typecheck  # ✅ TypeScript 检查通过
npm run build      # ✅ 生产构建通过
```

## 时间花费

约 **1 天**（~10 小时有效编码时间），包含：
- 需求分析与 atoms.dev 调研：~1h
- 工程搭建与设计系统：~2h
- SQLite 持久化与 CRUD：~1.5h
- 多 Agent 工作台与 SSE 流式链路：~3h
- AI 后端接入与 fallback：~1.5h
- 收尾、文档与部署：~1h

## 待改进项

> 以下是受限于时间未完成的方向，如果有更多时间会继续迭代：

1. **真实多 Agent 并发**：当前是串行（Plan → 各 Agent 消息 → Alex 编码），理想情况应支持 Agent 间真正的并发讨论和互相引用
2. **对话式迭代**：目前每次生成是独立的，应支持基于上一轮结果的追加修改（"把按钮改成蓝色"）
3. **多文件项目**：当前输出是单个 HTML 文件，完整方案应支持多文件项目结构和 WebContainer 运行
4. **用户认证**：当前无登录系统，项目对所有访问者可见
5. **移动端适配**：工作台三栏布局在小屏设备上需要改为 Tab 切换
6. **错误边界**：AI 生成失败时的用户提示和重试体验可以更友好
7. **测试覆盖**：缺少单元测试和 E2E 测试

## Git History

```
38a3a64 feat: switch AI backend to Step 3.5 (OpenAI-compatible)
698aa5e 补充交付文档与运行配置说明
f01882c 实现多 Agent 工作台与流式预览链路
d6930d9 添加 SQLite 持久化与项目目录页
8424df5 初始化 Next.js 15 工程与品牌化落地页
2abe8ff update: refined spec based on atoms.dev docs research
890902d init: project spec
```

每个 commit 对应一个清晰的功能里程碑，commit message 包含变更原因说明。
