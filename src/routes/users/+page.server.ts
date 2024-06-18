import type { PageServerLoad } from './$types';
import { fail, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { userCreateSchema } from '$lib/schemas/users/userCreateSchema';
import { userDeleteSchema } from '$lib/schemas/users/userDeleteSchema';
import { userUpdateSchema } from '$lib/schemas/users/userUpdateSchema';
import { createUser, deleteUser, getUsers, getWorkspaces, updateUser } from '$server/db';

export const load: PageServerLoad = async () => {
	const userCreateform = await superValidate(zod(userCreateSchema));
	const userDeleteform = await superValidate(zod(userDeleteSchema));
	const userUpdateform = await superValidate(zod(userUpdateSchema));
	const workspaces = await getWorkspaces();
	const users = await getUsers();
	return { userCreateform, userDeleteform, userUpdateform, workspaces, users };
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
		console.log(formData, 'formData');

		const id: FormDataEntryValue | null = formData.get('id');
		const form = await superValidate(formData, zod(userDeleteSchema));

		if (!form.valid) return fail(400, { form });

		try {
			await deleteUser(id as string);
			console.log('User ID deleted:', id); // Log for debugging

			return message(form, 'User deleted successfully');
		} catch (error) {
			console.error('Error deleting user:', error);
			return fail(500, { form, error: 'An error occurred while deleting the user' });
		}
	},
	update: async ({ request }) => {
		const formData = await request.formData();

		const form = await superValidate(formData, zod(userUpdateSchema));

		if (!form.valid) {
			console.error('Form validation failed:', form); // Log form validation errors
			return fail(400, { form });
		}

		try {
			const data = {
				id: formData.get('id') as string,
				name: formData.get('name') as string,
				email: formData.get('email') as string,
				integer: parseInt(formData.get('integer') as string, 10), // Convert to integer
				isAdmin: formData.get('isAdmin') === 'true', // Convert to boolean
				floatval: parseFloat(formData.get('floatval') as string), // Convert to float
				birthday: formData.get('birthday') as string
			};

			await updateUser(data);
			return message(form, 'User updated successfully');
		} catch (error) {
			console.error('Error updating user:', error); // Improved error logging
			return fail(500, { form, error: 'An error occurred while updating the user' });
		}
	}
};
