<script lang="ts">
	import { goto } from '$app/navigation';

	import { authContext } from '$lib/features/auth';

	const { children } = $props();

	$effect(() => {
		if (authContext.isAuthenticated) {
			goto('/profile');
		}
	});
</script>

{#if !authContext.isAuthenticated}
	{@render children()}
{/if}
