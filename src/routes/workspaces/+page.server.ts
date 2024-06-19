import type { PageServerLoad } from './$types';
import { fail, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { workspaceCreateSchema } from '$lib/schemas/workspaces/workspaceCreateSchema';
import { workspaceDeleteSchema } from '$lib/schemas/workspaces/workspaceDeleteSchema';
import { workspaceUpdateSchema } from '$lib/schemas/workspaces/workspaceUpdateSchema';
import {
	createWorkspace,
	deleteWorkspace,
	getWorkspaces,
	updateWorkspace
} from '$server/workspacesServices';
import { getUsers } from '$server/usersServices';

export const load: PageServerLoad = async () => {
	const workspaceCreateform = await superValidate(zod(workspaceCreateSchema));
	const workspaceDeleteform = await superValidate(zod(workspaceDeleteSchema));
	const workspaceUpdateform = await superValidate(zod(workspaceUpdateSchema));
	const workspaces = await getWorkspaces();
	const users = await getUsers();
	return { workspaceCreateform, workspaceDeleteform, workspaceUpdateform, workspaces, users };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();

		const form = await superValidate(formData, zod(workspaceCreateSchema));

		if (!form.valid) return fail(400, { form });

		try {
			const data = {
				...form.data,
				users: JSON.parse(formData.get('users') as string) // Getting workspace IDs
			};

			await createWorkspace(data);

			return message(form, 'Workspace created successfully');
		} catch (error) {
			console.error('Error creating workspace:', error);
			return fail(500, { form, error: 'An error occurred while creating the workspace' });
		}
	},
	delete: async ({ request }) => {
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
	update: async ({ request }) => {
		const formData = await request.formData();
		console.log(formData);

		const form = await superValidate(formData, zod(workspaceUpdateSchema));

		if (!form.valid) {
			console.error('Form validation failed:', form);
			return fail(400, { form });
		}

		try {
			const data = {
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
