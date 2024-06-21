<script lang="ts">
	import * as Form from '$ui/form';
	import * as Sheet from '$ui/sheet';
	import { Input } from '$ui/input';
	import { Button } from '$ui/button';
	import * as Card from '$ui/card';
	import { Label } from '$ui/label';
	import { Switch } from '$ui/switch';

	// Importing writable store from Svelte for reactive state management
	import { writable } from 'svelte/store';
	// Importing Svelte lifecycle function to run code when the component is mounted
	import { onMount } from 'svelte';

	// Importing necessary components from various UI libraries
	import PencilIcon from 'svelte-radix/Pencil1.svelte';

	import { getContext } from 'svelte';
	import { formContext, type FormContextType } from '$lib/context/formContext';
	const context = getContext(formContext) as FormContextType;

	const {
		updateWorkspaceForm,
		updateWorkspaceMessage,
		updateWorkspaceForm: { enhance: updateWorkspaceEnhance }
	} = context;

	// Props to receive data and functions from parent component or route
	export let data: any;
	export let workspace: App.Workspace;

	// Local state to manage the visibility of the sheet
	let isSheetOpen = false;

	// Function to open the sheet
	const clickOpenSheet = () => {
		isSheetOpen = true;
	};

	// Writable store to manage workspace data reactively
	const workspaceData = writable({
		name: '',
		users: [] as { id: string; name: string; checked: boolean }[]
	});

	// Function to update workspace details in the local state
	const updateWorkspaceDetails = () => {
		// Create a set of user IDs from the workspace data
		const workspaceUserIds = new Set(workspace.users.map((user: App.User) => user.id));
		// Map over all users, setting the checked property based on the workspace's users
		const allUsers = data.users.map((user: App.User) => ({
			...user,
			checked: workspaceUserIds.has(user.id)
		}));

		// Set the workspaceData store with updated values
		workspaceData.set({
			name: workspace.name,
			users: allUsers
		});
	};

	// On component mount, update workspace details
	onMount(() => {
		updateWorkspaceDetails();
	});

	// Reactive statement to handle successful workspace update message
	$: if ($updateWorkspaceMessage === 'Workspace updated successfully') {
		isSheetOpen = false; // Close the sheet
	}

	// Reactive statement to update workspace details when the workspace prop changes
	$: if (workspace) {
		updateWorkspaceDetails();
	}

	// Reactive statement to update hidden users input value
	let hiddenUsersValue;
	$: hiddenUsersValue = JSON.stringify(
		($workspaceData.users || [])
			.filter((user: { checked: boolean }) => user.checked)
			.map((user: { id: string }) => user.id)
	);
</script>

<Sheet.Root open={isSheetOpen}>
	<Sheet.Trigger asChild let:builder>
		<Button builders={[builder]} variant="outline" on:click={clickOpenSheet} class="p-1 text-xs">
			<PencilIcon class="h-4 w-8" />
		</Button>
	</Sheet.Trigger>
	<Sheet.Content side="right">
		<Sheet.Header>
			<Sheet.Title>Update a Workspace</Sheet.Title>
			<Sheet.Description
				>Update Workspace details here. Click save when you're done.</Sheet.Description
			>
		</Sheet.Header>
		<form method="POST" action="?/updateWorkspace" use:updateWorkspaceEnhance class="space-y-4">
			<input type="hidden" name="id" bind:value={workspace.id} />

			<div>
				<Form.Field name="name" form={updateWorkspaceForm}>
					<Form.Control let:attrs>
						<Form.Label>Name</Form.Label>
						<Input {...attrs} type="text" bind:value={$workspaceData.name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div>
				<Card.Root>
					<Card.Header>
						<Card.Title>Users</Card.Title>
						<Card.Description>Manage your workspace settings here.</Card.Description>
					</Card.Header>
					<Card.Content class="grid gap-6">
						{#if $workspaceData.users.length > 0}
							{#each $workspaceData.users as workspace, index}
								<div class="flex items-center justify-between space-x-2">
									<Label for="workspace-{workspace.id}" class="flex flex-col space-y-1">
										<span>{workspace.name}</span>
									</Label>
									<Switch
										id="workspace-{workspace.id}"
										aria-labelledby="workspace-label-{workspace.id}"
										bind:checked={$workspaceData.users[index].checked}
									/>
								</div>
							{/each}
						{:else}
							<p>No users found.</p>
						{/if}
					</Card.Content>
				</Card.Root>
			</div>
			<input type="hidden" name="users" value={hiddenUsersValue} />

			<Button type="submit" variant="outline">Submit</Button>
		</form>
	</Sheet.Content>
</Sheet.Root>
