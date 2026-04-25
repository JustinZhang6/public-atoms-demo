# Atoms Demo - AI Agent 代码生成平台

## 项目概述
一个类似 atoms.dev 的 AI Agent 平台 Demo。用户输入自然语言描述，多个 AI Agent 协作生成完整可运行的 Web 应用，支持实时预览和交互。

## 关于 Atoms（来自官方文档）
Atoms 是一个多 Agent 协作的 AI 全栈开发平台。核心特点：
- 用户用自然语言描述需求，AI Team 自动完成开发
- 多个 Agent 角色协作，模拟真实开发团队
- 支持多种模式：Team Mode（全团队协作）、Engineer Mode（单工程师快速开发）、Race Mode（多模型竞赛）
- 包含 App Viewer 实时预览、可视化编辑、控制台调试
- 支持一键发布和分享

## Agent 团队角色（必须实现）
- 🎯 **Mike (Team Lead)**：协调需求，分发任务，监督全局，是用户的主要对话对象
- 📋 **Emma (PM)**：将需求转化为清晰的 PRD，功能拆解和优先级排序
- 🏗️ **Bob (Architect)**：设计系统蓝图，选择技术栈，确保架构可扩展
- 💻 **Alex (Engineer)**：全栈工程师，写前端到后端的所有代码
- 📊 **David (Data Analyst)**：数据分析和 AI 集成（可选展示）
- 🔍 **Iris (Deep Researcher)**：深度调研（可选展示）

## 核心页面与 UI 布局

### 工作台（核心页面）
参考 atoms.dev 的布局：
- **左侧聊天面板**：用户与 Agent Team 对话。显示各 Agent 的头像、名字、角色标签。每个 Agent 的消息有不同颜色标识
- **右侧 App Viewer**：实时预览生成的应用。类似 atoms.dev 的 App Viewer Block
- **顶部工具栏**：项目名称、代码/预览切换、发布按钮
- **中间可选代码面板**：可切换查看/编辑生成的代码文件

### 首页
- 产品介绍 + "Start Building" CTA
- 展示一些 Demo 项目案例（可以硬编码几个）

### 项目列表
- 展示用户的所有项目
- 创建新项目入口

## 技术栈
- **前端**：Next.js 15 + TypeScript + Tailwind CSS + shadcn/ui
- **后端**：Next.js API Routes
- **数据库**：SQLite（通过 better-sqlite3）
- **AI**：OpenAI GPT-4o API（代码生成，streaming）
- **代码编辑器**：@uiw/react-codemirror
- **预览**：iframe + srcdoc

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
  role TEXT NOT NULL, -- user / mike / emma / bob / alex / david / iris / system
  content TEXT NOT NULL,
  agent_name TEXT, -- 显示名
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
1. 用户输入需求描述
2. Mike(Lead) 接收需求，简要回应并分发任务
3. Emma(PM) 分析需求，输出功能点和用户故事
4. Bob(Architect) 设计技术方案和文件结构
5. Alex(Engineer) 生成代码（HTML+CSS+JS 打包在一起，便于 iframe 预览）
6. 生成的代码自动注入 iframe 实时预览
7. 用户可以继续对话迭代优化

关键：每个 Agent 的消息要实时 streaming 展示（打字机效果），让用户看到 Agent 团队的协作过程。

## 设计风格
- 深色主题（dark mode），科技感
- 渐变色背景，毛玻璃效果
- 参考 atoms.dev 的设计语言
- 精致的头像和角色标签

## 环境变量
- OPENAI_API_KEY：OpenAI API Key（必须）

## 重要注意事项
- 使用 App Router（不是 Pages Router）
- 确保所有功能端到端可用
- 代码质量要高，不是 prototype
- UI 必须精致专业
- 数据要持久化（SQLite）
- 部署友好（考虑 Vercel 或其他平台）
