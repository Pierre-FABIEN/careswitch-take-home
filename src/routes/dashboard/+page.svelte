<script lang="ts">
	import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { setContext } from 'svelte';
	import { formContext } from '$lib/context/formContext';
	import type { FormContextType } from '$lib/context/formContext';

	import MessageHandler from '$components/MessageHandler.svelte';
	import * as Table from '$ui/table';
	import { Button } from '$ui/button';
	import TrashIcon from 'svelte-radix/Trash.svelte';

	import type {
		UserCreateSchema,
		UserDeleteSchema,
		UserUpdateSchema
	} from '$lib/schemas/userSchema';

	import type {
		WorkspaceCreateSchema,
		WorkspaceDeleteSchema,
		WorkspaceUpdateSchema
	} from '$lib/schemas/workspaceSchema';

	import { userCreateSchema, userDeleteSchema, userUpdateSchema } from '$lib/schemas/userSchema';

	import {
		workspaceCreateSchema,
		workspaceDeleteSchema,
		workspaceUpdateSchema
	} from '$lib/schemas/workspaceSchema';

	import CardWorkspace from '$lib/components/cardWorkspace/CardWorkspace.svelte';
	import CardUser from '$lib/components/cardUser/cardUser.svelte';

	export let data: {
		userCreateform: SuperValidated<Infer<UserCreateSchema>>;
		userDeleteform: SuperValidated<Infer<UserDeleteSchema>>;
		userUpdateform: SuperValidated<Infer<UserUpdateSchema>>;
		workspaceCreateform: SuperValidated<Infer<WorkspaceCreateSchema>>;
		workspaceDeleteform: SuperValidated<Infer<WorkspaceDeleteSchema>>;
		workspaceUpdateform: SuperValidated<Infer<WorkspaceUpdateSchema>>;
		workspaces: App.Workspace[];
		users: App.User[];
	};

	const createUserForm = superForm(data.userCreateform, {
		validators: zodClient(userCreateSchema),
		id: 'createUserForm'
	});

	const updateUserForm = superForm(data.userUpdateform, {
		validators: zodClient(userUpdateSchema),
		id: 'updateUserForm'
	});

	const deleteUserForm = superForm(data.userDeleteform, {
		validators: zodClient(userDeleteSchema),
		id: 'deleteUserForm'
	});

	const createWorkspaceForm = superForm(data.workspaceCreateform, {
		validators: zodClient(workspaceCreateSchema),
		id: 'createWorkspaceForm'
	});

	const updateWorkspaceForm = superForm(data.workspaceUpdateform, {
		validators: zodClient(workspaceUpdateSchema),
		id: 'updateWorkspaceForm'
	});

	const deleteWorkspaceForm = superForm(data.workspaceDeleteform, {
		validators: zodClient(workspaceDeleteSchema),
		id: 'deleteWorkspaceForm'
	});

	const contextData: FormContextType = {
		createUserForm,
		updateUserForm,
		deleteUserForm,
		createWorkspaceForm,
		updateWorkspaceForm,
		deleteWorkspaceForm,
		createUserMessage: createUserForm.message,
		updateUserMessage: updateUserForm.message,
		deleteUserMessage: deleteUserForm.message,
		createWorkspaceMessage: createWorkspaceForm.message,
		updateWorkspaceMessage: updateWorkspaceForm.message,
		deleteWorkspaceMessage: deleteWorkspaceForm.message,
		deleteUserEnhance: deleteUserForm.enhance,
		deleteWorkspaceEnhance: deleteWorkspaceForm.enhance
	};

	setContext(formContext, contextData);

	const {
		createUserMessage,
		updateUserMessage,
		deleteUserMessage,
		createWorkspaceMessage,
		updateWorkspaceMessage,
		deleteWorkspaceMessage
	} = contextData;
</script>

<div class="m-5 grid grid-cols-4 gap-4">
	<div class="col-span-2">
		<CardUser {data} />
	</div>
	<div class="col-span-2">
		<CardWorkspace {data} />
	</div>
</div>

<MessageHandler
	createMessage={$createWorkspaceMessage || $createUserMessage || ''}
	deleteMessage={$deleteWorkspaceMessage || $deleteUserMessage || ''}
	updateMessage={$updateWorkspaceMessage || $updateUserMessage || ''}
/>
