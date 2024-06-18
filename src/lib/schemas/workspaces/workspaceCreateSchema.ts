import { z } from 'zod';

export const workspaceCreateSchema = z.object({
	name: z.string().min(3, 'Name must contain at least 3 characters')
	//users: z.array(userWorkspaceSchema)
});

export type WorkspaceCreateSchema = typeof workspaceCreateSchema;
