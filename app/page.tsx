import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  Code2,
  Play,
  Rocket,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AGENTS } from "@/lib/agents";
import { LANDING_CASE_STUDIES } from "@/lib/demo";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 pb-16 pt-8 lg:px-10">
        <header className="glass-panel glow-ring sticky top-4 z-20 flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-400 to-emerald-300 text-slate-950 shadow-glow">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">
                Atoms Demo
              </p>
              <p className="text-sm text-slate-300">
                多 Agent 协作的 AI 全栈应用生成平台
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" className="hidden md:inline-flex">
              <Link href="#showcase">案例</Link>
            </Button>
            <Button asChild variant="secondary" className="rounded-full">
              <Link href="/projects">
                Start Building
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-12 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <div className="space-y-8">
            <Badge className="rounded-full border-cyan-300/20 bg-cyan-400/10 px-4 py-1 text-cyan-100">
              Team Mode · Preview · Publish
            </Badge>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-semibold leading-[0.95] text-slate-50 md:text-7xl">
                From a prompt to a
                <span className="text-gradient"> deployable web app</span>
                <br />
                with an AI team you can watch think.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                Mike 统筹需求，Emma 输出 PRD，Bob 设计架构，Alex 直接生成可运行的
                HTML/CSS/JS。你在一个工作台里同时看到聊天、代码和实时预览。
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-full px-7 shadow-glow">
                <Link href="/projects">
                  <Rocket className="mr-2 h-4 w-4" />
                  Create Project
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="rounded-full border border-white/10 bg-white/5 px-7 text-slate-50"
              >
                <Link href="#workspace-preview">
                  <Play className="mr-2 h-4 w-4" />
                  Explore Workflow
                </Link>
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { label: "Streaming agents", value: "6 roles" },
                { label: "Live preview", value: "iframe srcdoc" },
                { label: "Persistence", value: "SQLite" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="glass-panel px-5 py-4 transition-transform duration-300 hover:-translate-y-1"
                >
                  <p className="text-sm text-slate-400">{item.label}</p>
                  <p className="mt-2 text-xl font-semibold text-slate-50">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div id="workspace-preview" className="glass-panel relative overflow-hidden p-5">
            <div className="absolute inset-x-10 top-0 h-28 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="relative grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[24px] border border-white/10 bg-slate-950/70 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-50">
                      Team Console
                    </p>
                    <p className="text-xs text-slate-400">
                      实时协作输出与打字机流
                    </p>
                  </div>
                  <Badge variant="outline" className="border-emerald-400/30 text-emerald-200">
                    Live
                  </Badge>
                </div>
                <div className="space-y-4">
                  {AGENTS.slice(0, 4).map((agent, index) => (
                    <div
                      key={agent.role}
                      className="rounded-2xl border border-white/8 bg-white/5 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-medium text-slate-950"
                          style={{ background: agent.gradient }}
                        >
                          {agent.shortName}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-100">
                            {agent.name}
                          </p>
                          <p className="text-xs text-slate-400">{agent.title}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-300">
                        {
                          [
                            "确认需求范围，拆分任务，安排流式交付节奏。",
                            "整理用户故事、优先级与交互闭环。",
                            "约束为 App Router + SQLite + iframe 预览架构。",
                            "输出单文件 HTML 应用，确保 standalone 运行。",
                          ][index]
                        }
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[24px] border border-white/10 bg-slate-950/75 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-50">App Viewer</p>
                    <div className="flex gap-2">
                      <span className="h-3 w-3 rounded-full bg-rose-400" />
                      <span className="h-3 w-3 rounded-full bg-amber-400" />
                      <span className="h-3 w-3 rounded-full bg-emerald-400" />
                    </div>
                  </div>
                  <div className="aspect-[4/3] rounded-[20px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_35%),linear-gradient(180deg,_rgba(15,23,42,0.92),_rgba(2,6,23,0.98))] p-6">
                    <div className="grid h-full grid-cols-[0.85fr_1.15fr] gap-4">
                      <div className="space-y-3 rounded-[20px] border border-white/10 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                          Prompt
                        </p>
                        <p className="text-sm text-slate-200">
                          Build a modern habit dashboard with charts, streaks, and
                          reminders.
                        </p>
                        <div className="rounded-2xl bg-cyan-400/10 p-3 text-xs text-cyan-100">
                          Self-contained HTML bundle ready for iframe srcdoc.
                        </div>
                      </div>
                      <div className="rounded-[20px] border border-cyan-400/20 bg-slate-950/80 p-4">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-400 text-slate-950">
                            <Bot className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-100">
                              Runtime Preview
                            </p>
                            <p className="text-xs text-slate-400">
                              iframe + srcdoc + isolated scripts
                            </p>
                          </div>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                          {[
                            { label: "Hot update", value: "stream chunks" },
                            { label: "Artifacts", value: "index.html" },
                            { label: "Runtime", value: "vanilla JS" },
                            { label: "Publish", value: "share route" },
                          ].map((item) => (
                            <div
                              key={item.label}
                              className="rounded-2xl border border-white/8 bg-white/5 p-3"
                            >
                              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                                {item.label}
                              </p>
                              <p className="mt-2 text-sm font-medium text-slate-100">
                                {item.value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    {
                      icon: BrainCircuit,
                      label: "Team Mode",
                      copy: "多 Agent 角色分工，让过程可见而不是黑盒生成。",
                    },
                    {
                      icon: Code2,
                      label: "Engineer Mode",
                      copy: "直接查看生成文件，支持继续编辑与迭代。",
                    },
                    {
                      icon: Sparkles,
                      label: "Race Mode",
                      copy: "预留多模型竞赛位，便于扩展实验。",
                    },
                  ].map((feature) => (
                    <Card key={feature.label} className="border-white/10 bg-white/5">
                      <CardHeader className="space-y-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                          <feature.icon className="h-5 w-5 text-cyan-200" />
                        </div>
                        <CardTitle className="text-lg text-slate-50">
                          {feature.label}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm leading-6 text-slate-300">
                        {feature.copy}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="showcase" className="space-y-6 py-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <Badge variant="outline" className="border-white/15 bg-white/5 text-slate-200">
                Demo Cases
              </Badge>
              <h2 className="mt-4 text-3xl font-semibold text-slate-50 md:text-4xl">
                预置案例体现可交付质量，而不是玩具级原型
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-400">
              这些案例展示了产品叙事、信息密度与实时预览链路。实际工作台会把生成的
              HTML 存进 SQLite，并以 `iframe srcdoc` 方式即时渲染。
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {LANDING_CASE_STUDIES.map((item) => (
              <Card
                key={item.title}
                className="group overflow-hidden border-white/10 bg-white/5 transition-transform duration-300 hover:-translate-y-1"
              >
                <CardHeader className="space-y-4">
                  <div
                    className="rounded-[24px] border border-white/10 p-6"
                    style={{ background: item.background }}
                  >
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                        {item.category}
                      </p>
                      <p className="text-2xl font-semibold text-white">{item.title}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-xl text-slate-50">
                      {item.title}
                    </CardTitle>
                    <p className="text-sm leading-6 text-slate-300">
                      {item.description}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {item.highlights.map((highlight) => (
                      <Badge
                        key={highlight}
                        variant="outline"
                        className="border-white/10 bg-white/5 text-slate-200"
                      >
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
