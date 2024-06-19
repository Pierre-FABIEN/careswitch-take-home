<script lang="ts">
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';

	import PencilIcon from 'svelte-radix/Pencil1.svelte';
	import * as Form from '$ui/form';
	import * as Sheet from '$ui/sheet';
	import { Input } from '$ui/input';
	import { Button } from '$ui/button';
	import { Checkbox } from '$ui/checkbox';
	import { Label } from '$ui/label';

	export let data: any;
	export let workspace: any;
	export let updateWorkspaceMessage: any;
	export let updateWorkspaceData: any;
	export let updateWorkspaceEnhance: any;
	export let updateWorkspaceForm: any;

	let isSheetOpen = false;

	const clickOpenSheet = () => {
		isSheetOpen = true;
	};

	const updateWorkspaceDetails = () => {
		const workspaceUserIds = new Set(workspace.users.map((user: any) => user.id));
		const allUsers = data.users.map((user: any) => ({
			...user,
			checked: workspaceUserIds.has(user.id)
		}));

		updateWorkspaceData.set({
			name: workspace.name,
			users: allUsers
		});
	};

	const workspaceData = writable({
		name: '',
		email: '',
		integer: 0,
		isAdmin: false,
		floatval: 0.0,
		birthday: ''
	});

	onMount(() => {
		updateWorkspaceDetails();
	});

	$: updateWorkspaceData = workspaceData;

	$: if ($updateWorkspaceMessage === 'Workspace updated successfully') {
		isSheetOpen = false;
	}

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

			<!-- Users -->
			<div>
				<Form.Field name="users" form={updateWorkspaceForm}>
					<Form.Control let:attrs>
						<Form.Label>Users</Form.Label>
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
