import type { PageServerLoad } from './$types';
import { fail, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { userCreateSchema } from '$lib/schemas/users/userCreateSchema';
import { userDeleteSchema } from '$lib/schemas/users/userDeleteSchema';
import { userUpdateSchema } from '$lib/schemas/users/userUpdateSchema';
import { createUser, deleteUser, getUsers, updateUser } from '$server/usersServices';
import { getWorkspaces } from '$server/workspacesServices';

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
			const userData: App.UserCreateSchema = {
				...form.data,
				workspaces: JSON.parse(formData.get('workspaces') as string)
			};

			await createUser(userData);

			return message(form, 'User created successfully');
		} catch (error: any) {
			console.error('Error creating user:', error);
			if (error.message === 'One or more workspaces do not exist') {
				return fail(400, { form, error: error.message });
			}
			return fail(500, { form, error: 'An error occurred while creating the user' });
		}
	},
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id: FormDataEntryValue | null = formData.get('id');
		const form = await superValidate(formData, zod(userDeleteSchema));

		if (!form.valid) return fail(400, { form });

		try {
			await deleteUser(id as string);
			return message(form, 'User deleted successfully');
		} catch (error) {
			console.error('Error deleting user:', error);
			return fail(500, { form, error: 'An error occurred while deleting the user' });
		}
	},
	update: async ({ request }) => {
		const formData = await request.formData();

		const form = await superValidate(formData, zod(userUpdateSchema));

		if (!form.valid) return fail(400, { form });

		try {
			const workspacesString = formData.get('workspaces') as string;
			const workspaces = JSON.parse(workspacesString);

			const userData: App.UserUpdateSchema = {
				id: formData.get('id') as string,
				name: formData.get('name') as string,
				email: formData.get('email') as string,
				integer: parseInt(formData.get('integer') as string, 10),
				isAdmin: formData.get('isAdmin') === 'true',
				floatval: parseFloat(formData.get('floatval') as string),
				birthday: formData.get('birthday') as string,
				workspaces: workspaces
			};

			await updateUser(userData);
			return message(form, 'User updated successfully');
		} catch (error) {
			console.error('Error updating user:', error);
			return fail(500, { form, error: 'An error occurred while updating the user' });
		}
	}
};
