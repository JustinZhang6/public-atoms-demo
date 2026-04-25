"use client";

import {
  startTransition,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { oneDark } from "@codemirror/theme-one-dark";
import {
  Code2,
  LoaderCircle,
  Play,
  Rocket,
  Save,
  Share2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { AgentMessage } from "@/components/workspace/agent-message";
import { PreviewFrame } from "@/components/workspace/preview-frame";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { FileRecord, MessageRecord, ProjectDetails, ProjectRecord } from "@/lib/types";

type StreamEvent =
  | { type: "meta"; project: ProjectRecord }
  | { type: "message-start"; message: MessageRecord }
  | { type: "message-delta"; messageId: string; chunk: string }
  | { type: "message-end"; messageId: string }
  | { type: "file-reset"; filename: string; language: string }
  | { type: "file-delta"; filename: string; chunk: string }
  | { type: "file-complete"; file: FileRecord }
  | { type: "done"; project: ProjectRecord }
  | { type: "error"; message: string };

function upsertFile(files: FileRecord[], nextFile: FileRecord) {
  const existingIndex = files.findIndex((file) => file.filename === nextFile.filename);
  if (existingIndex === -1) {
    return [...files, nextFile];
  }

  const next = [...files];
  next[existingIndex] = nextFile;
  return next;
}

export function WorkspaceClient({
  initialData,
  initialPrompt,
}: {
  initialData: ProjectDetails;
  initialPrompt?: string;
}) {
  const router = useRouter();
  const [project, setProject] = useState(initialData.project);
  const [messages, setMessages] = useState(initialData.messages);
  const [files, setFiles] = useState(initialData.files);
  const [streamingIds, setStreamingIds] = useState<Record<string, boolean>>({});
  const [draft, setDraft] = useState("");
  const [selectedFile, setSelectedFile] = useState(
    initialData.files[0]?.filename || "index.html",
  );
  const [editorDrafts, setEditorDrafts] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("preview");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, startSaving] = useTransition();
  const listRef = useRef<HTMLDivElement | null>(null);
  const autoPromptRef = useRef(false);

  const activeFile = useMemo(
    () => files.find((file) => file.filename === selectedFile) || files[0],
    [files, selectedFile],
  );

  const activeContent =
    (activeFile && editorDrafts[activeFile.filename]) ?? activeFile?.content ?? "";
  const deferredPreviewContent = useDeferredValue(activeContent);
  const hasUnsavedDraft =
    !!activeFile &&
    editorDrafts[activeFile.filename] !== undefined &&
    editorDrafts[activeFile.filename] !== activeFile.content;

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function saveActiveFile() {
    if (!activeFile || !hasUnsavedDraft) {
      return;
    }

    startSaving(async () => {
      try {
        const response = await fetch(`/api/projects/${project.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filename: activeFile.filename,
            content: editorDrafts[activeFile.filename],
            language: activeFile.language ?? "html",
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to save file.");
        }

        const nextFile = (await response.json()) as FileRecord;
        setFiles((current) => upsertFile(current, nextFile));
        setEditorDrafts((current) => {
          const next = { ...current };
          delete next[nextFile.filename];
          return next;
        });
        toast.success("Code saved to SQLite.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to save file.");
      }
    });
  }

  const handleStreamEvent = useCallback((event: StreamEvent) => {
    switch (event.type) {
      case "meta":
      case "done":
        setProject(event.project);
        break;
      case "message-start":
        startTransition(() => {
          setStreamingIds((current) => ({ ...current, [event.message.id]: true }));
          setMessages((current) => {
            const exists = current.some((message) => message.id === event.message.id);
            if (exists) {
              return current;
            }

            return [...current, { ...event.message, content: "" }];
          });
        });
        break;
      case "message-delta":
        startTransition(() => {
          setMessages((current) =>
            current.map((message) =>
              message.id === event.messageId
                ? { ...message, content: `${message.content}${event.chunk}` }
                : message,
            ),
          );
        });
        break;
      case "message-end":
        setStreamingIds((current) => {
          const next = { ...current };
          delete next[event.messageId];
          return next;
        });
        break;
      case "file-reset":
        setSelectedFile(event.filename);
        setFiles((current) =>
          upsertFile(current, {
            id: `temp-file-${Date.now()}`,
            project_id: project.id,
            filename: event.filename,
            content: "",
            language: event.language,
            updated_at: new Date().toISOString(),
          }),
        );
        break;
      case "file-delta":
        startTransition(() => {
          setFiles((current) => {
            const existing = current.find((file) => file.filename === event.filename);
            const nextFile: FileRecord = existing
              ? { ...existing, content: `${existing.content}${event.chunk}` }
              : {
                  id: `temp-file-${Date.now()}`,
                  project_id: project.id,
                  filename: event.filename,
                  content: event.chunk,
                  language: "html",
                  updated_at: new Date().toISOString(),
                };
            return upsertFile(current, nextFile);
          });
        });
        break;
      case "file-complete":
        setFiles((current) => upsertFile(current, event.file));
        setEditorDrafts((current) => {
          const next = { ...current };
          delete next[event.file.filename];
          return next;
        });
        toast.success("Preview updated.");
        break;
      case "error":
        toast.error(event.message);
        break;
    }
  }, [project.id]);

  const submitPrompt = useCallback(async (promptValue = draft, fromAutostart = false) => {
    const prompt = promptValue.trim();
    if (!prompt || isGenerating) {
      return;
    }

    setIsGenerating(true);
    setActiveTab("preview");
    setEditorDrafts({});

    const tempUserMessage: MessageRecord = {
      id: `temp-${Date.now()}`,
      project_id: project.id,
      role: "user",
      content: prompt,
      agent_name: "You",
      created_at: new Date().toISOString(),
    };

    startTransition(() => {
      setMessages((current) => [...current, tempUserMessage]);
    });

    if (!fromAutostart) {
      setDraft("");
    }

    try {
      const response = await fetch(`/api/projects/${project.id}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to start generation.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const block of parts) {
          if (!block.trim()) {
            continue;
          }

          const lines = block.split("\n");
          const event = lines.find((line) => line.startsWith("event:"))?.slice(6).trim();
          const payload = lines
            .filter((line) => line.startsWith("data:"))
            .map((line) => line.slice(5).trimStart())
            .join("\n");

          if (!event || !payload) {
            continue;
          }

          handleStreamEvent({
            type: event,
            ...JSON.parse(payload),
          } as StreamEvent);
        }
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to generate preview.",
      );
    } finally {
      setIsGenerating(false);
    }
  }, [draft, handleStreamEvent, isGenerating, project.id]);

  useEffect(() => {
    if (!initialPrompt || autoPromptRef.current) {
      return;
    }

    autoPromptRef.current = true;
    void submitPrompt(initialPrompt, true);
    router.replace(`/projects/${initialData.project.id}`);
  }, [initialData.project.id, initialPrompt, router, submitPrompt]);

  function copyShareLink() {
    const url = `${window.location.origin}/share/${project.id}`;
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success("Share link copied."))
      .catch(() => toast.error("Could not copy link."));
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-6 px-4 py-6 lg:px-6">
      <header className="glass-panel flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/projects" className="text-xs uppercase tracking-[0.26em] text-slate-500 transition hover:text-slate-300">
              Projects
            </Link>
            <span className="text-slate-600">/</span>
            <p className="text-xs uppercase tracking-[0.26em] text-cyan-200/70">
              Workspace
            </p>
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-slate-50">{project.name}</h1>
            <p className="mt-1 text-sm text-slate-400">
              {project.description || "Describe your app and let the team build it."}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            className="rounded-full"
            onClick={copyShareLink}
          >
            <Share2 className="h-4 w-4" />
            Publish link
          </Button>
          <Button asChild variant="secondary" className="rounded-full">
            <Link href={`/share/${project.id}`}>
              <Play className="h-4 w-4" />
              Open share page
            </Link>
          </Button>
        </div>
      </header>

      <div className="grid gap-5 xl:grid-cols-[380px_400px_minmax(0,1fr)]">
        <section className="glass-panel flex min-h-[760px] flex-col overflow-hidden">
          <div className="border-b border-white/10 px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-50">Agent Team</p>
                <p className="text-xs text-slate-400">
                  实时协作日志与任务拆解
                </p>
              </div>
              {isGenerating && (
                <span className="inline-flex items-center gap-2 text-xs text-cyan-200">
                  <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                  generating
                </span>
              )}
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div ref={listRef} className="scrollbar-thin flex h-full flex-col gap-4 px-4 py-4">
              {messages.map((message) => (
                <AgentMessage
                  key={message.id}
                  message={message}
                  isStreaming={!!streamingIds[message.id]}
                />
              ))}
            </div>
          </ScrollArea>
          <div className="border-t border-white/10 p-4">
            <Textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Describe what you want the AI team to build or improve..."
              className="min-h-[120px]"
            />
            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Streaming with gpt-4o + fallback preview
              </p>
              <Button
                onClick={() => void submitPrompt()}
                disabled={isGenerating || !draft.trim()}
                className="rounded-full px-5"
              >
                {isGenerating ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Send to team
              </Button>
            </div>
          </div>
        </section>

        <section className="hidden min-h-[760px] xl:block">
          <div className="glass-panel flex h-full flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-sm font-medium text-slate-50">Code Panel</p>
                <p className="text-xs text-slate-400">
                  编辑生成文件并保存到 SQLite
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => setActiveTab("code")}
                >
                  <Code2 className="h-4 w-4" />
                  Code
                </Button>
                <Button
                  size="sm"
                  className="rounded-full"
                  disabled={isSaving || !hasUnsavedDraft}
                  onClick={() => void saveActiveFile()}
                >
                  {isSaving ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
              {files.map((file) => (
                <button
                  key={file.filename}
                  type="button"
                  className={`rounded-full px-3 py-1.5 text-sm transition ${
                    selectedFile === file.filename
                      ? "bg-white text-slate-950"
                      : "bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                  onClick={() => setSelectedFile(file.filename)}
                >
                  {file.filename}
                </button>
              ))}
            </div>
            <div className="min-h-0 flex-1">
              <CodeMirror
                value={activeContent}
                theme={oneDark}
                extensions={[html()]}
                onChange={(value) => {
                  if (!activeFile) return;
                  setEditorDrafts((current) => ({
                    ...current,
                    [activeFile.filename]: value,
                  }));
                }}
                height="100%"
                basicSetup={{
                  foldGutter: true,
                  highlightActiveLine: true,
                  lineNumbers: true,
                }}
              />
            </div>
          </div>
        </section>

        <section className="min-h-[760px] xl:hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="h-[720px]">
              <PreviewFrame title={project.name} content={deferredPreviewContent} />
            </TabsContent>
            <TabsContent value="code" className="h-[720px]">
              <div className="glass-panel flex h-full flex-col overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                  <p className="text-sm font-medium text-slate-50">
                    {activeFile?.filename || "index.html"}
                  </p>
                  <Button
                    size="sm"
                    className="rounded-full"
                    disabled={isSaving || !hasUnsavedDraft}
                    onClick={() => void saveActiveFile()}
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                </div>
                <div className="min-h-0 flex-1">
                  <CodeMirror
                    value={activeContent}
                    theme={oneDark}
                    extensions={[html()]}
                    onChange={(value) => {
                      if (!activeFile) return;
                      setEditorDrafts((current) => ({
                        ...current,
                        [activeFile.filename]: value,
                      }));
                    }}
                    height="100%"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        <section className="hidden min-h-[760px] xl:block">
          <PreviewFrame title={project.name} content={deferredPreviewContent} />
        </section>
      </div>

      <div className="glass-panel flex items-center justify-between gap-4 px-5 py-4 text-xs uppercase tracking-[0.24em] text-slate-500">
        <span>SQLite persisted</span>
        <span className="inline-flex items-center gap-2">
          <Rocket className="h-3.5 w-3.5" />
          Share route ready
        </span>
      </div>
    </div>
  );
}
