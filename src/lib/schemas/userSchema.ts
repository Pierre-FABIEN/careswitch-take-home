import { z } from 'zod';

export const userCreateSchema = z.object({
	name: z.string().min(3, 'Name must contain at least 3 characters'),
	email: z.string().email('Invalid email'),
	workspaces: z.array(z.string()).optional()
});

export const userDeleteSchema = z.object({
	id: z.string()
});

export const userUpdateSchema = z.object({
	// id: z.string(),
	// name: z.string().min(3, 'Name must contain at least 3 characters'),
	// email: z.string().email('Invalid email'),
	// workspaces: z.array(z.string()).optional()
});

export type UserCreateSchema = typeof userCreateSchema;
export type UserDeleteSchema = typeof userDeleteSchema;
export type UserUpdateSchema = typeof userUpdateSchema;
