import { NextResponse } from "next/server";
import { createProject, listProjects } from "@/lib/projects";
import { deriveProjectName } from "@/lib/preview";
import { createProjectSchema } from "@/lib/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(listProjects());
}

export async function POST(request: Request) {
  const payload = createProjectSchema.parse(await request.json());
  const project = createProject({
    name:
      payload.name?.trim() ||
      (payload.prompt ? deriveProjectName(payload.prompt) : "Untitled Build"),
    description:
      payload.description?.trim() ||
      payload.prompt?.trim().slice(0, 180) ||
      null,
  });

  return NextResponse.json(project, { status: 201 });
}
