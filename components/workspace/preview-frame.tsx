"use client";

import { Eye, MonitorSmartphone } from "lucide-react";

export function PreviewFrame({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <div className="glass-panel h-full min-h-[420px] overflow-hidden p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-50">App Viewer</p>
          <p className="text-xs text-slate-400">
            Standalone HTML rendered through `iframe srcdoc`
          </p>
        </div>
        <div className="flex items-center gap-3 text-slate-500">
          <MonitorSmartphone className="h-4 w-4" />
          <Eye className="h-4 w-4" />
        </div>
      </div>
      <div className="h-[calc(100%-3.25rem)] overflow-hidden rounded-[24px] border border-white/10 bg-slate-950/80">
        {content ? (
          <iframe
            title={title}
            srcDoc={content}
            sandbox="allow-scripts allow-forms allow-modals"
            className="h-full w-full bg-white"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-8 text-center text-sm text-slate-500">
            生成完成后，这里会实时显示 Alex 输出的 HTML 应用预览。
          </div>
        )}
      </div>
    </div>
  );
}
