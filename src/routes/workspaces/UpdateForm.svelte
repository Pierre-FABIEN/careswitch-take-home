<script lang="ts">
	import * as Form from '$ui/form';
	import * as Sheet from '$ui/sheet';
	import { Input } from '$ui/input';
	import * as Popover from '$ui/popover';
	import { Calendar } from '$ui/calendar';
	import { buttonVariants } from '$ui/button';
	import CalendarIcon from 'svelte-radix/Calendar.svelte';
	import { cn } from '$lib/utils.js';
	import Checkbox from '$components/ui/checkbox/checkbox.svelte';
	import { Button } from '$ui/button';
	import { writable } from 'svelte/store';

	import {
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		parseDate
	} from '@internationalized/date';
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

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let birthdayValue: DateValue | undefined = undefined;

	// Fonction pour mettre à jour les détails de l'utilisateur
	const updateWorkspaceDetails = () => {
		$updateWorkspaceData.name = workspace.name;
		$updateWorkspaceData.email = workspace.email;
		$updateWorkspaceData.integer = workspace.integer;
		$updateWorkspaceData.isAdmin = workspace.isAdmin;
		$updateWorkspaceData.floatval = workspace.floatval;
		$updateWorkspaceData.birthday = workspace.birthday;
		birthdayValue = workspace.birthday ? parseDate(workspace.birthday.substring(0, 10)) : undefined;
	};

	// Initialisation des données utilisateur lors du montage
	onMount(() => {
		updateWorkspaceDetails();
	});

	// Mise à jour des données utilisateur lorsque le message de mise à jour change
	$: if ($updateWorkspaceMessage === 'Workspace updated successfully') {
		isSheetOpen = false;
		birthdayValue = undefined; // Reset the date value
		$updateWorkspaceData.birthday = ''; // Clear the form data
	}

	// Mettre à jour les détails de l'utilisateur lorsque l'utilisateur change
	$: if (workspace) {
		updateWorkspaceDetails();
	}

	const test = async () => {
		console.log('Form data:', $updateWorkspaceData);
	};

	const clickOpenSheet = () => {
		isSheetOpen = true;
	};
</script>

<Sheet.Root open={isSheetOpen}>
	<Sheet.Trigger asChild let:builder>
		<Button builders={[builder]} variant="outline" on:click={clickOpenSheet}>update</Button>
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
				<Form.Field name="email" form={updateWorkspaceForm}>
					<Form.Control let:attrs>
						<Form.Label>Email</Form.Label>
						<Input {...attrs} type="email" bind:value={$updateWorkspaceData.email} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div>
				<Form.Field name="integer" form={updateWorkspaceForm}>
					<Form.Control let:attrs>
						<Form.Label>Integer</Form.Label>
						<Input {...attrs} type="number" bind:value={$updateWorkspaceData.integer} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div>
				<Form.Field name="isAdmin" form={updateWorkspaceForm}>
					<Form.Control let:attrs>
						<Form.Label>Admin</Form.Label>
						<Checkbox {...attrs} bind:checked={$updateWorkspaceData.isAdmin} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div>
				<Form.Field name="floatval" form={updateWorkspaceForm}>
					<Form.Control let:attrs>
						<Form.Label>Float value</Form.Label>
						<Input {...attrs} type="number" step="any" bind:value={$updateWorkspaceData.floatval} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div>
				<Form.Field form={updateWorkspaceForm} name="birthday" class="flex flex-col">
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
											$updateWorkspaceData.birthday = '';
											updateWorkspaceValidate('birthday');
											return;
										}
										$updateWorkspaceData.birthday = value.toDate('UTC').toISOString();
										updateWorkspaceValidate('birthday');
									}}
								/>
							</Popover.Content>
							<input hidden bind:value={$updateWorkspaceData.birthday} name={attrs.name} />
						</Popover.Root>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<Button type="submit" variant="outline" on:click={test}>Submit</Button>
		</form>
	</Sheet.Content>
</Sheet.Root>
