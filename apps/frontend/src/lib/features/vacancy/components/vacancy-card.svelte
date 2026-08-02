<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/shared/components/card';

	import type { Vacancy } from '../types';

	const { vacancy }: { vacancy: Vacancy } = $props();
</script>

<a href={vacancy.url} target="_blank" rel="noopener noreferrer" class="block">
	<Card class="transition-colors hover:bg-surface-secondary/70">
		<CardHeader>
			<CardTitle>{vacancy.positionTitle}</CardTitle>
		</CardHeader>
		<CardContent>
			<p class="text-sm text-muted-foreground">{vacancy.companyName}</p>
		</CardContent>
	</Card>
</a>
