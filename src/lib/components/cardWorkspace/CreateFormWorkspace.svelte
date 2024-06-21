<script lang="ts">
	// Importing necessary components from various UI libraries
	import * as Form from '$ui/form';
	import * as Sheet from '$ui/sheet';
	import { Input } from '$ui/input';
	import * as Card from '$ui/card';
	import { Switch } from '$ui/switch';
	import { Button } from '$ui/button';
	import { Label } from '$lib/components/ui/label';

	// Importing writable store from Svelte for reactive state management
	import { getContext } from 'svelte';
	import { formContext, type FormContextType } from '$lib/context/formContext';
	import { writable } from 'svelte/store';

	const context = getContext(formContext) as FormContextType;

	const {
		createWorkspaceForm,
		createWorkspaceMessage,
		createWorkspaceForm: { form: createWorkspaceData, enhance: createWorkspaceEnhance }
	} = context;

	// Props to receive data and functions from parent component or route
	export let data: any;

	// Writable store to manage the state of the sheet (open or closed)
	const isSheetOpen = writable(false);

	// Local state for users
	let users: App.UserWithChecked[] = [];

	$: users = data.users.map((user: App.UserWithChecked) => ({
		id: user.id,
		name: user.name,
		checked: false
	}));

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
		<Button
			builders={[builder]}
			class="h-8 w-28"
			variant="outline"
			on:click={() => isSheetOpen.set(true)}
		>
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
		<form method="POST" action="?/createWorkspace" use:createWorkspaceEnhance class="space-y-4">
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
				<Card.Root>
					<Card.Header>
						<Card.Title>Users</Card.Title>
						<Card.Description>Manage your workspace settings here.</Card.Description>
					</Card.Header>
					<Card.Content class="grid gap-6">
						{#if users.length > 0}
							{#each users as workspace, index}
								<div class="flex items-center justify-between space-x-2">
									<Label for="workspace-{workspace.id}" class="flex flex-col space-y-1">
										<span>{workspace.name}</span>
									</Label>
									<Switch
										id="workspace-{workspace.id}"
										aria-labelledby="workspace-label-{workspace.id}"
										bind:checked={users[index].checked}
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
