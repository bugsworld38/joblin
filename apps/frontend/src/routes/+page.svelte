<script lang="ts">
	import { VacancyList } from '$lib/features/vacancy';

	import { Input } from '$lib/shared/components/input';

	let keywordInput = $state('');
	let keyword = $state('');

	let debounceTimeout: ReturnType<typeof setTimeout>;

	const handleKeywordInput = (value: string) => {
		keywordInput = value;
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			keyword = value;
		}, 300);
	};

	const filters = $derived({ keyword: keyword || undefined });
</script>

<div class="mx-auto flex max-w-2xl flex-col gap-6 p-6">
	<h1 class="text-2xl font-semibold">Vacancies</h1>

	<Input
		type="text"
		placeholder="Search by title or company"
		value={keywordInput}
		oninput={(e) => handleKeywordInput(e.currentTarget.value)}
	/>

	<VacancyList {filters} />
</div>
