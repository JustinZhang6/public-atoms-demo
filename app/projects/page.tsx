import { Layers3, Sparkles } from "lucide-react";
import { CreateProjectForm } from "@/components/projects/create-project-form";
import { ProjectCard } from "@/components/projects/project-card";
import { Badge } from "@/components/ui/badge";
import { listProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default function ProjectsPage() {
  const projects = listProjects();

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-6 py-8 lg:px-10">
      <header className="glass-panel flex flex-col gap-5 p-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <Badge className="rounded-full border-cyan-300/20 bg-cyan-400/10 text-cyan-100">
            Project Directory
          </Badge>
          <div>
            <h1 className="text-4xl font-semibold text-slate-50 md:text-5xl">
              Your Atoms workspaces
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              所有项目保存在本地 SQLite。你可以直接打开已有 workspace，或者从一句自然语言描述启动新的多 Agent 协作流程。
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] border border-white/10 bg-white/5 px-5 py-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Projects
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-50">
              {projects.length}
            </p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/5 px-5 py-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Stack
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-50">Next 15</p>
          </div>
        </div>
      </header>

      <CreateProjectForm />

      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
              Stored projects
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-50">
              Continue from previous builds
            </h2>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 md:inline-flex">
            <Layers3 className="h-4 w-4 text-cyan-200" />
            SQLite-backed workspaces
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        {!projects.length && (
          <div className="glass-panel flex items-center gap-3 p-8 text-slate-400">
            <Sparkles className="h-5 w-5 text-cyan-300" />
            No saved projects yet. Create one above to start the first agent run.
          </div>
        )}
      </section>
    </main>
  );
}
