import type { PageServerLoad } from './$types';
import { fail, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { userCreateSchema } from '$lib/schemas/userCreateSchema';
import { createUser, getUsers } from '$server/db';

export const load: PageServerLoad = async () => {
	const userCreateform = await superValidate(zod(userCreateSchema));
	const users = await getUsers();
	return { userCreateform, users };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod(userCreateSchema));

		if (!form.valid) return fail(400, { form });

		try {
			await createUser(form.data);

			return message(form, 'User created successfully');
		} catch (error) {
			console.error('Error creating user:', error);
			return fail(500, { form, error: 'An error occurred while creating the user' });
		}
	}
};
