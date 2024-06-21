<script lang="ts">
	// Importing necessary components and utilities from different UI libraries and local files
	import * as Form from '$ui/form';
	import * as Sheet from '$ui/sheet';
	import { Input } from '$ui/input';
	import * as Card from '$ui/card';
	import { Switch } from '$ui/switch';
	import { Button } from '$ui/button';
	import { Label } from '$lib/components/ui/label';

	import { formContext, type FormContextType } from '$lib/context/formContext';
	import { getContext } from 'svelte';
	import { writable } from 'svelte/store';

	const context = getContext(formContext) as FormContextType;

	// Props to receive data and functions from parent component or route
	export let data: any;
	let hiddenWorkspacesValue: string;

	const {
		createUserForm,
		createUserMessage,
		createUserForm: { form: createUserData, enhance: createUserEnhance }
	} = context;

	// Local state for workspaces and sheet visibility
	let workspaces: App.WorkspaceWithChecked[] = [];

	// Writable store to manage the state of the sheet (open or closed)
	const isSheetOpen = writable(false);

	$: workspaces = data.workspaces.map((workspace: any) => ({
		id: workspace.id,
		name: workspace.name,
		checked: false
	}));

	// Reactive statement to reset state when a user is successfully created
	$: if ($createUserMessage === 'User created successfully') {
		isSheetOpen.set(false); // Close the sheet
	}

	// Reactive statement to update workspaces data in createUserData prop
	$: $createUserData.workspaces = workspaces
		.filter((workspace) => workspace.checked)
		.map((workspace) => workspace.id);

	// Reactive statement to update hidden input value for workspaces
	$: hiddenWorkspacesValue = JSON.stringify($createUserData.workspaces || []);
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
			<Sheet.Title>Create a new user</Sheet.Title>
			<Sheet.Description>Create a new user here. Click save when you're done.</Sheet.Description>
		</Sheet.Header>
		<form method="POST" action="?/createUser" use:createUserEnhance class="space-y-4">
			<div>
				<Form.Field name="name" form={createUserForm}>
					<Form.Control let:attrs>
						<Form.Label>Name</Form.Label>
						<Input {...attrs} type="text" bind:value={$createUserData.name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div>
				<Form.Field name="email" form={createUserForm}>
					<Form.Control let:attrs>
						<Form.Label>Email</Form.Label>
						<Input {...attrs} type="email" bind:value={$createUserData.email} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div>
				<Card.Root>
					<Card.Header>
						<Card.Title>Workspaces</Card.Title>
						<Card.Description>Manage your workspace settings here.</Card.Description>
					</Card.Header>
					<Card.Content class="grid gap-6">
						{#if workspaces.length > 0}
							{#each workspaces as workspace, index}
								<div class="flex items-center justify-between space-x-2">
									<Label for="workspace-{workspace.id}" class="flex flex-col space-y-1">
										<span>{workspace.name}</span>
									</Label>
									<Switch
										id="workspace-{workspace.id}"
										aria-labelledby="workspace-label-{workspace.id}"
										bind:checked={workspaces[index].checked}
									/>
								</div>
							{/each}
						{:else}
							<p>No workspaces found.</p>
						{/if}
					</Card.Content>
				</Card.Root>
			</div>
			<input type="hidden" name="workspaces" value={hiddenWorkspacesValue} />
			<Button type="submit" variant="outline">Submit</Button>
		</form>
	</Sheet.Content>
</Sheet.Root>
