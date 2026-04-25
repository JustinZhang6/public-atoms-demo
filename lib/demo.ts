import type { AgentRole, LandingCaseStudy } from "@/lib/types";

export const LANDING_CASE_STUDIES: LandingCaseStudy[] = [
  {
    title: "Pulseboard",
    category: "Analytics SaaS",
    description:
      "一个高信息密度的运营仪表盘，包含 KPI、漏斗、地域热力图和实时告警。",
    highlights: ["Charts", "Dark UI", "Live filters"],
    background:
      "radial-gradient(circle at top, rgba(56,189,248,0.45), rgba(15,23,42,0.25) 40%), linear-gradient(135deg, #14213d, #030712)",
  },
  {
    title: "Atelier Commerce",
    category: "Luxury Retail",
    description:
      "强调视觉故事与转化体验的电商首页，包含产品故事段落、精选系列和动线 CTA。",
    highlights: ["Editorial", "Cinematic", "Responsive"],
    background:
      "radial-gradient(circle at top left, rgba(244,114,182,0.35), transparent 45%), linear-gradient(135deg, #2d1b28, #09090b)",
  },
  {
    title: "Focus Habitat",
    category: "Productivity App",
    description:
      "面向习惯管理的单页应用，带有 streak、打卡面板、提醒和轻量统计。",
    highlights: ["Vanilla JS", "Standalone", "Embeddable"],
    background:
      "radial-gradient(circle at top left, rgba(16,185,129,0.42), transparent 42%), linear-gradient(135deg, #052e2b, #020617)",
  },
];

interface SeedMessage {
  role: AgentRole;
  agent_name: string | null;
  content: string;
}

interface SeedProject {
  name: string;
  description: string;
  html: string;
  messages: SeedMessage[];
}

