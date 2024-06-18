<script lang="ts">
	import * as Form from '$ui/form';
	import * as Sheet from '$ui/sheet';
	import { Input } from '$ui/input';
	import { Button } from '$ui/button';

	export let createWorkspaceMessage: any;
	export let createWorkspaceData: any;
	export let createWorkspaceValidate: any;
	export let createWorkspaceEnhance: any;
	export let createWorkspaceForm: any;
	let isSheetOpen = false;

	$: if ($createWorkspaceMessage === 'Workspace created successfully') {
		isSheetOpen = false;
	}
</script>

<Sheet.Root open={isSheetOpen}>
	<Sheet.Trigger asChild let:builder>
		<Button builders={[builder]} variant="outline" on:click={() => (isSheetOpen = true)}>
			Create
		</Button>
	</Sheet.Trigger>
	<Sheet.Content side="right">
		<Sheet.Header>
			<Sheet.Title>Create a new Workspace</Sheet.Title>
			<Sheet.Description
				>Create a new Workspace here. Click save when you're done.</Sheet.Description
			>
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

			<Button type="submit" variant="outline">Submit</Button>
		</form>
	</Sheet.Content>
</Sheet.Root>
