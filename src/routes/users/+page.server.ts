import type { PageServerLoad } from './$types';
import { fail, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { userCreateSchema } from '$lib/schemas/userCreateSchema';
import { userDeleteSchema } from '$lib/schemas/userDeleteSchema';
import { userUpdateSchema } from '$lib/schemas/userUpdateSchema';
import { createUser, deleteUser, getUsers, updateUser } from '$server/db';

export const load: PageServerLoad = async () => {
	const userCreateform = await superValidate(zod(userCreateSchema));
	const userDeleteform = await superValidate(zod(userDeleteSchema));
	const userUpdateform = await superValidate(zod(userUpdateSchema));
	const users = await getUsers();
	return { userCreateform, userDeleteform, userUpdateform, users };
};

export const actions: Actions = {
	create: async ({ request }) => {
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
	},
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('userId');
		const form = await superValidate(formData, zod(userDeleteSchema));

		if (!form.valid) return fail(400, { form });

		try {
			await deleteUser(id);
			console.log('User ID deleted:', id); // Log for debugging

			return message(form, 'User deleted successfully');
		} catch (error) {
			console.error('Error deleting user:', error);
			return fail(500, { form, error: 'An error occurred while deleting the user' });
		}
	},
	update: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('userId');

		const form = await superValidate(formData, zod(userUpdateSchema));

		if (!form.valid) return fail(400, { form });

		try {
			await updateUser(id, form.data);

			return message(form, 'User updated successfully');
		} catch (error) {
			console.error('Error updating user:', error);
			return fail(500, { form, error: 'An error occurred while updating the user' });
		}
	}
};
