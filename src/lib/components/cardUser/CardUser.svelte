<script lang="ts">
	import * as Card from '$ui/card/';
	import { Separator } from '$ui/separator/';
	import * as AlertDialog from '$ui/alert-dialog';
	import { Button } from '$ui/button';

	import Trash from 'svelte-radix/Trash.svelte';

	import CreateFormUser from './CreateFormUser.svelte';
	import UpdateFormUser from './UpdateFormUser.svelte';

	import { getContext } from 'svelte';
	import { formContext, type FormContextType } from '$lib/context/formContext';
	const context = getContext(formContext) as FormContextType;
	const { deleteUserEnhance } = context;

	export let data: any;
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
		<div class="grid gap-6">
			{#if data.users && Array.isArray(data.users) && data.users.length > 0}
				{#each data.users as user (user.id)}
					<div class="flex items-center justify-start space-x-4">
						<div class="flex flex-col items-end justify-start space-x-2">
							<div class="my-2">
								<AlertDialog.Root>
									<AlertDialog.Trigger asChild let:builder>
										<Button builders={[builder]} variant="outline" class="ml-0 p-1 text-xs">
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
							</div>
							<div class="my-2">
								<UpdateFormUser {data} {user} />
							</div>
						</div>
						<div class="flex items-center space-x-4">
							<span>
								<svg
									class="max-h-[80px]"
									width="4px"
									height="100%"
									xmlns="http://www.w3.org/2000/svg"
								>
									<rect width="4px" height="100%" fill={user.color} />
								</svg>
							</span>
							<div>
								<p class="text-sm font-medium leading-none">
									{user.name}
								</p>
								<p class="my-2 flex space-x-2 text-sm text-muted-foreground">
									{#each user.workspaces as workspaces}
										<span
											class="inline-block rounded-full border px-2 py-1 text-xs font-medium lowercase text-cyan-50"
											style="border-color: {workspaces.color};"
										>
											{workspaces.name.slice(0, 3).toUpperCase()}
										</span>
									{/each}
								</p>
							</div>
						</div>
					</div>
				{/each}
			{:else}
				<div class="my-5 text-lg font-semibold">No users found.</div>
			{/if}
		</div>
	</Card.Content>
</Card.Root>
