import { NextResponse } from "next/server";
import { getProjectDetails, upsertFile } from "@/lib/projects";
import { saveFileSchema } from "@/lib/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ projectId: string }>;
};

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  const { projectId } = await params;
  const details = getProjectDetails(projectId);

  if (!details) {
    return NextResponse.json({ message: "Project not found." }, { status: 404 });
  }

  return NextResponse.json(details);
}

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
  const { projectId } = await params;
  const details = getProjectDetails(projectId);

  if (!details) {
    return NextResponse.json({ message: "Project not found." }, { status: 404 });
  }

  const payload = saveFileSchema.parse(await request.json());
  const file = upsertFile({
    projectId,
    filename: payload.filename,
    content: payload.content,
    language: payload.language ?? "html",
  });

  return NextResponse.json(file);
}
