<script lang="ts">
	// Importing necessary components and utilities from different UI libraries and local files
	import * as Form from '$ui/form';
	import * as Sheet from '$ui/sheet';
	import { Input } from '$ui/input';
	import * as Popover from '$ui/popover';
	import { Calendar } from '$ui/calendar';
	import { buttonVariants } from '$ui/button';
	import Checkbox from '$ui/checkbox/checkbox.svelte';
	import { Button } from '$ui/button';
	import { Label } from '$ui/label/index.js';
	
	import CalendarIcon from 'svelte-radix/Calendar.svelte';
	import { cn } from '$lib/utils.js';

	// Importing date manipulation utilities from '@internationalized/date'
	import {
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		parseDate
	} from '@internationalized/date';

	// Svelte lifecycle function to run code when the component is mounted
	import { onMount } from 'svelte';
	// Importing writable store from Svelte for reactive state management
	import { writable } from 'svelte/store';

	// Props to receive data and functions from parent component or route
	export let data: any;
	export let createUserMessage: any;
	export let createUserData: any;
	export let createUserValidate: any;
	export let createUserEnhance: any;
	export let createUserForm: any;

	// Local state for workspaces and sheet visibility
	let workspaces: App.WorkspaceWithChecked[] = [];

	// Writable store to manage the state of the sheet (open or closed)
	const isSheetOpen = writable(false);

	// DateFormatter instance to format dates in a specific locale (en-US)
	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	// Parsing the birthday date if available in the createUserData prop
	let birthdayValue: DateValue | undefined = $createUserData.birthday
		? parseDate($createUserData.birthday)
		: undefined;

	// Function to run when the component is mounted
	onMount(() => {
		// Initialize workspaces state with data from the prop
		workspaces = data.workspaces.map((workspace: any) => ({
			id: workspace.id,
			name: workspace.name,
			checked: false
		}));
	});

	// Reactive statement to reset state when a user is successfully created
	$: if ($createUserMessage === 'User created successfully') {
		isSheetOpen.set(false); // Close the sheet
		birthdayValue = undefined; // Reset birthday value
		$createUserData.birthday = ''; // Clear birthday data
	}

	// Reactive statement to update workspaces data in createUserData prop
	$: $createUserData.workspaces = workspaces
		.filter((workspace) => workspace.checked)
		.map((workspace) => workspace.id);

	// Reactive statement to update hidden input value for workspaces
	$: hiddenWorkspacesValue = JSON.stringify($createUserData.workspaces);
</script>

<Sheet.Root open={$isSheetOpen}>
	<Sheet.Trigger asChild let:builder>
		<Button builders={[builder]} variant="outline" on:click={() => isSheetOpen.set(true)}>
			Create
		</Button>
	</Sheet.Trigger>
	<Sheet.Content side="right">
		<Sheet.Header>
			<Sheet.Title>Create a new user</Sheet.Title>
			<Sheet.Description>Create a new user here. Click save when you're done.</Sheet.Description>
		</Sheet.Header>
		<form method="POST" action="?/create" use:createUserEnhance class="space-y-4">
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
				<Form.Field name="integer" form={createUserForm}>
					<Form.Control let:attrs>
						<Form.Label>Integer</Form.Label>
						<Input {...attrs} type="number" bind:value={$createUserData.integer} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div>
				<Form.Field name="isAdmin" form={createUserForm}>
					<Form.Control let:attrs>
						<Form.Label>Admin</Form.Label>
						<Checkbox {...attrs} bind:checked={$createUserData.isAdmin} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div>
				<Form.Field name="floatval" form={createUserForm}>
					<Form.Control let:attrs>
						<Form.Label>Float value</Form.Label>
						<Input {...attrs} type="number" step="any" bind:value={$createUserData.floatval} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div>
				<Form.Field form={createUserForm} name="birthday" class="flex flex-col">
					<Form.Control let:attrs>
						<Form.Label>Date of Birth</Form.Label>
						<Popover.Root>
							<Popover.Trigger
								class={cn(
									buttonVariants({ variant: 'outline' }),
									'w-[240px] justify-start text-left font-normal',
									!birthdayValue && 'text-muted-foreground'
								)}
								{...attrs}
							>
								<CalendarIcon class="mr-2 h-4 w-4" />
								{birthdayValue
									? df.format(birthdayValue.toDate(getLocalTimeZone()))
									: 'Pick a date'}
							</Popover.Trigger>
							<Popover.Content class="w-auto p-0" align="start">
								<Calendar
									bind:value={birthdayValue}
									isDateDisabled={(currDate) => {
										const currDateObj = currDate.toDate(getLocalTimeZone());
										const today = new Date();
										today.setHours(0, 0, 0, 0);

										if (currDateObj > today || currDate.year < 1900) return true;

										return false;
									}}
									onValueChange={(value) => {
										if (value === undefined) {
											$createUserData.birthday = '';
											createUserValidate('birthday');
											return;
										}
										$createUserData.birthday = value.toDate('UTC').toISOString();
										createUserValidate('birthday');
									}}
								/>
							</Popover.Content>
							<input hidden bind:value={$createUserData.birthday} name={attrs.name} />
						</Popover.Root>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div>
				<h4 class="scroll-m-20 text-xl font-semibold tracking-tight">Workspaces</h4>
				<Form.Field name="workspaces" form={createUserForm}>
					<Form.Control let:attrs>
						{#if workspaces.length > 0}
							{#each workspaces as workspace (workspace.id)}
								<div class="my-3 flex items-center space-x-2">
									<Checkbox id={workspace.id} bind:checked={workspace.checked} />
									<Label
										for={workspace.id}
										class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									>
										{workspace.name}
									</Label>
								</div>
							{/each}
						{:else}
							<p>No workspaces found.</p>
						{/if}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<input type="hidden" name="workspaces" value={hiddenWorkspacesValue} />
			<Button type="submit" variant="outline">Submit</Button>
		</form>
	</Sheet.Content>
</Sheet.Root>
