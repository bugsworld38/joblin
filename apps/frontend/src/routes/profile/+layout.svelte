<script lang="ts">
	import { PrivateRoute } from '$lib/shared/components/routes';

	const { children } = $props();
</script>

<PrivateRoute>
	{@render children()}
</PrivateRoute>
