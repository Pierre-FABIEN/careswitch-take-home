<script lang="ts">
	import PencilIcon from 'svelte-radix/Pencil1.svelte';
	import * as Form from '$ui/form';
	import * as Sheet from '$ui/sheet';
	import { Input } from '$ui/input';
	import { Button } from '$ui/button';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';

	export let workspace: any;
	export let updateWorkspaceMessage: any;
	export let updateWorkspaceData: any;
	export let updateWorkspaceValidate: any;
	export let updateWorkspaceEnhance: any;
	export let updateWorkspaceForm: any;
	let isSheetOpen = false;

	const workspaceData = writable({
		name: '',
		email: '',
		integer: 0,
		isAdmin: false,
		floatval: 0.0,
		birthday: ''
	});
	$: updateWorkspaceData = workspaceData;

	// Fonction pour mettre à jour les détails de l'utilisateur
	const updateWorkspaceDetails = () => {
		$updateWorkspaceData.name = workspace.name;
	};

	// Initialisation des données utilisateur lors du montage
	onMount(() => {
		updateWorkspaceDetails();
	});

	// Mise à jour des données utilisateur lorsque le message de mise à jour change
	$: if ($updateWorkspaceMessage === 'Workspace updated successfully') {
		isSheetOpen = false;
	}

	// Mettre à jour les détails de l'utilisateur lorsque l'utilisateur change
	$: if (workspace) {
		updateWorkspaceDetails();
	}

	const clickOpenSheet = () => {
		isSheetOpen = true;
	};
</script>

<Sheet.Root open={isSheetOpen}>
	<Sheet.Trigger asChild let:builder>
		<Button builders={[builder]} variant="outline" on:click={clickOpenSheet}><PencilIcon /></Button>
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

			<Button type="submit" variant="outline">Submit</Button>
		</form>
	</Sheet.Content>
</Sheet.Root>
