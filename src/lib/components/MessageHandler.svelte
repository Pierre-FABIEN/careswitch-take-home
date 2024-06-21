<script>
	import * as Alert from '$ui/alert';

	export let createMessage = '';
	export let deleteMessage = '';
	export let updateMessage = '';

	let showMessage = false;
	let animationClass = 'animate-slideIn';

	// Mettre à jour la variable showMessage et animationClass quand un message est présent
	$: if (createMessage || deleteMessage || updateMessage) {
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
		class="fixed bottom-4 left-4 max-w-[300px] border border-green-400 bg-green-500 px-4 py-3 text-white {animationClass}"
		role="alert"
	>
		<Alert.Description>
			{createMessage || deleteMessage || updateMessage}
		</Alert.Description>
	</Alert.Root>
{/if}
