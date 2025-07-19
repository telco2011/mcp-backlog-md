import { z } from 'zod';

/**
 * @file zodSchemas.ts
 * @description Defines centralized Zod schemas for various entities in the application,
 * ensuring consistent validation and type safety.
 */

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  assignee: z.string().optional(),
  status: z.string().optional(),
  labels: z.string().optional(),
  priority: z.string().optional(),
  plan: z.string().optional(),
  ac: z.string().optional(),
  notes: z.string().optional(),
  dep: z.string().optional(),
  parent: z.string().optional(),
  draft: z.boolean().optional(),
});

export type Task = z.infer<typeof taskSchema>;
