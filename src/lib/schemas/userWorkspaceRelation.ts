import { z } from 'zod';

export const userCreateSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.string().email('Invalid email'),
	integer: z.number(),
	isAdmin: z.boolean(),
	floatval: z.number(),
	birthday: z.string(),
	workspaces: z.array(z.string()).optional()
});

export const userUpdateSchema = userCreateSchema.extend({
	id: z.string()
});

export const workspaceCreateSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	users: z.array(z.string()).optional() // Array of user IDs
});

export const workspaceUpdateSchema = workspaceCreateSchema.extend({
	id: z.string()
});
