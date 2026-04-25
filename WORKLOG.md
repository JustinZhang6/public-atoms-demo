# WORKLOG.md

## Current State / Handoff
- Goal（当前目标）：交付可用于 take-home 展示的 Atoms Demo，全链路覆盖 landing、project list、workspace、SQLite 持久化、分享页与 OpenAI/fallback 生成链路。
- Active worktrees / branches（最多列 3–5 个）：
  - 当前工作区 @ `main`：收尾文档、验证和 milestone commits
- Entry points（关键入口命令，1–3 条即可）：
  - `npm run dev`
  - `npm run lint`
  - `npm run build`
- Risks / Boundaries（风险/边界：生产/数据/权限/破坏性操作）：
  - 当前环境缺少 `OPENAI_API_KEY`，已验证 fallback 流程，真实 `gpt-4o` streaming 代码已接入但未在本机实测
  - SQLite 数据落在 `/.data/atoms-demo.sqlite`，本地联调会持续写入项目与消息记录
- Next（下一步谁做什么）：
  - 配置 `.env.local` 后验证真实 OpenAI 流式生成
  - 如需交付给招聘方，可基于当前 milestone commits 再做一次轻量 demo 数据清理

## History
### 2026-04-25 初始化并完成 Atoms Demo 主链路
- 背景：空仓库起步，需要在 Next.js 15 + TypeScript + Tailwind 上完成 take-home 要求的全量产品体验。
- 结论：
  - 初始化了 Next.js 15 工程，并搭建深色玻璃风 landing、项目列表、工作台和分享页
  - 接入 SQLite 持久化、SSE 消息流、CodeMirror 编辑和 `iframe srcdoc` 预览
  - OpenAI 侧实现了 `gpt-4o` plan + HTML 双阶段生成，并保留 fallback 便于无 key 联调
  - 已手测 API 全链路：创建项目、生成 HTML、保存文件、分享页渲染均通过
- 关键命令/路径：
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build`
  - `app/api/projects/[projectId]/generate/route.ts`
  - `components/workspace/workspace-client.tsx`
  - `lib/ai.ts`
- 坑点：
  - Next 15 的动态 `params` / `searchParams` 需要按 `Promise` 处理
  - fallback HTML 不能走按词切块，否则会破坏 `iframe srcdoc` 中的脚本和样式
  - `eslint .` 需要显式忽略 `.next/`，否则 build 后会把生成产物扫出大量假错误
- 风险/回滚：
  - 若真实 OpenAI 输出不稳定，可先回退到 fallback 逻辑确认工作台与预览链路本身无问题
  - 若本地数据需要清理，可删除 `/.data/atoms-demo.sqlite` 后重新启动
