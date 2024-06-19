import { z } from 'zod';
import { userCreateSchema } from './users/userCreateSchema';

export const userUpdateSchema = userCreateSchema.extend({
	id: z.string()
});

export type UserUpdateSchema = typeof userUpdateSchema;
