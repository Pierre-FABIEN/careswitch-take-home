<script>
	import { goto } from '$app/navigation';
	import { Menubar, MenubarMenu, MenubarTrigger } from '$ui/menubar';
</script>

<div class="mx-auto mt-8 max-w-3xl px-4 sm:px-6 lg:px-8">
	<Menubar>
		<MenubarMenu>
			<MenubarTrigger class="menubar-trigger" on:click={() => goto('/')}>Home</MenubarTrigger>
			<MenubarTrigger class="menubar-trigger" on:click={() => goto('/users')}>Users</MenubarTrigger>
			<MenubarTrigger class="menubar-trigger" on:click={() => goto('/workspaces')}
				>Workspaces</MenubarTrigger
			>
		</MenubarMenu>
	</Menubar>
</div>
