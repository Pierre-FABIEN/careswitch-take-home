<script lang="ts">
	import { writable } from 'svelte/store';
	import * as Form from '$ui/form';
	import * as Sheet from '$ui/sheet';
	import { Input } from '$ui/input';
	import { Button } from '$ui/button';
	import * as Card from '$ui/card';
	import { Label } from '$ui/label';
	import { Switch } from '$ui/switch';

	import PencilIcon from 'svelte-radix/Pencil1.svelte';

	import { getContext } from 'svelte';
	import { formContext, type FormContextType } from '$lib/context/formContext';
	const context = getContext(formContext) as FormContextType;
	const {
		updateUserForm,
		updateUserMessage,
		updateUserForm: { enhance: updateUserEnhance }
	} = context;

	export let user;
	export let data: any;

	// Importing Svelte lifecycle function to run code when the component is mounted
	import { onMount } from 'svelte';
	// Writable store to manage the state of the sheet (open or closed)
	const isSheetOpen = writable(false);

	// Local state variables for hidden input values
	let hiddenWorkspacesValue: string;

	// Writable store to manage user data reactively
	const userData = writable({
		name: '',
		email: '',
		workspaces: [] as { id: string; name: string; checked: boolean }[]
	});

	// Function to update user details in the local state
	const updateUserDetails = () => {
		// Create a set of workspace IDs from the user data
		const userWorkspacesIds = new Set(user.workspaces.map((ws: any) => ws.id));
		// Map over all workspaces, setting the checked property based on the user's workspaces
		const allWorkspaces = data.workspaces.map((ws: any) => ({
			...ws,
			checked: userWorkspacesIds.has(ws.id)
		}));

		// Set the userData store with updated values
		userData.set({
			name: user.name,
			email: user.email,
			workspaces: allWorkspaces
		});
	};

	// On component mount, update user details
	onMount(() => {
		updateUserDetails();
	});

	// Reactive statement to handle successful user update message
	$: if ($updateUserMessage === 'User updated successfully') {
		isSheetOpen.set(false); // Close the sheet
	}

	// Reactive statement to update user details when the user prop changes
	$: if (user) {
		updateUserDetails();
	}

	// Reactive statement to update hidden workspaces input value
	$: hiddenWorkspacesValue = JSON.stringify(
		($userData.workspaces || [])
			.filter((ws: { checked: boolean }) => ws.checked)
			.map((ws: { id: string }) => ws.id)
	);
</script>

<Sheet.Root open={$isSheetOpen}>
	<Sheet.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="outline"
			on:click={() => isSheetOpen.set(true)}
			class="p-1 text-xs"
		>
			<PencilIcon class="h-4 w-8" />
		</Button>
	</Sheet.Trigger>
	<Sheet.Content side="right">
		<Sheet.Header>
			<Sheet.Title>Update a user</Sheet.Title>
			<Sheet.Description>Update user details here. Click save when you're done.</Sheet.Description>
		</Sheet.Header>
		<form method="POST" action="?/updateUser" use:updateUserEnhance class="space-y-4">
			<input type="hidden" name="id" bind:value={user.id} />
			<div>
				<Form.Field name="name" form={updateUserForm}>
					<Form.Control let:attrs>
						<Form.Label>Name</Form.Label>
						<Input {...attrs} type="text" bind:value={$userData.name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<div>
				<Form.Field name="email" form={updateUserForm}>
					<Form.Control let:attrs>
						<Form.Label>Email</Form.Label>
						<Input {...attrs} type="email" bind:value={$userData.email} />
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
						{#if $userData.workspaces.length > 0}
							{#each $userData.workspaces as workspace, index}
								<div class="flex items-center justify-between space-x-2">
									<Label for="workspace-{workspace.id}" class="flex flex-col space-y-1">
										<span>{workspace.name}</span>
									</Label>
									<Switch
										id="workspace-{workspace.id}"
										aria-labelledby="workspace-label-{workspace.id}"
										bind:checked={$userData.workspaces[index].checked}
									/>
								</div>
							{/each}
						{:else}
							<p>No workspaces found.</p>
						{/if}
					</Card.Content>
				</Card.Root>
			</div>

			<input type="hidden" name="workspaces" bind:value={hiddenWorkspacesValue} />

			<Button type="submit" variant="outline">Submit</Button>
		</form>
	</Sheet.Content>
</Sheet.Root>
