import OpenAI from "openai";
import { z } from "zod";
import { AGENT_MAP } from "@/lib/agents";
import { buildFallbackHtml, deriveProjectName, ensureStandaloneHtml, streamFallbackHtml } from "@/lib/preview";
import { safeJsonParse } from "@/lib/utils";

const teamPlanSchema = z.object({
  projectName: z.string(),
  summary: z.string(),
  mike: z.string(),
  emma: z.string(),
  bob: z.string(),
  david: z.string(),
  iris: z.string(),
  alex: z.string(),
});

export type TeamPlan = z.infer<typeof teamPlanSchema>;

function createOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function buildFallbackPlan(prompt: string): TeamPlan {
  const projectName = deriveProjectName(prompt);
  return {
    projectName,
    summary: "用多 Agent 视角生成一个自包含、可直接预览的单页应用。",
    mike: `我会按“需求澄清 -> 方案拆分 -> 代码交付 -> 预览验证”推进 ${projectName}，优先保证运行链路稳定。`,
    emma: "核心功能要聚焦首屏价值表达、主要操作路径和可感知的交互反馈，避免堆砌无关模块。",
    bob: "技术方案采用单文件 HTML，内联 CSS/JS，界面走深色玻璃拟态风格，并确保移动端可用。",
    david: "我会补充关键指标或信息层次，让页面不只好看，也具备可读的数据节奏和优先级。",
    iris: "参考 atoms.dev 的工作台氛围，但保留独立的视觉表达，避免通用模板感。",
    alex: "我会交付完整 standalone HTML 文档，保证 iframe srcdoc 中脚本和样式都能直接运行。",
  };
}

export async function createTeamPlan(input: {
  prompt: string;
  currentName: string;
  previousHtml?: string;
}) {
  const fallback = buildFallbackPlan(input.prompt);
  const client = createOpenAIClient();

  if (!client) {
    return fallback;
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content:
            "You are the coordination engine for an Atoms-style multi-agent product team. Return JSON only. Provide concise, high-signal outputs for Mike, Emma, Bob, David, Iris, and Alex. Each field must be plain text, not markdown.",
        },
        {
          role: "user",
          content: JSON.stringify({
            projectName: input.currentName,
            prompt: input.prompt,
            previousHtml: input.previousHtml?.slice(0, 3500),
            requirements: [
              "Atoms-style multi-agent workflow",
              "Dark, polished, premium UI",
              "Final output must be a self-contained HTML document",
              "The preview will be rendered inside iframe srcdoc",
            ],
            outputShape: {
              projectName: "short product-style title",
              summary: "one sentence",
              mike: "team lead response",
              emma: "pm response",
              bob: "architect response",
              david: "data analyst response",
              iris: "research response",
              alex: "engineer delivery response",
            },
          }),
        },
      ],
    });

    const content = completion.choices[0]?.message.content ?? "";
    const parsed = teamPlanSchema.parse(safeJsonParse(content, fallback));

    return {
      ...parsed,
      projectName: parsed.projectName.trim() || fallback.projectName,
    };
  } catch {
    return fallback;
  }
}

export async function* streamGeneratedHtml(input: {
  prompt: string;
  plan: TeamPlan;
  previousHtml?: string;
}) {
  const projectName = input.plan.projectName || deriveProjectName(input.prompt);
  const client = createOpenAIClient();

  if (!client) {
    yield* streamFallbackHtml(input.prompt, projectName);
    return;
  }

  try {
    const stream = await client.chat.completions.create({
      model: "gpt-4o",
      stream: true,
      temperature: 0.8,
      messages: [
        {
          role: "system",
          content: `You are ${AGENT_MAP.alex.name}, an expert front-end engineer inside a multi-agent product team.
Return only a self-contained HTML document. No markdown fences. No explanations.
Rules:
- The document must include <!DOCTYPE html>, <html>, <head>, <body>
- Inline all CSS and JavaScript
- Do not use external assets, fonts, CDNs, or frameworks
- Make the UI premium, dark, responsive, and interactive
- The result must work standalone inside iframe srcdoc
- Prefer semantic HTML, accessible labels, and polished spacing`,
        },
        {
          role: "user",
          content: JSON.stringify({
            brief: input.prompt,
            projectName,
            plan: input.plan,
            currentHtml: input.previousHtml?.slice(0, 6000),
          }),
        },
      ],
    });

    let yielded = false;

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content ?? "";
      if (!delta) {
        continue;
      }
      yielded = true;
      yield delta;
    }

    if (!yielded) {
      yield buildFallbackHtml(input.prompt, projectName);
    }
  } catch {
    yield* streamFallbackHtml(input.prompt, projectName);
  }
}

export function finalizeGeneratedHtml(content: string, title: string) {
  return ensureStandaloneHtml(content, title);
}
