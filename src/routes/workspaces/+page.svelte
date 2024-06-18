<script lang="ts">
	import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
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

	import * as Table from '$ui/table';
	import * as Alert from '$ui/alert';
	import { Button } from '$ui/button';
	import TrashIcon from 'svelte-radix/Trash.svelte';

	import UpdateForm from './UpdateForm.svelte';

	export let data: {
		workspaceCreateform: SuperValidated<Infer<WorkspaceCreateSchema>>;
		workspaceDeleteform: SuperValidated<Infer<WorkspaceDeleteSchema>>;
		workspaceUpdateSchema: SuperValidated<Infer<WorkspaceUpdateSchema>>;
		workspaces: any[];
	};

	const createWorkspaceForm = superForm(data.workspaceCreateform, {
		validators: zodClient(workspaceCreateSchema),
		id: 'createWorkspaceForm'
	});

	const updateWorkspaceForm = superForm(data.workspaceUpdateSchema, {
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
		message: createWorkspaceMessage,
		validate: createWorkspaceValidate
	} = createWorkspaceForm;

	const {
		form: updateWorkspaceData,
		enhance: updateWorkspaceEnhance,
		message: updateWorkspaceMessage,
		validate: updateWorkspaceValidate
	} = updateWorkspaceForm;

	const { enhance: deleteWorkspaceEnhance, message: deleteWorkspaceMessage } = deleteWorkspaceForm;

	// Animation
	let showMessage = false;
	let animationClass = 'animate-slideIn';

	$: if ($createWorkspaceMessage || $deleteWorkspaceMessage || $updateWorkspaceMessage) {
		showMessage = true;
		animationClass = 'animate-slideIn';
		setTimeout(() => {
			animationClass = 'animate-slideOut';
			setTimeout(() => {
				showMessage = false;
			}, 500); // Durée de l'animation de sortie
		}, 5000);
	}
</script>

<div class="mx-auto mt-8 px-4 sm:px-6 lg:px-8">
	<div class="mb-4 flex justify-end">
		<CreateForm
			{createWorkspaceMessage}
			{createWorkspaceData}
			{createWorkspaceValidate}
			{createWorkspaceEnhance}
			{createWorkspaceForm}
		/>
	</div>
	<div class="space-y-6 rounded-md border p-4">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Name</Table.Head>
					<Table.Head>Email</Table.Head>
					<Table.Head>Integer</Table.Head>
					<Table.Head>Admin</Table.Head>
					<Table.Head>Float value</Table.Head>
					<Table.Head>Birthday</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if data.workspaces && Array.isArray(data.workspaces)}
					{#each data.workspaces as workspace (workspace.id)}
						<Table.Row>
							<Table.Cell>{workspace.name}</Table.Cell>
							<Table.Cell>{workspace.email}</Table.Cell>
							<Table.Cell>{workspace.integer}</Table.Cell>
							<Table.Cell>{workspace.isAdmin}</Table.Cell>
							<Table.Cell>{workspace.floatval}</Table.Cell>
							<Table.Cell>{new Date(workspace.birthday).toLocaleDateString()}</Table.Cell>
							<Table.Cell>
								<UpdateForm
									{workspace}
									{updateWorkspaceMessage}
									{updateWorkspaceData}
									{updateWorkspaceValidate}
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

{#if showMessage}
	<Alert.Root
		class="fixed bottom-4 right-4 max-w-[200px] border border-green-400 bg-green-500 px-4 py-3 text-white {animationClass}"
		role="alert"
	>
		<Alert.Description
			>{$createWorkspaceMessage ||
				$deleteWorkspaceMessage ||
				$updateWorkspaceMessage}</Alert.Description
		>
	</Alert.Root>
{/if}
