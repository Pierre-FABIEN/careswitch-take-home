import { z } from 'zod';

export const userDeleteSchema = z.object({
	userId: z.string()
});

export type UserDeleteSchema = z.infer<typeof userDeleteSchema>;
