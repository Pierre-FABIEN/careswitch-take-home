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
	import Checkbox from '$components/ui/checkbox/checkbox.svelte';

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

async function reloadUsers() {
	try {
		const response = await fetch('/users');
		if (!response.ok) {
			throw new Error(`Error: ${response.status} ${response.statusText}`);
		}
		const newData = await response.json();
		data.users = newData.users;
	} catch (error) {
		//console.error('Failed to reload users:', error);
	}
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
								<Input {...attrs} type="text" bind:value={$formData.name} />
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>
					<div>
						<Form.Field name="email" {form}>
							<Form.Control let:attrs>
								<Form.Label>Email</Form.Label>
								<Input {...attrs} type="email" bind:value={$formData.email} />
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>

					<div>
						<Form.Field name="integer" {form}>
							<Form.Control let:attrs>
								<Form.Label>Integer</Form.Label>
								<Input {...attrs} type="number" bind:value={$formData.integer} />
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>

					<div>
						<Form.Field name="isAdmin" {form}>
							<Form.Control let:attrs>
								<Form.Label>Admin</Form.Label>
								<Checkbox {...attrs} bind:checked={$formData.isAdmin} />
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>

					<div>
						<Form.Field name="floatval" {form}>
							<Form.Control let:attrs>
								<Form.Label>Float value</Form.Label>
								<Input {...attrs} type="number" bind:value={$formData.floatval} />
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
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
													$formData.birthday = '';
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
	{#if $message}
		<span>{$message}</span>
	{/if}
</div>
