"use client";

import { User2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AGENT_MAP } from "@/lib/agents";
import { cn } from "@/lib/utils";
import type { MessageRecord } from "@/lib/types";

export function AgentMessage({
  message,
  isStreaming,
}: {
  message: MessageRecord;
  isStreaming?: boolean;
}) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";
  const agent = !isUser && !isSystem
    ? AGENT_MAP[message.role as keyof typeof AGENT_MAP]
    : null;

  return (
    <article
      className={cn(
        "flex gap-3 rounded-[24px] border p-4 transition-colors",
        isUser
          ? "border-cyan-300/18 bg-cyan-400/10"
          : isSystem
            ? "border-white/10 bg-white/5"
            : "border-white/8 bg-slate-950/55",
      )}
    >
      <Avatar className="h-11 w-11">
        <AvatarFallback
          className="text-slate-950"
          style={{ background: agent?.gradient || "rgba(255,255,255,0.12)" }}
        >
          {isUser ? <User2 className="h-5 w-5 text-slate-100" /> : agent?.shortName || "SY"}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-slate-50">
            {isUser ? "You" : message.agent_name || "System"}
          </p>
          {!isUser && (
            <Badge
              variant="outline"
              className="border-white/10 bg-white/5 text-[10px] uppercase tracking-[0.24em] text-slate-300"
            >
              {agent?.title || "System"}
            </Badge>
          )}
          {isStreaming && (
            <span className="inline-flex items-center gap-1 text-xs text-cyan-200">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
              streaming
            </span>
          )}
        </div>
        <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
          {message.content}
        </p>
      </div>
    </article>
  );
}
