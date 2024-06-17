import type { PageServerLoad } from './$types';
import { fail, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { userSchema } from '$lib/schemas/userSchema';
import { createUser, getUsers } from '$server/db';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(userSchema));
	const users = await getUsers();
	return { form, users };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod(userSchema));

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
