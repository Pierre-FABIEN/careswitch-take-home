import { z } from 'zod';

export const workspaceCreateSchema = z.object({
	name: z.string().min(3, 'Name must contain at least 3 characters'),
	users: z.array(z.string()).optional()
});

export type WorkspaceCreateSchema = typeof workspaceCreateSchema;
