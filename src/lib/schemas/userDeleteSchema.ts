import { z } from 'zod';

export const userDeleteSchema = z.object({
	id: z.any()
});

export type UserDeleteSchema = typeof userDeleteSchema;
