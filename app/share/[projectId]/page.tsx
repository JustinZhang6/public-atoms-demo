import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getProjectDetails } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function SharePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const data = getProjectDetails(projectId);

  if (!data) {
    notFound();
  }

  const html = data.files.find((file) => file.filename === "index.html")?.content ?? "";

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-6 py-8 lg:px-10">
      <header className="glass-panel flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Badge className="rounded-full border-cyan-300/20 bg-cyan-400/10 text-cyan-100">
            Shared Preview
          </Badge>
          <h1 className="mt-4 text-4xl font-semibold text-slate-50">
            {data.project.name}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
            {data.project.description || "Self-contained preview rendered from SQLite."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/projects/${data.project.id}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-200 transition hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to workspace
          </Link>
          <a
            href={`/projects/${data.project.id}`}
            className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-cyan-300"
          >
            Open full editor
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </header>

      <div className="glass-panel min-h-[760px] overflow-hidden p-4">
        <iframe
          title={data.project.name}
          srcDoc={html}
          sandbox="allow-scripts allow-forms allow-modals"
          className="h-[720px] w-full rounded-[24px] border border-white/10 bg-white"
        />
      </div>
    </main>
  );
}
