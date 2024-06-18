<script lang="ts">
	import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
	import {
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		parseDate
	} from '@internationalized/date';

	import { zodClient } from 'sveltekit-superforms/adapters';
	import { userCreateSchema, type UserCreateSchema } from '$lib/schemas/userCreateSchema';
	import { userDeleteSchema, type UserDeleteSchema } from '$lib/schemas/userDeleteSchema';
	import { userUpdateSchema, type UserUpdateSchema } from '$lib/schemas/userUpdateSchema';

	import * as Table from '$lib/components/ui/table';
	import * as Form from '$ui/form';
	import * as Sheet from '$ui/sheet';
	import { Button } from '$ui/button';
	import { Input } from '$ui/input';
	import * as Popover from '$ui/popover';
	import { Calendar } from '$ui/calendar';
	import { buttonVariants } from '$ui/button';
	import CalendarIcon from 'svelte-radix/Calendar.svelte';
	import TrashIcon from 'svelte-radix/Trash.svelte';
	import { cn } from '$lib/utils.js';
	import Checkbox from '$components/ui/checkbox/checkbox.svelte';

	import * as Alert from '$ui/alert';
	import { onMount } from 'svelte';

	export let data: {
		userCreateform: SuperValidated<Infer<UserCreateSchema>>;
		userDeleteform: SuperValidated<Infer<UserDeleteSchema>>;
		userUpdateSchema: SuperValidated<Infer<UserUpdateSchema>>;
		users: any[];
	};

	const createUserForm = superForm(data.userCreateform, {
		validators: zodClient(userCreateSchema),
		dataType: 'json'
	});

	const updateUserForm = superForm(data.userCreateform, {
		validators: zodClient(userUpdateSchema),
		dataType: 'json'
	});

	const deleteUserForm = superForm(data.userDeleteform, {
		validators: zodClient(userDeleteSchema)
	});

	const {
		form: createUserData,
		enhance: createUserEnhance,
		message: createUserMessage,
		validate: createUserValidate
	} = createUserForm;

	const {
		form: updateUserData,
		enhance: updateUserEnhance,
		message: updateUserMessage,
		validate: updateUserValidate
	} = updateUserForm;

	const { enhance: deleteUserEnhance } = deleteUserForm;

	let isSheetOpen = false;

	$: if ($createUserMessage === 'User created successfully') {
		isSheetOpen = false;
	}

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let birthdayValue: DateValue | undefined = $createUserData.birthday
		? parseDate($createUserData.birthday)
		: undefined;

	// Animation
	let showMessage = false;
	let animationClass = 'animate-slideIn';

	$: if ($createUserMessage) {
		showMessage = true;
		animationClass = 'animate-slideIn';
		setTimeout(() => {
			animationClass = 'animate-slideOut';
			setTimeout(() => {
				showMessage = false;
			}, 500); // Durée de l'animation de sortie
		}, 5000);
	}

	onMount(() => {
		console.log(data);
	});
</script>

<div class="mx-auto mt-8 px-4 sm:px-6 lg:px-8">
	<div class="mb-4 flex justify-end">
		<Sheet.Root open={isSheetOpen}>
			<Sheet.Trigger asChild let:builder>
				<Button builders={[builder]} variant="outline" on:click={() => (isSheetOpen = true)}>
					Create
				</Button>
			</Sheet.Trigger>
			<Sheet.Content side="right">
				<Sheet.Header>
					<Sheet.Title>Create a new user</Sheet.Title>
					<Sheet.Description>Create a new user here. Click save when you're done.</Sheet.Description
					>
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
								<Input {...attrs} type="number" bind:value={$createUserData.floatval} />
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
					<Button type="submit" variant="outline">Submit</Button>
				</form>
			</Sheet.Content>
		</Sheet.Root>
	</div>
	<div class="space-y-6 rounded-md border p-4">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Name</Table.Head>
					<Table.Head>Email</Table.Head>
					<Table.Head>Integer</Table.Head>
					<Table.Head>Admin</Table.Head>
					<Table.Head>Float value</Table.Head>
					<Table.Head>Birthday</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if data.users && Array.isArray(data.users)}
					{#each data.users as user (user.id)}
						<Table.Row>
							<Table.Cell>{user.name}</Table.Cell>
							<Table.Cell>{user.email}</Table.Cell>
							<Table.Cell>{user.integer}</Table.Cell>
							<Table.Cell>{user.isAdmin}</Table.Cell>
							<Table.Cell>{user.floatval}</Table.Cell>
							<Table.Cell>{new Date(user.birthday).toLocaleDateString()}</Table.Cell>
							<Table.Cell>
								<form method="POST" action="?/delete" use:deleteUserEnhance>
									<input type="hidden" name="userId" value={user.id} />
									<Button type="submit" variant="outline"><TrashIcon /></Button>
								</form>
							</Table.Cell>
						</Table.Row>
					{/each}
				{:else}
					<Table.Row>
						<Table.Cell class="text-center">No users found.</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</div>
</div>

{#if showMessage}
	<Alert.Root
		class="fixed bottom-4 right-4 max-w-[200px] border border-green-400 bg-green-500 px-4 py-3 text-white {animationClass}"
		role="alert"
	>
		<Alert.Description>{$createUserMessage}</Alert.Description>
	</Alert.Root>
{/if}
