import { stripMarkdownCodeFence } from "@/lib/utils";

function chunkRawString(value: string, chunkSize = 260) {
  if (!value) {
    return [];
  }

  const chunks: string[] = [];
  for (let index = 0; index < value.length; index += chunkSize) {
    chunks.push(value.slice(index, index + chunkSize));
  }

  return chunks;
}

function extractPromptTitle(prompt: string) {
  return prompt
    .replace(/[^\w\s-]/g, " ")
    .trim()
    .split(/\s+/)
    .slice(0, 4)
    .map((chunk) => chunk[0]?.toUpperCase() + chunk.slice(1).toLowerCase())
    .join(" ");
}

export function deriveProjectName(prompt: string) {
  const title = extractPromptTitle(prompt);
  return title.length > 2 ? title : "Untitled Build";
}

export function ensureStandaloneHtml(content: string, fallbackTitle = "Generated App") {
  const trimmed = stripMarkdownCodeFence(content);

  if (/<!doctype html>/i.test(trimmed) || /<html[\s>]/i.test(trimmed)) {
    return trimmed;
  }

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${fallbackTitle}</title>
  </head>
  <body>
    ${trimmed}
  </body>
</html>`;
}

export function buildFallbackHtml(prompt: string, projectName: string) {
  const lowerPrompt = prompt.toLowerCase();
  const theme = lowerPrompt.includes("dashboard")
    ? "analytics"
    : lowerPrompt.includes("shop") || lowerPrompt.includes("commerce")
      ? "commerce"
      : lowerPrompt.includes("portfolio")
        ? "portfolio"
        : "workspace";

  const featureBlocks =
    theme === "analytics"
      ? [
          ["KPI overview", "Show headline metrics, change deltas, and decision alerts."],
          ["Trend panels", "Use compact bars and segmentation with clear hierarchy."],
          ["Action queue", "List issues to investigate with ownership and severity."],
        ]
      : theme === "commerce"
        ? [
            ["Hero collection", "Lead with editorial imagery, copy, and primary CTA."],
            ["Featured picks", "Present products in cards with narrative descriptions."],
            ["Client trust", "Add shipping, returns, and craftsmanship highlights."],
          ]
        : theme === "portfolio"
          ? [
              ["Signature intro", "High-contrast headline with personal positioning."],
              ["Selected work", "Project grid with outcomes and craft notes."],
              ["Proof section", "Testimonials, metrics, and contact CTA."],
            ]
          : [
              ["Command deck", "Anchor the app with a strong title and concise summary."],
              ["Feature stack", "Show three differentiated capability cards."],
              ["Interactive panel", "Add a simple JS interaction to prove runtime behavior."],
            ];

  const cards = featureBlocks
    .map(
      ([title, copy], index) => `
        <article class="card">
          <span class="eyebrow">0${index + 1}</span>
          <h3>${title}</h3>
          <p>${copy}</p>
        </article>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #07111f;
        --card: rgba(15, 23, 42, 0.72);
        --text: #e2e8f0;
        --muted: #94a3b8;
        --accent: #22d3ee;
        --accent-2: #34d399;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        font-family: Inter, "Segoe UI", sans-serif;
        color: var(--text);
        background:
          radial-gradient(circle at top left, rgba(34,211,238,0.2), transparent 28%),
          radial-gradient(circle at 80% 10%, rgba(52,211,153,0.16), transparent 30%),
          linear-gradient(180deg, #0f172a, #020617 72%);
      }
      .shell {
        width: min(1100px, calc(100% - 32px));
        margin: 24px auto;
        display: grid;
        gap: 16px;
      }
      .hero, .card, .panel {
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 28px;
        background: var(--card);
        box-shadow: 0 24px 80px rgba(2, 6, 23, 0.28);
        backdrop-filter: blur(18px);
      }
      .hero {
        padding: 28px;
        display: grid;
        gap: 16px;
        grid-template-columns: 1.1fr 0.9fr;
      }
      .hero h1 {
        margin: 0;
        font-size: clamp(2.4rem, 7vw, 4.6rem);
        line-height: 0.95;
      }
      .hero p { color: var(--muted); line-height: 1.7; }
      .meta {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 22px;
      }
      .pill {
        border-radius: 999px;
        padding: 10px 14px;
        background: rgba(255,255,255,0.05);
        color: #cbd5e1;
        font-size: 13px;
      }
      button {
        border: none;
        padding: 13px 18px;
        border-radius: 999px;
        background: linear-gradient(135deg, var(--accent), var(--accent-2));
        color: #04212a;
        font-weight: 700;
        cursor: pointer;
      }
      .grid {
        display: grid;
        gap: 16px;
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
      .card {
        padding: 22px;
      }
      .eyebrow {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 34px;
        height: 34px;
        border-radius: 999px;
        background: rgba(34,211,238,0.12);
        color: #a5f3fc;
        font-size: 12px;
      }
      .panel {
        padding: 22px;
      }
      .panel-grid {
        display: grid;
        gap: 12px;
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
      .panel-grid > div {
        border-radius: 20px;
        background: rgba(255,255,255,0.04);
        padding: 16px;
      }
      @media (max-width: 860px) {
        .hero, .grid, .panel-grid { grid-template-columns: 1fr; }
      }
    </style>
  </head>
  <body>
    <div class="shell">
      <section class="hero">
        <div>
          <div class="pill">Generated fallback preview</div>
          <h1>${projectName}</h1>
          <p>${prompt}</p>
          <div class="meta">
            <button id="pulseBtn">Trigger interaction</button>
            <div class="pill" id="pulseStatus">System ready</div>
          </div>
        </div>
        <div class="panel">
          <p style="margin-top:0; color:var(--muted);">Delivery notes</p>
          <div class="panel-grid">
            <div><strong>Standalone</strong><p style="color:var(--muted);">Runs inside iframe srcdoc.</p></div>
            <div><strong>Responsive</strong><p style="color:var(--muted);">Single file layout adapts across sizes.</p></div>
            <div><strong>Interactive</strong><p style="color:var(--muted);">Includes JS state to prove runtime behavior.</p></div>
          </div>
        </div>
      </section>
      <section class="grid">
        ${cards}
      </section>
    </div>
    <script>
      const status = document.getElementById("pulseStatus");
      const button = document.getElementById("pulseBtn");
      let count = 0;
      button.addEventListener("click", () => {
        count += 1;
        status.textContent = "Interaction count: " + count;
      });
    </script>
  </body>
</html>`;
}

export async function* streamFallbackHtml(prompt: string, projectName: string) {
  const html = buildFallbackHtml(prompt, projectName);
  const chunks = chunkRawString(html, 260);
  for (const chunk of chunks) {
    yield chunk;
    await new Promise((resolve) => setTimeout(resolve, 12));
  }
}
