import { NextResponse } from "next/server";
import { AGENT_MAP } from "@/lib/agents";
import { createTeamPlan, finalizeGeneratedHtml, streamGeneratedHtml } from "@/lib/ai";
import {
  createMessage,
  getProjectDetails,
  updateProject,
  upsertFile,
} from "@/lib/projects";
import { generateProjectSchema } from "@/lib/schemas";
import { chunkText } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const encoder = new TextEncoder();
type RouteContext = {
  params: Promise<{ projectId: string }>;
};

function toSse(event: string, payload: unknown) {
  return encoder.encode(`event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(
  request: Request,
  { params }: RouteContext,
) {
  const { projectId } = await params;
  const details = getProjectDetails(projectId);

  if (!details) {
    return NextResponse.json({ message: "Project not found." }, { status: 404 });
  }

  const payload = generateProjectSchema.parse(await request.json());
  const previousHtml = details.files.find((file) => file.filename === "index.html")?.content;

  createMessage({
    projectId,
    role: "user",
    content: payload.prompt,
    agentName: "You",
  });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const plan = await createTeamPlan({
          prompt: payload.prompt,
          currentName: details.project.name,
          previousHtml,
        });

        const nextProject = updateProject(projectId, {
          name: plan.projectName,
          description: payload.prompt.slice(0, 180),
        });

        if (nextProject) {
          controller.enqueue(toSse("meta", { project: nextProject }));
        }

        const roleOrder = ["mike", "emma", "bob", "david", "iris", "alex"] as const;

        for (const role of roleOrder) {
          const content = plan[role].trim();
          if (!content) {
            continue;
          }

          const savedMessage = createMessage({
            projectId,
            role,
            content,
            agentName: AGENT_MAP[role].name,
          });

          controller.enqueue(
            toSse("message-start", {
              message: savedMessage,
            }),
          );

          for (const chunk of chunkText(content, 28)) {
            controller.enqueue(
              toSse("message-delta", {
                messageId: savedMessage.id,
                chunk,
              }),
            );
            await sleep(18);
          }

          controller.enqueue(
            toSse("message-end", {
              messageId: savedMessage.id,
            }),
          );
          await sleep(40);
        }

        controller.enqueue(
          toSse("file-reset", {
            filename: "index.html",
            language: "html",
          }),
        );

        let html = "";
        for await (const chunk of streamGeneratedHtml({
          prompt: payload.prompt,
          plan,
          previousHtml,
        })) {
          html += chunk;
          controller.enqueue(
            toSse("file-delta", {
              filename: "index.html",
              chunk,
            }),
          );
        }

        const finalizedHtml = finalizeGeneratedHtml(html, plan.projectName);
        const savedFile = upsertFile({
          projectId,
          filename: "index.html",
          content: finalizedHtml,
          language: "html",
        });

        controller.enqueue(
          toSse("file-complete", {
            file: savedFile,
          }),
        );

        const finalProject = getProjectDetails(projectId)?.project;
        if (finalProject) {
          controller.enqueue(toSse("done", { project: finalProject }));
        }
      } catch (error) {
        controller.enqueue(
          toSse("error", {
            message:
              error instanceof Error
                ? error.message
                : "Generation failed unexpectedly.",
          }),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
