<script lang="ts">
	import LogoCareSwitch from './LogoCareSwitch.svelte';
</script>

<header class="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
	<nav
		class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
	>
		<LogoCareSwitch />
		<a href="/" class="text-muted-foreground transition-colors hover:text-foreground"> Home </a>
		<a href="/dashboard" class="text-muted-foreground transition-colors hover:text-foreground">
			Dashboard
		</a>
	</nav>
</header>
