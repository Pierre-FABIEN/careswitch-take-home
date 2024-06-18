import { z } from 'zod';

export const userUpdateSchema = z.object({
	// id: z.string(),
	// name: z.string().min(3, 'Name must contain at least 3 characters'),
	// email: z.string().email('Invalid email'),
	// integer: z.number(),
	// isAdmin: z.boolean(),
	// floatval: z.number()
	// birthday: z
	// 	.string()
	// 	.datetime()
	// 	.refine((date) => date !== undefined, 'Please select a valid date.')
});

export type UserUpdateSchema = typeof userUpdateSchema;
