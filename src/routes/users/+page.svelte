<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { onMount } from 'svelte';
	import type { PageData } from '../$types';

	export let data: PageData;

	onMount(() => {
		console.log('users', data);
	});
</script>

<div class="mx-auto mt-8 px-4 sm:px-6 lg:px-8">
	<div class="space-y-6 rounded-md border p-4">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Name</Table.Head>
					<Table.Head>Email</Table.Head>
					<Table.Head>integer</Table.Head>
					<Table.Head>isAdmin</Table.Head>
					<Table.Head>floatval</Table.Head>
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
</div>
