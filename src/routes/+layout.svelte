<script>
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import Header from '$components/Header.svelte';

	let { children } = $props();
</script>

<ModeWatcher />
<Header />

{@render children()}
