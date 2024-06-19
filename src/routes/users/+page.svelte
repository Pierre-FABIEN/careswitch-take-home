<script lang="ts">
	import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import MessageHandler from '$components/MessageHandler.svelte';
	import CreateForm from './CreateForm.svelte';

	import * as Table from '$ui/table';
	import { Button } from '$ui/button';
	import TrashIcon from 'svelte-radix/Trash.svelte';

	import UpdateForm from './UpdateForm.svelte';
	import MessageSubmit from './MessageSubmit.svelte';

	import { userCreateSchema, type UserCreateSchema } from '$lib/schemas/users/userCreateSchema';
	import { userDeleteSchema, type UserDeleteSchema } from '$lib/schemas/users/userDeleteSchema';
	import { userUpdateSchema, type UserUpdateSchema } from '$lib/schemas/users/userUpdateSchema';

	export let data: {
		userCreateform: SuperValidated<Infer<UserCreateSchema>>;
		userDeleteform: SuperValidated<Infer<UserDeleteSchema>>;
		userUpdateSchema: SuperValidated<Infer<UserUpdateSchema>>;
		workspaces: any[];
		users: any[];
	};

	const createUserForm = superForm(data.userCreateform, {
		validators: zodClient(userCreateSchema),
		id: 'createUserForm'
	});

	const updateUserForm = superForm(data.userCreateform, {
		validators: zodClient(userUpdateSchema),
		id: 'updateUserForm'
	});

	const deleteUserForm = superForm(data.userDeleteform, {
		validators: zodClient(userDeleteSchema),
		id: 'deleteUserForm'
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

	const { enhance: deleteUserEnhance, message: deleteUserMessage } = deleteUserForm;
</script>

<div class="mx-auto mt-8 px-4 sm:px-6 lg:px-8">
	<div class="mb-4 flex justify-end">
		<CreateForm
			{data}
			{createUserMessage}
			{createUserData}
			{createUserValidate}
			{createUserEnhance}
			{createUserForm}
		/>
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
					<Table.Head>Workspaces</Table.Head>
					<Table.Head>Edit</Table.Head>
					<Table.Head>Delete</Table.Head>
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
								{#each user.workspaces as workspace}
									<span>{workspace.name}</span><br />
								{/each}
							</Table.Cell>
							<Table.Cell>
								<UpdateForm
									{data}
									{user}
									{updateUserMessage}
									{updateUserData}
									{updateUserValidate}
									{updateUserEnhance}
									{updateUserForm}
								/>
							</Table.Cell>
							<Table.Cell>
								<form method="POST" action="?/delete" use:deleteUserEnhance>
									<input type="hidden" name="id" value={user.id} />
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

<!-- <MessageSubmit {createUserMessage} {deleteUserMessage} {updateUserMessage} /> -->
<MessageHandler
	createMessage={$createUserMessage || ''}
	deleteMessage={$deleteUserMessage || ''}
	updateMessage={$updateUserMessage || ''}
/>