const HABIT_DEMO_HTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Focus Habitat</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #07111f;
        --card: rgba(15, 23, 42, 0.72);
        --text: #e2e8f0;
        --muted: #94a3b8;
        --accent: #22d3ee;
        --success: #34d399;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        font-family: "Inter", "Segoe UI", sans-serif;
        background:
          radial-gradient(circle at top left, rgba(34, 211, 238, 0.22), transparent 35%),
          radial-gradient(circle at bottom right, rgba(52, 211, 153, 0.18), transparent 32%),
          linear-gradient(180deg, #0b1220, #030712 70%);
        color: var(--text);
      }
      .shell {
        width: min(1120px, calc(100% - 32px));
        margin: 24px auto;
        display: grid;
        gap: 16px;
      }
      .hero, .panel {
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: var(--card);
        backdrop-filter: blur(18px);
        border-radius: 28px;
        padding: 24px;
        box-shadow: 0 24px 60px rgba(2, 6, 23, 0.28);
      }
      .hero {
        display: grid;
        gap: 24px;
        grid-template-columns: 1.2fr 0.8fr;
      }
      .stats, .tasks {
        display: grid;
        gap: 14px;
      }
      .stats { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .stat {
        border-radius: 22px;
        padding: 16px;
        background: rgba(255,255,255,0.05);
      }
      .dashboard {
        display: grid;
        gap: 16px;
        grid-template-columns: 1.05fr 0.95fr;
      }
      .chart {
        display: flex;
        align-items: end;
        gap: 12px;
        height: 180px;
        padding-top: 12px;
      }
      .bar {
        flex: 1;
        border-radius: 18px 18px 10px 10px;
        background: linear-gradient(180deg, rgba(34,211,238,0.95), rgba(56,189,248,0.2));
      }
      button {
        border: none;
        border-radius: 999px;
        padding: 12px 18px;
        background: linear-gradient(135deg, #22d3ee, #34d399);
        color: #06202a;
        font-weight: 700;
        cursor: pointer;
      }
      .task {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 16px;
        border-radius: 18px;
        background: rgba(255,255,255,0.04);
      }
      .pill {
        border-radius: 999px;
        padding: 8px 12px;
        background: rgba(34, 211, 238, 0.12);
        color: #a5f3fc;
        font-size: 12px;
      }
      .done { text-decoration: line-through; color: var(--muted); }
      @media (max-width: 860px) {
        .hero, .dashboard { grid-template-columns: 1fr; }
        .stats { grid-template-columns: 1fr; }
      }
    </style>
  </head>
  <body>
    <div class="shell">
      <section class="hero">
        <div>
          <div class="pill">Focus Habitat</div>
          <h1 style="font-size: clamp(2.3rem, 5vw, 4.2rem); margin: 18px 0 12px;">
            Habit streaks that feel alive.
          </h1>
          <p style="color: var(--muted); line-height: 1.7;">
            Track rituals, protect deep work, and keep your momentum visible with a
            calm dashboard optimized for small daily wins.
          </p>
          <div style="display:flex; gap:12px; margin-top:24px; flex-wrap:wrap;">
            <button id="completeBtn">Complete Today's Ritual</button>
            <div class="pill" id="statusPill">Current streak: 18 days</div>
          </div>
        </div>
        <div class="panel" style="margin:0;">
          <p style="margin:0; color:var(--muted);">This week</p>
          <div class="chart">
            <div class="bar" style="height:55%;"></div>
            <div class="bar" style="height:78%;"></div>
            <div class="bar" style="height:62%;"></div>
            <div class="bar" style="height:92%;"></div>
            <div class="bar" style="height:71%;"></div>
            <div class="bar" style="height:84%;"></div>
            <div class="bar" style="height:96%;"></div>
          </div>
        </div>
      </section>
      <div class="stats">
        <div class="stat">
          <p style="margin:0; color:var(--muted);">Consistency</p>
          <h2 style="margin:12px 0 0; font-size:2rem;">92%</h2>
        </div>
        <div class="stat">
          <p style="margin:0; color:var(--muted);">Deep work hours</p>
          <h2 style="margin:12px 0 0; font-size:2rem;">31.5h</h2>
        </div>
        <div class="stat">
          <p style="margin:0; color:var(--muted);">Recoveries</p>
          <h2 style="margin:12px 0 0; font-size:2rem;">4</h2>
        </div>
      </div>
      <section class="dashboard">
        <div class="panel">
          <p style="margin-top:0; color:var(--muted);">Today’s rituals</p>
          <div class="tasks" id="taskList">
            <div class="task"><span>Morning review</span><span class="pill">Done</span></div>
            <div class="task"><span>45 min deep work</span><span class="pill">Queued</span></div>
            <div class="task"><span>Read 20 pages</span><span class="pill">Queued</span></div>
          </div>
        </div>
        <div class="panel">
          <p style="margin-top:0; color:var(--muted);">Coach note</p>
          <h3 style="margin:12px 0;">Momentum compounds when recovery is visible.</h3>
          <p style="color:var(--muted); line-height:1.7;">
            Keep your hardest task early, then protect energy with one lightweight win
            before noon. Use the ritual queue to avoid decision fatigue.
          </p>
        </div>
      </section>
    </div>
    <script>
      const status = document.getElementById("statusPill");
      const list = document.getElementById("taskList");
      const button = document.getElementById("completeBtn");
      let streak = 18;
      button.addEventListener("click", () => {
        streak += 1;
        status.textContent = "Current streak: " + streak + " days";
        const firstTask = list.children[1];
        if (firstTask) {
          firstTask.querySelector("span").classList.add("done");
          firstTask.lastElementChild.textContent = "Done";
          firstTask.lastElementChild.style.background = "rgba(52,211,153,0.14)";
          firstTask.lastElementChild.style.color = "#bbf7d0";
        }
      });
    </script>
  </body>
</html>`;

const ANALYTICS_DEMO_HTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pulseboard</title>
    <style>
      :root { color-scheme: dark; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        background:
          radial-gradient(circle at top right, rgba(192, 132, 252, 0.24), transparent 30%),
          radial-gradient(circle at top left, rgba(34,211,238,0.18), transparent 28%),
          linear-gradient(180deg, #0f172a, #020617 70%);
        color: #e2e8f0;
        font-family: "Inter", "Segoe UI", sans-serif;
      }
      .shell {
        width: min(1180px, calc(100% - 32px));
        margin: 24px auto;
        display: grid;
        gap: 16px;
      }
      .top, .panel {
        border-radius: 28px;
        border: 1px solid rgba(255,255,255,0.08);
        background: rgba(15,23,42,0.72);
        backdrop-filter: blur(16px);
        box-shadow: 0 24px 60px rgba(2,6,23,0.3);
      }
      .top {
        padding: 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 18px;
        flex-wrap: wrap;
      }
      .kpis {
        display: grid;
        gap: 16px;
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
      .panel { padding: 20px; }
      .grid {
        display: grid;
        gap: 16px;
        grid-template-columns: 1.2fr 0.8fr;
      }
      .kpi {
        padding: 18px;
        border-radius: 24px;
        background: rgba(255,255,255,0.04);
      }
      .line {
        display: flex;
        align-items: end;
        gap: 10px;
        height: 220px;
      }
      .line span {
        flex: 1;
        border-radius: 16px 16px 10px 10px;
        background: linear-gradient(180deg, #c084fc, rgba(34,211,238,0.15));
      }
      table { width: 100%; border-collapse: collapse; }
      td, th { padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); text-align: left; }
      .tag {
        display: inline-flex;
        padding: 7px 10px;
        border-radius: 999px;
        background: rgba(34,211,238,0.12);
        color: #a5f3fc;
        font-size: 12px;
      }
      @media (max-width: 860px) {
        .kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .grid { grid-template-columns: 1fr; }
      }
    </style>
  </head>
  <body>
    <div class="shell">
      <section class="top">
        <div>
          <div class="tag">Realtime analytics</div>
          <h1 style="margin:14px 0 12px; font-size: clamp(2rem, 5vw, 3.5rem);">Pulseboard</h1>
          <p style="margin:0; color:#94a3b8; max-width: 560px; line-height: 1.7;">
            Executive KPI board for revenue, conversion, and channel efficiency with a
            bias toward scannability.
          </p>
        </div>
        <div style="display:flex; gap:12px; flex-wrap:wrap;">
          <div class="tag">North America</div>
          <div class="tag">7 day window</div>
        </div>
      </section>
      <section class="kpis">
        <div class="kpi"><p style="margin:0; color:#94a3b8;">Revenue</p><h2 style="font-size:2rem;">$428K</h2></div>
        <div class="kpi"><p style="margin:0; color:#94a3b8;">Conversion</p><h2 style="font-size:2rem;">4.8%</h2></div>
        <div class="kpi"><p style="margin:0; color:#94a3b8;">CAC</p><h2 style="font-size:2rem;">$28</h2></div>
        <div class="kpi"><p style="margin:0; color:#94a3b8;">Retention</p><h2 style="font-size:2rem;">89%</h2></div>
      </section>
      <section class="grid">
        <div class="panel">
          <p style="margin-top:0; color:#94a3b8;">Revenue trend</p>
          <div class="line">
            <span style="height:52%"></span>
            <span style="height:64%"></span>
            <span style="height:60%"></span>
            <span style="height:76%"></span>
            <span style="height:88%"></span>
            <span style="height:82%"></span>
            <span style="height:96%"></span>
          </div>
        </div>
        <div class="panel">
          <p style="margin-top:0; color:#94a3b8;">Alerts</p>
          <table>
            <tr><th>Event</th><th>Status</th></tr>
            <tr><td>Email CTR dipped</td><td><span class="tag">Investigate</span></td></tr>
            <tr><td>Paid social up 18%</td><td><span class="tag">Healthy</span></td></tr>
            <tr><td>Mobile checkout lag</td><td><span class="tag">Fix queued</span></td></tr>
          </table>
        </div>
      </section>
    </div>
  </body>
</html>`;

export const SEED_PROJECTS: SeedProject[] = [
  {
    name: "Focus Habitat",
    description: "习惯追踪与专注力管理单页应用。",
    html: HABIT_DEMO_HTML,
    messages: [
      {
        role: "mike",
        agent_name: "Mike",
        content: "用户想要一个注重节奏感与激励反馈的 habits app，我会让团队按“仪表盘 + 互动微反馈 + 自包含 HTML”推进。",
      },
      {
        role: "emma",
        agent_name: "Emma",
        content: "核心需求包括 streak、今日任务、周趋势和提醒反馈；首屏必须一眼看到当前状态和行动按钮。",
      },
      {
        role: "bob",
        agent_name: "Bob",
        content: "采用单文件 HTML 结构，CSS 做玻璃拟态层次，JS 仅负责 streak 更新与任务完成交互，保证 iframe srcdoc 独立运行。",
      },
      {
        role: "alex",
        agent_name: "Alex",
        content: "已交付 standalone `index.html`，包含响应式布局、渐变背景和原生交互，无需任何外部依赖。",
      },
    ],
  },
  {
    name: "Pulseboard",
    description: "高信息密度的增长分析仪表盘。",
    html: ANALYTICS_DEMO_HTML,
    messages: [
      {
        role: "mike",
        agent_name: "Mike",
        content: "目标是一个可在面试中直接展示的信息密度型 dashboard，重点突出 KPI 可扫读性和高对比视觉。",
      },
      {
        role: "emma",
        agent_name: "Emma",
        content: "优先展示 revenue、conversion、CAC 和 retention，同时要补充告警区帮助用户快速判断下一步行动。",
      },
      {
        role: "bob",
        agent_name: "Bob",
        content: "文件结构继续采用 self-contained HTML，避免外部图表库，通过 CSS bars 模拟 trend 视图以保证可复制部署。",
      },
      {
        role: "alex",
        agent_name: "Alex",
        content: "已交付 `index.html` 仪表盘，顶部 KPI、趋势图和 alerts table 均可在 iframe 中直接运行。",
      },
    ],
  },
];
