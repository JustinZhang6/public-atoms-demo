import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().max(80).optional(),
  description: z.string().trim().max(240).optional(),
  prompt: z.string().trim().max(6000).optional(),
});

export const saveFileSchema = z.object({
  filename: z.string().trim().min(1).max(120),
  content: z.string().min(1),
  language: z.string().trim().optional(),
});

export const generateProjectSchema = z.object({
  prompt: z.string().trim().min(3).max(8000),
});
