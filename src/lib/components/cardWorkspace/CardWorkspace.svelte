<script lang="ts">
	import * as Card from '$ui/card/';
	import { Separator } from '$ui/separator/';
	import * as AlertDialog from '$ui/alert-dialog';
	import { Button } from '$ui/button';

	import Trash from 'svelte-radix/Trash.svelte';

	import { getContext } from 'svelte';
	import { formContext, type FormContextType } from '$lib/context/formContext';
	const context = getContext(formContext) as FormContextType;
	const { deleteWorkspaceEnhance } = context;

	import CreateFormWorkspace from './CreateFormWorkspace.svelte';
	import UpdateFormWorkspace from './UpdateFormWorkspace.svelte';

	export let data: any;
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Workspace</Card.Title>
		<Card.Description>Create some workspaces and assign them on users.</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="flex flex-row-reverse space-x-2">
			<CreateFormWorkspace {data} />
		</div>
		<Separator class="my-4" />
		<div class="space-y-4">
			<div class="grid gap-6">
				{#if data.workspaces && Array.isArray(data.workspaces) && data.workspaces.length > 0}
					{#each data.workspaces as workspace (workspace.id)}
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
													This action cannot be undone. This will permanently delete your account
													and remove your data from our servers.
												</AlertDialog.Description>
											</AlertDialog.Header>
											<AlertDialog.Footer>
												<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
												<form method="POST" action="?/deleteWorkspace" use:deleteWorkspaceEnhance>
													<input type="hidden" name="id" value={workspace.id} />
													<AlertDialog.Action type="submit">Continue</AlertDialog.Action>
												</form>
											</AlertDialog.Footer>
										</AlertDialog.Content>
									</AlertDialog.Root>
								</div>
								<div class="my-2">
									<UpdateFormWorkspace {data} {workspace} />
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
										<rect width="4px" height="100%" fill={workspace.color} />
									</svg>
								</span>
								<div>
									<p class="text-sm font-medium leading-none">
										{workspace.name}
									</p>
									<p class="my-2 flex space-x-2 text-sm text-muted-foreground">
										{#each workspace.users as user}
											<span
												class="inline-block rounded-full border px-2 py-1 text-xs font-medium text-cyan-50"
												style="border-color: {user.color};"
											>
												{user.name.length > 5 ? `${user.name.slice(0, 5)}...` : user.name}
											</span>
										{/each}
									</p>
								</div>
							</div>
						</div>
					{/each}
				{:else}
					<div class="my-5 text-lg font-semibold">No workspaces found.</div>
				{/if}
			</div>
		</div>
	</Card.Content>
</Card.Root>
