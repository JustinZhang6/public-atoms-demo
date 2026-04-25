import { type ClassValue, clsx } from "clsx";
import { formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(value: string) {
  return formatDistanceToNow(new Date(value), { addSuffix: true });
}

export function chunkText(value: string, chunkSize = 22) {
  const normalized = value.trim().replace(/\s+/g, " ");
  if (!normalized) {
    return [];
  }

  const words = normalized.split(" ");
  const chunks: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > chunkSize && current) {
      chunks.push(`${current} `);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
}

export function safeJsonParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function stripMarkdownCodeFence(content: string) {
  return content.replace(/^```(?:html)?\s*/i, "").replace(/```$/i, "").trim();
}
