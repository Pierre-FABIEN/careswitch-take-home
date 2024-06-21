import { z } from 'zod';

export const workspaceCreateSchema = z.object({
	name: z.string().min(3, 'Name must contain at least 3 characters'),
	users: z.array(z.string()).optional()
});

export const workspaceDeleteSchema = z.object({
	id: z.string()
});

export const workspaceUpdateSchema = z.object({
	// id: z.string(),
	// name: z.string().min(3, 'Name must contain at least 3 characters'),
	// users: z.array(z.string()).optional()
});

export type WorkspaceCreateSchema = typeof workspaceCreateSchema;
export type WorkspaceDeleteSchema = typeof workspaceDeleteSchema;
export type WorkspaceUpdateSchema = typeof workspaceUpdateSchema;
