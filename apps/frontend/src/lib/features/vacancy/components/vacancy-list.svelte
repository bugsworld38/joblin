<script lang="ts">
	import { Button } from '$lib/shared/components/button';
	import { Spinner } from '$lib/shared/components/spinner';

	import { createVacanciesQuery } from '../queries';
	import type { VacancyListFilters } from '../types';
	import VacancyCard from './vacancy-card.svelte';

	const { filters }: { filters: VacancyListFilters } = $props();

	const vacanciesQuery = createVacanciesQuery(() => filters);

	const vacancies = $derived(vacanciesQuery.data?.pages.flatMap((page) => page.data) ?? []);
</script>

{#if vacanciesQuery.isPending}
	<div class="flex justify-center py-12">
		<Spinner class="size-6" />
	</div>
{:else if vacanciesQuery.isError}
	<p class="py-12 text-center text-sm text-muted-foreground">Failed to load vacancies.</p>
{:else if vacancies.length === 0}
	<p class="py-12 text-center text-sm text-muted-foreground">No vacancies found.</p>
{:else}
	<div class="flex flex-col gap-3">
		{#each vacancies as vacancy (vacancy.id)}
			<VacancyCard {vacancy} />
		{/each}
	</div>

	{#if vacanciesQuery.hasNextPage}
		<div class="flex justify-center pt-2">
			<Button
				variant="outline"
				size="sm"
				disabled={vacanciesQuery.isFetchingNextPage}
				onclick={() => vacanciesQuery.fetchNextPage()}
			>
				{vacanciesQuery.isFetchingNextPage ? 'Loading…' : 'Show more'}
			</Button>
		</div>
	{/if}
{/if}
