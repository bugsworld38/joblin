<script lang="ts">
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { ModeWatcher } from 'mode-watcher';

	import { Toaster } from '$lib/shared/components/sonner';

	import favicon from '../assets/favicon.svg';
	import './layout.css';

	const queryClient = new QueryClient();

	const { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<QueryClientProvider client={queryClient}>
	<ModeWatcher />
	<Toaster />
	{@render children()}
</QueryClientProvider>
