import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/utils";
import type { ProjectRecord } from "@/lib/types";

export function ProjectCard({ project }: { project: ProjectRecord }) {
  return (
    <Card className="group border-white/10 bg-white/5 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/20">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <Badge variant="outline" className="border-white/10 bg-white/5 text-slate-200">
            Workspace
          </Badge>
          <Clock3 className="h-4 w-4 text-slate-500" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-2xl text-slate-50">{project.name}</CardTitle>
          <p className="text-sm leading-6 text-slate-400">
            {project.description || "No description yet."}
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-between pt-0">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
          Updated {formatRelativeTime(project.updated_at)}
        </p>
        <Link
          href={`/projects/${project.id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-cyan-200 transition hover:text-cyan-100"
        >
          Open workspace
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
