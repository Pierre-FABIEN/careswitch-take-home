<script lang="ts">
	import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';

	import * as Table from '$ui/table';
	import { Button } from '$ui/button';
	import TrashIcon from 'svelte-radix/Trash.svelte';

	import UpdateForm from './UpdateForm.svelte';
	import MessageHandler from '$components/MessageHandler.svelte';

	import { zodClient } from 'sveltekit-superforms/adapters';

	import {
		workspaceCreateSchema,
		type WorkspaceCreateSchema
	} from '$lib/schemas/workspaces/workspaceCreateSchema';
	import {
		workspaceDeleteSchema,
		type WorkspaceDeleteSchema
	} from '$lib/schemas/workspaces/workspaceDeleteSchema';
	import {
		workspaceUpdateSchema,
		type WorkspaceUpdateSchema
	} from '$lib/schemas/workspaces/workspaceUpdateSchema';

	import CreateForm from './CreateForm.svelte';
	import { onMount } from 'svelte';

	export let data: {
		workspaceCreateform: SuperValidated<Infer<WorkspaceCreateSchema>>;
		workspaceDeleteform: SuperValidated<Infer<WorkspaceDeleteSchema>>;
		workspaceUpdateform: SuperValidated<Infer<WorkspaceUpdateSchema>>;
		workspaces: any[];
	};

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

	const {
		form: createWorkspaceData,
		enhance: createWorkspaceEnhance,
		message: createWorkspaceMessage
	} = createWorkspaceForm;

	const {
		form: updateWorkspaceData,
		enhance: updateWorkspaceEnhance,
		message: updateWorkspaceMessage
	} = updateWorkspaceForm;

	const { enhance: deleteWorkspaceEnhance, message: deleteWorkspaceMessage } = deleteWorkspaceForm;
</script>

<div class="mx-auto mt-8 px-4 sm:px-6 lg:px-8">
	<div class="mb-4 flex justify-end">
		<CreateForm
			{data}
			{createWorkspaceMessage}
			{createWorkspaceData}
			{createWorkspaceEnhance}
			{createWorkspaceForm}
		/>
	</div>
	<div class="space-y-6 rounded-md border p-4">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Name</Table.Head>
					<Table.Head>Users</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if data.workspaces && Array.isArray(data.workspaces)}
					{#each data.workspaces as workspace (workspace.id)}
						<Table.Row>
							<Table.Cell>{workspace.name}</Table.Cell>
							<Table.Cell>
								{#each workspace.users as user}
									<span>{user.name}</span><br />
								{/each}
							</Table.Cell>
							<Table.Cell>
								<UpdateForm
									{data}
									{workspace}
									{updateWorkspaceMessage}
									{updateWorkspaceData}
									{updateWorkspaceEnhance}
									{updateWorkspaceForm}
								/>
							</Table.Cell>
							<Table.Cell>
								<form method="POST" action="?/delete" use:deleteWorkspaceEnhance>
									<input type="hidden" name="id" value={workspace.id} />
									<Button type="submit" variant="outline"><TrashIcon /></Button>
								</form>
							</Table.Cell>
						</Table.Row>
					{/each}
				{:else}
					<Table.Row>
						<Table.Cell class="text-center">No users found.</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</div>
</div>

<MessageHandler
	createMessage={$createWorkspaceMessage || ''}
	deleteMessage={$deleteWorkspaceMessage || ''}
	updateMessage={$updateWorkspaceMessage || ''}
/>
