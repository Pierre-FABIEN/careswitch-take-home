<script lang="ts">
	import LogoCareSwitch from './LogoCareSwitch.svelte';
</script>

<header class="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
	<nav
		class="md:text-s flex flex-row gap-6 text-sm font-medium md:items-center md:gap-5 md:text-lg lg:gap-6"
	>
		<LogoCareSwitch />
		<a href="/" class="text-muted-foreground transition-colors hover:text-foreground"> Home </a>
		<a href="/dashboard" class="text-muted-foreground transition-colors hover:text-foreground">
			Dashboard
		</a>
	</nav>
</header>
