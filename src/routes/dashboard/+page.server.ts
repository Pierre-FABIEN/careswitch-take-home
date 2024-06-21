import type { PageServerLoad } from './$types';
import { fail, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { userCreateSchema, userDeleteSchema, userUpdateSchema } from '$lib/schemas/userSchema';
import { createUser, deleteUser, getUsers, updateUser } from '$server/usersServices';

import {
	workspaceCreateSchema,
	workspaceDeleteSchema,
	workspaceUpdateSchema
} from '$lib/schemas/workspaceSchema';

import {
	createWorkspace,
	deleteWorkspace,
	getWorkspaces,
	updateWorkspace
} from '$server/workspacesServices';

export const load: PageServerLoad = async () => {
	const userCreateform = await superValidate(zod(userCreateSchema));
	const userDeleteform = await superValidate(zod(userDeleteSchema));
	const userUpdateform = await superValidate(zod(userUpdateSchema));

	const workspaceCreateform = await superValidate(zod(workspaceCreateSchema));
	const workspaceDeleteform = await superValidate(zod(workspaceDeleteSchema));
	const workspaceUpdateform = await superValidate(zod(workspaceUpdateSchema));

	const workspaces = await getWorkspaces();
	const users = await getUsers();

	return {
		workspaceCreateform,
		workspaceDeleteform,
		workspaceUpdateform,
		userCreateform,
		userDeleteform,
		userUpdateform,
		workspaces,
		users
	};
};

export const actions: Actions = {
	createUser: async ({ request }) => {
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
	deleteUser: async ({ request }) => {
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
	updateUser: async ({ request }) => {
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
				workspaces: workspaces
			};

			await updateUser(userData);
			return message(form, 'User updated successfully');
		} catch (error) {
			console.error('Error updating user:', error);
			return fail(500, { form, error: 'An error occurred while updating the user' });
		}
	},
	createWorkspace: async ({ request }) => {
		const formData = await request.formData();

		const form = await superValidate(formData, zod(workspaceCreateSchema));

		if (!form.valid) return fail(400, { form });

		try {
			const data: App.WorkspaceCreateSchema = {
				...form.data,
				users: JSON.parse(formData.get('users') as string) // Getting user IDs
			};

			await createWorkspace(data);

			return message(form, 'Workspace created successfully');
		} catch (error) {
			console.error('Error creating workspace:', error);
			return fail(500, { form, error: 'An error occurred while creating the workspace' });
		}
	},
	deleteWorkspace: async ({ request }) => {
		const formData = await request.formData();

		const id: FormDataEntryValue | null = formData.get('id');
		const form = await superValidate(formData, zod(workspaceDeleteSchema));

		if (!form.valid) return fail(400, { form });

		try {
			await deleteWorkspace(id as string);

			return message(form, 'Workspace deleted successfully');
		} catch (error) {
			console.error('Error deleting workspace:', error);
			return fail(500, { form, error: 'An error occurred while deleting the workspace' });
		}
	},
	updateWorkspace: async ({ request }) => {
		const formData = await request.formData();

		const form = await superValidate(formData, zod(workspaceUpdateSchema));

		if (!form.valid) {
			console.error('Form validation failed:', form);
			return fail(400, { form });
		}

		try {
			const data: App.WorkspaceUpdateSchema = {
				id: formData.get('id') as string,
				name: formData.get('name') as string,
				users: JSON.parse(formData.get('users') as string)
			};

			await updateWorkspace(data);
			return message(form, 'Workspace updated successfully');
		} catch (error) {
			console.error('Error updating workspace:', error); // Improved error logging
			return fail(500, { form, error: 'An error occurred while updating the workspace' });
		}
	}
};
