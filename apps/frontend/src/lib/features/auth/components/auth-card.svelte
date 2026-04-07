<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	import * as Card from '$lib/shared/components/card';
	import * as Tabs from '$lib/shared/components/tabs';

	import LoginForm from './login-form.svelte';
	import RegisterForm from './register-form.svelte';

	interface AuthCardProps {
		class?: string;
	}

	const { class: className }: AuthCardProps = $props();

	const tabs = [
		{ value: '/login', label: 'Login' },
		{ value: '/register', label: 'Sign Up' },
	];

	const activeTab = $derived(page.url.pathname);
</script>

<Card.Root class={className}>
	<Tabs.Root value={activeTab} onValueChange={(value) => goto(value)}>
		<Tabs.List class="w-full">
			{#each tabs as tab (tab.value)}
				<Tabs.Trigger value={tab.value}>{tab.label}</Tabs.Trigger>
			{/each}
		</Tabs.List>

		<Card.Content>
			<Tabs.Content value="/login">
				<LoginForm />
			</Tabs.Content>

			<Tabs.Content value="/register">
				<RegisterForm />
			</Tabs.Content>
		</Card.Content>
	</Tabs.Root>
</Card.Root>
