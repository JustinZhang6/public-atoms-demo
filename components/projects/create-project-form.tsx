"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const STARTER_PROMPTS = [
  "Build a premium analytics dashboard for a SaaS growth team with KPIs, alerts, and trend charts.",
  "Create a cinematic landing page for a luxury skincare brand with editorial sections and product cards.",
  "Make a habit tracker web app with streaks, daily tasks, and gentle motivational feedback.",
];

export function CreateProjectForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");

  const createProject = () => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/projects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            prompt,
            description: prompt ? prompt.slice(0, 180) : undefined,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create project.");
        }

        const project = (await response.json()) as { id: string };
        const target = prompt
          ? `/projects/${project.id}?prompt=${encodeURIComponent(prompt)}`
          : `/projects/${project.id}`;

        router.push(target);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Unable to create project.",
        );
      }
    });
  };

  return (
    <div className="glass-panel p-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-[0.32em] text-cyan-200/70">
          New build
        </p>
        <h2 className="text-2xl font-semibold text-slate-50">
          从一句描述启动一个 AI Team
        </h2>
        <p className="max-w-2xl text-sm leading-7 text-slate-400">
          创建项目后会进入工作台，并由 Mike、Emma、Bob、Alex 依次开始协作。若你已提供需求描述，系统会自动开始第一次生成。
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.4fr_0.6fr]">
        <Input
          placeholder="Project name (optional)"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <Textarea
          placeholder="Describe the app you want to build..."
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          className="min-h-[132px]"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {STARTER_PROMPTS.map((item) => (
          <button
            key={item}
            type="button"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-left text-sm text-slate-300 transition hover:border-cyan-300/30 hover:bg-cyan-400/10 hover:text-slate-50"
            onClick={() => setPrompt(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
          Next.js 15 · SQLite · gpt-4o · iframe srcdoc
        </p>
        <Button
          onClick={createProject}
          disabled={isPending}
          className="rounded-full px-6"
        >
          {isPending ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Create Workspace
        </Button>
      </div>
    </div>
  );
}
