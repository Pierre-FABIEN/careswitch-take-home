<script lang="ts">
	// Importing writable store from Svelte for reactive state management
	import { writable } from 'svelte/store';
	// Importing Svelte lifecycle function to run code when the component is mounted
	import { onMount } from 'svelte';

	// Importing necessary components from various UI libraries
	import PencilIcon from 'svelte-radix/Pencil1.svelte';
	import * as Form from '$ui/form';
	import * as Sheet from '$ui/sheet';
	import { Input } from '$ui/input';
	import { Button } from '$ui/button';
	import { Checkbox } from '$ui/checkbox';
	import { Label } from '$ui/label';

	// Props to receive data and functions from parent component or route
	export let data: any;
	export let workspace: App.Workspace;
	export let updateWorkspaceMessage: any;
	export let updateWorkspaceData: any;
	export let updateWorkspaceEnhance: any;
	export let updateWorkspaceForm: any;

	// Local state to manage the visibility of the sheet
	let isSheetOpen = false;

	// Function to open the sheet
	const clickOpenSheet = () => {
		isSheetOpen = true;
	};

	// Function to update workspace details in the local state
	const updateWorkspaceDetails = () => {
		// Create a set of user IDs from the workspace data
		const workspaceUserIds = new Set(workspace.users.map((user: App.User) => user.id));
		// Map over all users, setting the checked property based on the workspace's users
		const allUsers = data.users.map((user: App.User) => ({
			...user,
			checked: workspaceUserIds.has(user.id)
		}));

		// Set the updateWorkspaceData store with updated values
		updateWorkspaceData.set({
			name: workspace.name,
			users: allUsers
		});
	};

	// Writable store to manage workspace data reactively
	const workspaceData = writable({
		name: '',
		email: '',
		integer: 0,
		isAdmin: false,
		floatval: 0.0,
		birthday: ''
	});

	// On component mount, update workspace details
	onMount(() => {
		updateWorkspaceDetails();
	});

	// Reactive statement to bind workspaceData to updateWorkspaceData prop
	$: updateWorkspaceData = workspaceData;

	// Reactive statement to handle successful workspace update message
	$: if ($updateWorkspaceMessage === 'Workspace updated successfully') {
		isSheetOpen = false; // Close the sheet
	}

	// Reactive statement to update workspace details when the workspace prop changes
	$: if (workspace) {
		updateWorkspaceDetails();
	}
</script>

<Sheet.Root open={isSheetOpen}>
	<Sheet.Trigger asChild let:builder>
		<Button builders={[builder]} variant="outline" on:click={clickOpenSheet}>
			<PencilIcon />
		</Button>
	</Sheet.Trigger>
	<Sheet.Content side="right">
		<Sheet.Header>
			<Sheet.Title>Update a Workspace</Sheet.Title>
			<Sheet.Description
				>Update Workspace details here. Click save when you're done.</Sheet.Description
			>
		</Sheet.Header>
		<form method="POST" action="?/update" use:updateWorkspaceEnhance class="space-y-4">
			<input type="hidden" name="id" bind:value={workspace.id} />

			<div>
				<Form.Field name="name" form={updateWorkspaceForm}>
					<Form.Control let:attrs>
						<Form.Label>Name</Form.Label>
						<Input {...attrs} type="text" bind:value={$updateWorkspaceData.name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div>
				<h4 class="scroll-m-20 text-xl font-semibold tracking-tight">Users</h4>
				<Form.Field name="users" form={updateWorkspaceForm}>
					<Form.Control let:attrs>
						{#if $updateWorkspaceData.users.length > 0}
							{#each $updateWorkspaceData.users as user (user.id)}
								<div class="my-3 flex items-center space-x-2">
									<Checkbox id="user-{user.id}" bind:checked={user.checked} />
									<Label
										for="user-{user.id}"
										class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									>
										{user.name}
									</Label>
								</div>
							{/each}
						{:else}
							<p>No users found.</p>
						{/if}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<input
				type="hidden"
				name="users"
				value={JSON.stringify(
					$updateWorkspaceData.users.filter((user: any) => user.checked).map((user: any) => user.id)
				)}
			/>

			<Button type="submit" variant="outline">Submit</Button>
		</form>
	</Sheet.Content>
</Sheet.Root>
