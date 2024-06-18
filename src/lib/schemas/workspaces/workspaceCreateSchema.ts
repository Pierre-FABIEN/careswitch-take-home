import { z } from 'zod';
import { userWorkspaceSchema } from './UserWorkspaceSchema';

export const workspaceCreateSchema = z.object({
	name: z.string()
	//users: z.array(userWorkspaceSchema)
});

export type WorkspaceCreateSchema = typeof workspaceCreateSchema;
