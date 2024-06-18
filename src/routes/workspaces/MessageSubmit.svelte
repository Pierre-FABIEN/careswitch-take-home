<script>
	import * as Alert from '$ui/alert';

	export let createWorkspaceMessage;
	export let deleteWorkspaceMessage;
	export let updateWorkspaceMessage;

	let showMessage = false;
	let animationClass = 'animate-slideIn';

	$: if ($createWorkspaceMessage || $deleteWorkspaceMessage || $updateWorkspaceMessage) {
		showMessage = true;
		animationClass = 'animate-slideIn';
		setTimeout(() => {
			animationClass = 'animate-slideOut';
			setTimeout(() => {
				showMessage = false;
			}, 500); // Durée de l'animation de sortie
		}, 5000);
	}
</script>

{#if showMessage}
	<Alert.Root
		class="fixed bottom-4 right-4 max-w-[200px] border border-green-400 bg-green-500 px-4 py-3 text-white {animationClass}"
		role="alert"
	>
		<Alert.Description
			>{$createWorkspaceMessage ||
				$deleteWorkspaceMessage ||
				$updateWorkspaceMessage}</Alert.Description
		>
	</Alert.Root>
{/if}
