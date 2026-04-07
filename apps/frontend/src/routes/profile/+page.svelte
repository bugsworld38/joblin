<script lang="ts">
	import { createGetMeQuery, createLogoutMutation } from '$lib/features/auth';

	import { Button } from '$lib/shared/components/button';

	const meQuery = createGetMeQuery();
	const logoutMutation = createLogoutMutation();

	const handleLogout = () => {
		logoutMutation.mutate();
	};
</script>

{#if meQuery.isPending}
	<span>loading..</span>
{:else if meQuery.data}
	<p>{meQuery.data.email}</p>
{/if}

<Button onclick={handleLogout} disabled={logoutMutation.isPending}>log out</Button>
