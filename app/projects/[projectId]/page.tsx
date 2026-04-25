import { notFound } from "next/navigation";
import { WorkspaceClient } from "@/components/workspace/workspace-client";
import { getProjectDetails } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function ProjectWorkspacePage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ prompt?: string }>;
}) {
  const { projectId } = await params;
  const { prompt } = await searchParams;
  const data = getProjectDetails(projectId);

  if (!data) {
    notFound();
  }

  return (
    <WorkspaceClient
      initialData={data}
      initialPrompt={prompt}
    />
  );
}
