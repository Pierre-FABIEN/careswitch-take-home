import { z } from 'zod';

export const workspaceUpdateSchema = z.object({
	id: z.string(),
	name: z.string().min(1, 'Name is required')
});

export type WorkspaceUpdateSchema = typeof workspaceUpdateSchema;
