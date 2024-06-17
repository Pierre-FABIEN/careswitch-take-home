<script lang="ts">
	import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
	import {
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		parseDate
	} from '@internationalized/date';

	import { zodClient } from 'sveltekit-superforms/adapters';
	import { userSchema, type UserSchema } from '$lib/schemas/userSchema';

	import * as Table from '$lib/components/ui/table';
	import * as Form from '$ui/form';
	import * as Sheet from '$ui/sheet';
	import { Button } from '$ui/button';
	import { Input } from '$ui/input';
	import * as Popover from '$ui/popover';
	import { Calendar } from '$ui/calendar';
	import { buttonVariants } from '$ui/button';
	import CalendarIcon from 'svelte-radix/Calendar.svelte';
	import { cn } from '$lib/utils.js';
	import { onMount } from 'svelte';

	export let data: { form: SuperValidated<Infer<UserSchema>>; users: any[] };

	const form = superForm(data.form, {
		validators: zodClient(userSchema),
		dataType: 'json'
	});

	const { form: formData, enhance, errors, message, validate } = form;

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let birthdayValue: DateValue | undefined = $formData.birthday
		? parseDate($formData.birthday)
		: undefined;

	onMount(() => {
		console.log('users', data);
	});

	async function reloadUsers() {
		const response = await fetch('/users');
		const newData = await response.json();
		data.users = newData.users;
	}
</script>

<div class="mx-auto mt-8 px-4 sm:px-6 lg:px-8">
	<div class="mb-4 flex justify-end">
		<Sheet.Root>
			<Sheet.Trigger asChild let:builder>
				<Button builders={[builder]} variant="outline">Create</Button>
			</Sheet.Trigger>
			<Sheet.Content side="right">
				<Sheet.Header>
					<Sheet.Title>Create a new user</Sheet.Title>
					<Sheet.Description>Create a new user here. Click save when you're done.</Sheet.Description
					>
				</Sheet.Header>
				<form
					method="POST"
					use:enhance
					on:submit={() => setTimeout(reloadUsers, 1000)}
					class="space-y-4"
				>
					<div>
						<Form.Field name="name" {form}>
							<Form.Control let:attrs>
								<Form.Label>Name</Form.Label>
								<Input {...attrs} bind:value={$formData.name} />
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>
					<div>
						<label for="email">Email</label>
						<input
							bind:value={$formData.email}
							type="email"
							name="email"
							required
							class="mt-1 block w-full"
						/>
						{#if $errors.email}
							<span class="text-red-500">{$errors.email}</span>
						{/if}
					</div>

					<div>
						<label for="age">Age</label>
						<input bind:value={$formData.age} type="number" name="age" class="mt-1 block w-full" />
						{#if $errors.age}
							<span class="text-red-500">{$errors.age}</span>
						{/if}
					</div>

					<div>
						<label for="isAdmin">Is Admin</label>
						<input
							bind:checked={$formData.isAdmin}
							type="checkbox"
							name="isAdmin"
							class="mt-1 block"
						/>
						{#if $errors.isAdmin}
							<span class="text-red-500">{$errors.isAdmin}</span>
						{/if}
					</div>

					<div>
						<label for="balance">Balance</label>
						<input
							bind:value={$formData.balance}
							type="number"
							name="balance"
							class="mt-1 block w-full"
						/>
						{#if $errors.balance}
							<span class="text-red-500">{$errors.balance}</span>
						{/if}
					</div>

					<div>
						<Form.Field {form} name="birthday" class="flex flex-col">
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
													$formData.birthday = undefined;
													validate('birthday');
													return;
												}
												$formData.birthday = value.toDate('UTC').toISOString();
												validate('birthday');
											}}
										/>
									</Popover.Content>
									<input hidden bind:value={$formData.birthday} name={attrs.name} />
								</Popover.Root>
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>

					<div>
						<label for="role">Role</label>
						<input
							bind:value={$formData.role}
							type="text"
							name="role"
							required
							class="mt-1 block w-full"
						/>
						{#if $errors.role}
							<span class="text-red-500">{$errors.role}</span>
						{/if}
					</div>

					{#if $message}
						<span>{$message}</span>
					{/if}
					<button type="submit" class="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
						>Create User</button
					>
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
					<Table.Head>Age</Table.Head>
					<Table.Head>Role</Table.Head>
					<Table.Head>Balance</Table.Head>
					<Table.Head>Birthday</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if data.users && Array.isArray(data.users)}
					{#each data.users as user (user.id)}
						<Table.Row>
							<Table.Cell>{user.name}</Table.Cell>
							<Table.Cell>{user.email}</Table.Cell>
							<Table.Cell>{user.age}</Table.Cell>
							<Table.Cell>{user.role}</Table.Cell>
							<Table.Cell>{user.balance}</Table.Cell>
							<Table.Cell>{new Date(user.birthday).toLocaleDateString()}</Table.Cell>
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
