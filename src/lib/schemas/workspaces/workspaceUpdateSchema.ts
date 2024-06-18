import { z } from 'zod';

export const workspaceUpdateSchema = z.object({
	// id: z.string(),
	// name: z.string().min(3, 'Name must contain at least 3 characters')
});

export type WorkspaceUpdateSchema = typeof workspaceUpdateSchema;
