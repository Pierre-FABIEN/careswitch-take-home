import { z } from 'zod';

export const userDeleteSchema = z.object({
	id: z.string()
});

export type UserDeleteSchema = typeof userDeleteSchema;
