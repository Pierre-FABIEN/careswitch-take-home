<script lang="ts">
	import LogoCareSwitch from './LogoCareSwitch.svelte';
</script>

<header class="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
	<nav
		class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
	>
		<LogoCareSwitch />
		<a href="/" class="text-muted-foreground transition-colors hover:text-foreground"> Home </a>
		<a href="/users" class="text-muted-foreground transition-colors hover:text-foreground">
			Users
		</a>
		<a href="/workspaces" class="text-muted-foreground transition-colors hover:text-foreground">
			Workspaces
		</a>
	</nav>
</header>
<!-- <script lang="ts">
	import { goto } from '$app/navigation';
	import { Menubar, MenubarMenu, MenubarTrigger } from '$ui/menubar';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';

	$: currentPage = $page.url.pathname;

	$: console.log(currentPage);

	if (currentPage === '/') {
		console.log('mlkmlk');
	}

	const isActive = (path: string) => currentPage === path;
</script>

<div class="mt-8 flex justify-center px-4 sm:px-6">
	<Menubar>
		<MenubarMenu>
			<MenubarTrigger on:click={() => goto('/')} data-state={isActive('/') ? 'open' : ''}
				>Home</MenubarTrigger
			>
			<MenubarTrigger on:click={() => goto('/users')} data-state={isActive('/users') ? 'open' : ''}
				>Users</MenubarTrigger
			>
			<MenubarTrigger
				on:click={() => goto('/workspaces')}
				data-state={isActive('/workspaces') ? 'open' : ''}>Workspaces</MenubarTrigger
			>
		</MenubarMenu>
	</Menubar>
</div> -->
