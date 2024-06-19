<script lang="ts">
	import { writable } from 'svelte/store';
	import * as Form from '$ui/form';
	import * as Sheet from '$ui/sheet';
	import { Input } from '$ui/input';
	import * as Popover from '$ui/popover';
	import { Calendar } from '$ui/calendar';
	import Checkbox from '$ui/checkbox/checkbox.svelte';
	import { buttonVariants } from '$ui/button';
	import { Button } from '$ui/button';
	import { Label } from '$ui/label/index.js';
	import CalendarIcon from 'svelte-radix/Calendar.svelte';
	import PencilIcon from 'svelte-radix/Pencil1.svelte';
	import { cn } from '$lib/utils.js';
	import {
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		parseDate
	} from '@internationalized/date';
	import { onMount } from 'svelte';

	export let data: any;
	export let user: any;
	export let updateUserMessage: any;
	export let updateUserData: any;
	export let updateUserValidate: any;
	export let updateUserEnhance: any;
	export let updateUserForm: any;

	let isSheetOpen = false;

	let hiddenWorkspacesValue: string;

	let hiddenIsAdminValue: string;

	const userData = writable({
		name: '',
		email: '',
		integer: 0,
		isAdmin: false,
		floatval: 0.0,
		birthday: '',
		workspaces: [] as App.Workspace[]
	});

	const df = new DateFormatter('en-US', { dateStyle: 'long' });
	let birthdayValue: DateValue | undefined = undefined;

	const updateUserDetails = () => {
		const userWorkspacesIds = new Set(user.workspaces.map((ws: any) => ws.id));
		const allWorkspaces = data.workspaces.map((ws: any) => ({
			...ws,
			checked: userWorkspacesIds.has(ws.id)
		}));

		userData.set({
			name: user.name,
			email: user.email,
			integer: user.integer,
			isAdmin: user.isAdmin,
			floatval: user.floatval,
			birthday: user.birthday,
			workspaces: allWorkspaces
		});
		birthdayValue = user.birthday ? parseDate(user.birthday.substring(0, 10)) : undefined;
	};

	const clickOpenSheet = () => {
		isSheetOpen = true;
	};

	onMount(() => {
		updateUserDetails();
	});

	$: updateUserData = userData;

	$: if ($updateUserMessage === 'User updated successfully') {
		isSheetOpen = false;
		birthdayValue = undefined; // Reset the date value
		$updateUserData.birthday = ''; // Clear the form data
	}

	$: if (user) {
		updateUserDetails();
	}

	$: hiddenWorkspacesValue = JSON.stringify(
		$updateUserData.workspaces
			.filter(({ checked }: App.Workspace) => checked)
			.map(({ id }: App.Workspace) => id)
	);

	$: hiddenIsAdminValue = $updateUserData.isAdmin ? 'true' : 'false';
</script>

<Sheet.Root open={isSheetOpen}>
	<Sheet.Trigger asChild let:builder>
		<Button builders={[builder]} variant="outline" on:click={clickOpenSheet}><PencilIcon /></Button>
	</Sheet.Trigger>
	<Sheet.Content side="right">
		<Sheet.Header>
			<Sheet.Title>Update a user</Sheet.Title>
			<Sheet.Description>Update user details here. Click save when you're done.</Sheet.Description>
		</Sheet.Header>
		<form method="POST" action="?/update" use:updateUserEnhance class="space-y-4">
			<input type="hidden" name="id" bind:value={user.id} />
			<div>
				<Form.Field name="name" form={updateUserForm}>
					<Form.Control let:attrs>
						<Form.Label>Name</Form.Label>
						<Input {...attrs} type="text" bind:value={$updateUserData.name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<div>
				<Form.Field name="email" form={updateUserForm}>
					<Form.Control let:attrs>
						<Form.Label>Email</Form.Label>
						<Input {...attrs} type="email" bind:value={$updateUserData.email} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div>
				<Form.Field name="integer" form={updateUserForm}>
					<Form.Control let:attrs>
						<Form.Label>Integer</Form.Label>
						<Input {...attrs} type="number" bind:value={$updateUserData.integer} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div>
				<Form.Field name="isAdmin" form={updateUserForm}>
					<Form.Control let:attrs>
						<Form.Label>Admin</Form.Label>
						<Checkbox {...attrs} bind:checked={$updateUserData.isAdmin} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<input type="hidden" name="isAdmin" bind:value={hiddenIsAdminValue} />

			<div>
				<Form.Field name="floatval" form={updateUserForm}>
					<Form.Control let:attrs>
						<Form.Label>Float value</Form.Label>
						<Input {...attrs} type="number" step="any" bind:value={$updateUserData.floatval} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div>
				<Form.Field form={updateUserForm} name="birthday" class="flex flex-col">
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
											$updateUserData.birthday = '';
											updateUserValidate('birthday');
											return;
										}
										$updateUserData.birthday = value.toDate('UTC').toISOString();
										updateUserValidate('birthday');
									}}
								/>
							</Popover.Content>
							<input hidden bind:value={$updateUserData.birthday} name={attrs.name} />
						</Popover.Root>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<!-- Workspaces -->
			<div>
				{#each $updateUserData.workspaces as workspace, index}
					<div class="my-3 flex items-center space-x-2">
						<Checkbox
							id="workspace-{workspace.id}"
							aria-labelledby="workspace-label-{workspace.id}"
							bind:checked={$updateUserData.workspaces[index].checked}
						/>
						<Label
							id="workspace-label-{workspace.id}"
							for="workspace-{workspace.id}"
							class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							{workspace.name}
						</Label>
					</div>
				{/each}
			</div>

			<!-- Champs cachés pour envoyer les valeurs -->
			<input type="hidden" name="workspaces" bind:value={hiddenWorkspacesValue} />

			<Button type="submit" variant="outline">Submit</Button>
		</form>
	</Sheet.Content>
</Sheet.Root>
