# Atoms Demo - AI Agent 代码生成平台

## 项目概述
一个类似 atoms.dev 的 AI Agent 平台 Demo。用户输入自然语言描述，多个 AI Agent 协作生成完整可运行的 Web 应用，支持实时预览和交互。

## 核心功能
1. **对话式应用生成**：用户用自然语言描述想要的应用，AI 生成完整代码
2. **多 Agent 协作可视化**：展示 PM、Architect、Engineer 等角色的思考过程
3. **实时代码预览**：生成的代码在 iframe 沙箱中实时渲染预览
4. **代码编辑器**：用户可以手动编辑生成的代码
5. **项目管理**：保存、加载、管理多个项目（数据持久化）
6. **迭代优化**：对已生成的应用进行对话式修改

## 技术栈
- **前端**：Next.js 15 + TypeScript + Tailwind CSS + shadcn/ui
- **后端**：Next.js API Routes
- **数据库**：SQLite（通过 better-sqlite3）
- **AI**：OpenAI GPT-4o API（代码生成）
- **代码编辑器**：CodeMirror 或 Monaco Editor
- **预览**：iframe 沙箱 + srcdoc
- **部署**：Vercel

## 页面结构
1. **首页（/）**：展示产品介绍 + "Start Building" 按钮
2. **工作台（/workspace/[id]）**：核心页面
   - 左侧：对话面板（用户输入需求，Agent 回复展示思考过程）
   - 中间：代码编辑器（可切换文件，支持编辑）
   - 右侧：实时预览（iframe 渲染生成的 HTML/CSS/JS）
   - 顶部：项目信息 + 操作按钮
3. **项目列表（/projects）**：管理已保存的项目

## Agent 角色设计（展示协作过程）
- 🎯 **Emma (PM)**：分析需求，拆解功能点
- 🏗️ **Bob (Architect)**：设计技术方案和架构
- 💻 **Alex (Engineer)**：编写代码实现
- ✅ **Mike (Team Lead)**：审核整合，确保质量

## 数据模型
```sql
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  role TEXT NOT NULL, -- user / emma / bob / alex / mike
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE TABLE files (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  content TEXT NOT NULL,
  language TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id)
);
```

## AI 代码生成流程
1. 用户输入需求
2. Emma(PM) 分析需求，输出功能点列表
3. Bob(Architect) 设计技术方案，输出文件结构
4. Alex(Engineer) 逐个生成代码文件
5. Mike(Lead) 整合检查，输出最终可运行代码
6. 前端实时展示每个 Agent 的思考过程（打字机效果）
7. 生成的代码自动注入 iframe 预览

## 关键实现细节
- 代码生成用 OpenAI streaming API，实时展示生成过程
- iframe 预览用 srcdoc 注入 HTML+CSS+JS，支持 React/Vue 等框架（通过 CDN）
- 多 Agent 协作通过 prompt chain 实现（一个 API 调用链，前一个的输出作为后一个的输入）
- 数据持久化用 SQLite，简单可靠
- 代码编辑器用 @uiw/react-codemirror

## 环境变量
- OPENAI_API_KEY：OpenAI API Key
- DATABASE_URL：SQLite 数据库路径（默认 ./data/atoms.db）

## 注意事项
- 使用 App Router（不是 Pages Router）
- 所有 API 路由在 app/api/ 下
- SQLite 数据库文件存在 data/ 目录
- 部署到 Vercel 时 SQLite 改用 Turso 或其他方案（先不管部署，本地先跑通）
- UI 要精致，参考 atoms.dev 的设计风格（深色主题，科技感）

## 部署需求
- 需要在线可访问
- Vercel 部署（Next.js 原生支持）
- 或者 Railway/Render 等支持 SQLite 的平台
