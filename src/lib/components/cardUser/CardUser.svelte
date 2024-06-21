<script lang="ts">
	import CreateFormUser from './CreateFormUser.svelte';
	import UpdateFormUser from './UpdateFormUser.svelte';

	import * as Card from '$ui/card/';
	import { Separator } from '$ui/separator/';
	import * as AlertDialog from '$ui/alert-dialog';
	import { Button } from '$ui/button';

	import Trash from 'svelte-radix/Trash.svelte';

	import { getContext } from 'svelte';
	import { formContext, type FormContextType } from '$lib/context/formContext';

	export let data: any;

	const context = getContext(formContext) as FormContextType;
	const { deleteUserEnhance } = context;

	console.log(data);
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Users</Card.Title>
		<Card.Description>Create some users and assign them on workspaces.</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="flex flex-row-reverse space-x-2">
			<CreateFormUser {data} />
		</div>
		<Separator class="my-4" />
		<div class="space-y-4">
			<div class="grid gap-6">
				{#if data.users && Array.isArray(data.users) && data.users.length > 0}
					{#each data.users as user (user.id)}
						<div class="flex items-center justify-between space-x-4">
							<div class="flex items-center space-x-4">
								<div>
									<p class="text-sm font-medium leading-none">
										{user.name}
									</p>
									<p class="text-sm text-muted-foreground">
										{user.email}
									</p>
									<p class="text-sm text-muted-foreground">
										{#each user.workspaces as workspace}
											<span>{workspace.name}</span>,
										{/each}
									</p>
								</div>
							</div>

							<div class="flex items-center space-x-2">
								<AlertDialog.Root>
									<AlertDialog.Trigger asChild let:builder>
										<Button builders={[builder]} variant="outline" class="p-1 text-xs">
											<Trash class="h-4 w-8" />
										</Button>
									</AlertDialog.Trigger>
									<AlertDialog.Content>
										<AlertDialog.Header>
											<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
											<AlertDialog.Description>
												This action cannot be undone. This will permanently delete your account and
												remove your data from our servers.
											</AlertDialog.Description>
										</AlertDialog.Header>
										<AlertDialog.Footer>
											<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
											<form method="POST" action="?/deleteUser" use:deleteUserEnhance>
												<input type="hidden" name="id" value={user.id} />
												<AlertDialog.Action type="submit">Continue</AlertDialog.Action>
											</form>
										</AlertDialog.Footer>
									</AlertDialog.Content>
								</AlertDialog.Root>

								<UpdateFormUser {data} {user} />
							</div>
						</div>
					{/each}
				{:else}
					<div class="my-5 text-lg font-semibold">No users found.</div>
				{/if}
			</div>
		</div>
	</Card.Content>
</Card.Root>
