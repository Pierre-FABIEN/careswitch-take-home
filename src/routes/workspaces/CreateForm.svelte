<script lang="ts">
	// Importing writable store from Svelte for reactive state management
	import { writable } from 'svelte/store';
	// Importing Svelte lifecycle function to run code when the component is mounted
	import { onMount } from 'svelte';

	// Importing necessary components from various UI libraries
	import * as Form from '$ui/form';
	import * as Sheet from '$ui/sheet';
	import { Input } from '$ui/input';
	import { Button } from '$ui/button';
	import { Checkbox } from '$ui/checkbox';
	import { Label } from '$ui/label';

	// Props to receive data and functions from parent component or route
	export let data: any;
	export let createWorkspaceMessage: any;
	export let createWorkspaceData: any;
	export let createWorkspaceEnhance: any;
	export let createWorkspaceForm: any;

	// Writable store to manage the state of the sheet (open or closed)
	const isSheetOpen = writable(false);

	// Local state for users
	let users: App.UserWithChecked[] = [];

	// Function to run when the component is mounted
	onMount(() => {
		// Initialize users state with data from the prop
		users = data.users.map((user: App.UserWithChecked) => ({
			id: user.id,
			name: user.name,
			checked: false
		}));
	});

	// Reactive statement to handle successful workspace creation message
	$: if ($createWorkspaceMessage === 'Workspace created successfully') {
		isSheetOpen.set(false); // Close the sheet
	}

	// Reactive statement to update users data in createWorkspaceData prop
	$: $createWorkspaceData.users = users.filter((user) => user.checked).map((user) => user.id);

	// Reactive statement to update hidden input value for users
	$: hiddenUsersValue = JSON.stringify($createWorkspaceData.users);
</script>

<Sheet.Root open={$isSheetOpen}>
	<Sheet.Trigger asChild let:builder>
		<Button builders={[builder]} variant="outline" on:click={() => isSheetOpen.set(true)}>
			Create
		</Button>
	</Sheet.Trigger>
	<Sheet.Content side="right">
		<Sheet.Header>
			<Sheet.Title>Create a new Workspace</Sheet.Title>
			<Sheet.Description>
				Create a new Workspace here. Click save when you're done.
			</Sheet.Description>
		</Sheet.Header>
		<form method="POST" action="?/create" use:createWorkspaceEnhance class="space-y-4">
			<div>
				<Form.Field name="name" form={createWorkspaceForm}>
					<Form.Control let:attrs>
						<Form.Label>Name</Form.Label>
						<Input {...attrs} type="text" bind:value={$createWorkspaceData.name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div>
				<h4 class="scroll-m-20 text-xl font-semibold tracking-tight">Users</h4>
				<Form.Field name="users" form={createWorkspaceForm}>
					<Form.Control let:attrs>
						{#if users.length > 0}
							{#each users as user (user.id)}
								<div class="my-3 flex items-center space-x-2">
									<Checkbox id={user.id} bind:checked={user.checked} />
									<Label
										for={user.id}
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

			<input type="hidden" name="users" value={hiddenUsersValue} />

			<Button type="submit" variant="outline">Submit</Button>
		</form>
	</Sheet.Content>
</Sheet.Root>
