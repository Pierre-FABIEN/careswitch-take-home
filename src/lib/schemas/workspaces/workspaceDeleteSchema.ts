import { z } from 'zod';

export const workspaceDeleteSchema = z.object({});

export type WorkspaceDeleteSchema = typeof workspaceDeleteSchema;
