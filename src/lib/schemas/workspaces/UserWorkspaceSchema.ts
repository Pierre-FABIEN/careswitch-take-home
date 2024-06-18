import { z } from 'zod';

export const userWorkspaceSchema = z.object({
	// Ajoutez ici les champs de UserWorkspace
	// Exemple:
	// id: z.string().cuid(),
	// role: z.string()
});

export type UserWorkspaceSchema = typeof userWorkspaceSchema;
