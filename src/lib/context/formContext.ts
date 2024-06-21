// src/lib/formContext.ts
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { SuperForm } from 'sveltekit-superforms';
import type { Infer } from 'sveltekit-superforms';
import type { UserCreateSchema, UserDeleteSchema, UserUpdateSchema } from '$lib/schemas/userSchema';
import type {
	WorkspaceCreateSchema,
	WorkspaceDeleteSchema,
	WorkspaceUpdateSchema
} from '$lib/schemas/workspaceSchema';

interface FormContextType {
	createUserForm: SuperForm<Infer<UserCreateSchema>, any>;
	updateUserForm: SuperForm<Infer<UserUpdateSchema>, any>;
	deleteUserForm: SuperForm<Infer<UserDeleteSchema>, any>;

	createWorkspaceForm: SuperForm<Infer<WorkspaceCreateSchema>, any>;
	updateWorkspaceForm: SuperForm<Infer<WorkspaceUpdateSchema>, any>;
	deleteWorkspaceForm: SuperForm<Infer<WorkspaceDeleteSchema>, any>;

	createUserMessage: any;
	updateUserMessage: any;
	deleteUserMessage: any;

	createWorkspaceMessage: any;
	updateWorkspaceMessage: any;
	deleteWorkspaceMessage: any;

	deleteUserEnhance: any;
	deleteWorkspaceEnhance: any;
}

export const formContext: Writable<FormContextType> = writable();
export type { FormContextType };
