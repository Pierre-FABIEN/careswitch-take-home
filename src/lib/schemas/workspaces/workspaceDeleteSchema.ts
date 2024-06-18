import { z } from 'zod';

export const workspaceDeleteSchema = z.object({
	id: z.string()
});

export type WorkspaceDeleteSchema = typeof workspaceDeleteSchema;
