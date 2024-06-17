import { z } from 'zod';

export const userDeleteSchema = z.object({
	userId: z.string().min(1, 'User ID is required')
});

export type UserDeleteSchema = typeof userDeleteSchema;
