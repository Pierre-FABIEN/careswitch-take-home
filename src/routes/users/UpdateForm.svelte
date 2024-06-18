<script lang="ts">
	import * as Form from '$ui/form';
	import * as Sheet from '$ui/sheet';
	import { Input } from '$ui/input';
	import * as Popover from '$ui/popover';
	import { Calendar } from '$ui/calendar';
	import { buttonVariants } from '$ui/button';
	import CalendarIcon from 'svelte-radix/Calendar.svelte';
	import PencilIcon from 'svelte-radix/Pencil1.svelte';
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

	export let user: any;
	export let updateUserMessage: any;
	export let updateUserData: any;
	export let updateUserValidate: any;
	export let updateUserEnhance: any;
	export let updateUserForm: any;

	let isSheetOpen = writable(false);

	// Date Formatter
	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	// Store for birthday value
	let birthdayValue: DateValue | undefined = undefined;

	// Reactive store for user data
	const userData = writable({
		name: '',
		email: '',
		integer: 0,
		isAdmin: false,
		floatval: 0.0,
		birthday: ''
	});

	// Link userData to updateUserData
	$: updateUserData = userData;

	// Function to update user details
	const updateUserDetails = () => {
		userData.set({
			name: user.name,
			email: user.email,
			integer: user.integer,
			isAdmin: user.isAdmin,
			floatval: user.floatval,
			birthday: user.birthday
		});
		birthdayValue = user.birthday ? parseDate(user.birthday.substring(0, 10)) : undefined;
	};

	// Initialize user data on mount
	onMount(() => {
		console.log('user:', user);
		updateUserDetails();
	});

	// Reset form on successful update
	$: if ($updateUserMessage === 'User updated successfully') {
		isSheetOpen.set(false);
		birthdayValue = undefined; // Reset the date value
		userData.update((data) => ({ ...data, birthday: '' })); // Clear the form data
	}

	// Update user details when user changes
	$: if (user) {
		updateUserDetails();
	}

	$: console.log('userData:', $userData, 'updateUserData', $updateUserData);
</script>

<Sheet.Root bind:open={$isSheetOpen}>
	<Sheet.Trigger asChild>
		<Button variant="outline" on:click={() => isSheetOpen.set(true)}>
			<PencilIcon />
		</Button>
	</Sheet.Trigger>
	<Sheet.Content side="right">
		<Sheet.Header>
			<Sheet.Title>Update a user</Sheet.Title>
			<Sheet.Description>Update user details here. Click save when you're done.</Sheet.Description>
		</Sheet.Header>
		<form method="POST" action="?/update" use:updateUserEnhance class="space-y-4">
			<input type="hidden" name="userId" value={user.id} />
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
				<Form.Field name="integer" form={updateUserForm}>
					<Form.Control let:attrs>
						<Form.Label>Integer</Form.Label>
						<Input {...attrs} type="number" bind:value={$userData.integer} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<div>
				<Form.Field name="isAdmin" form={updateUserForm}>
					<Form.Control let:attrs>
						<Form.Label>Admin</Form.Label>
						<Checkbox {...attrs} bind:checked={$userData.isAdmin} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<div>
				<Form.Field name="floatval" form={updateUserForm}>
					<Form.Control let:attrs>
						<Form.Label>Float value</Form.Label>
						<Input {...attrs} type="number" step="any" bind:value={$userData.floatval} />
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
											userData.update((data) => ({ ...data, birthday: '' }));
											updateUserValidate('birthday');
											return;
										}
										userData.update((data) => ({
											...data,
											birthday: value.toDate('UTC').toISOString()
										}));
										updateUserValidate('birthday');
									}}
								/>
							</Popover.Content>
							<input hidden bind:value={$userData.birthday} name={attrs.name} />
						</Popover.Root>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<Button type="submit" variant="outline">Submit</Button>
		</form>
	</Sheet.Content>
</Sheet.Root>
