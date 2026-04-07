<script lang="ts">
	import { onMount } from 'svelte';

	interface Star {
		id: number;
		x: number;
		y: number;
		size: number;
		opacity: number;
		char: string;
	}

	const CHARS = ['*', "'", '.', '·', '`'];
	const COUNT = 100;

	let stars: Star[] = $state([]);

	onMount(() => {
		stars = Array.from({ length: COUNT }, (_, i) => randomizeStar(i));

		stars.forEach((_, i) => {
			scheduleCycle(i);
		});
	});

	const randomizeStar = (id: number): Star => ({
		id,
		x: Math.random() * 100,
		y: Math.random() * 100,
		size: 24,
		opacity: 1,
		char: CHARS[Math.floor(Math.random() * CHARS.length)],
	});

	const scheduleCycle = (i: number) => {
		const pause = Math.random() * 4000 + 2000;

		setTimeout(() => {
			stars[i] = { ...stars[i], opacity: 0 };

			setTimeout(() => {
				const next = randomizeStar(stars[i].id);
				stars[i] = { ...next, opacity: 0 };

				setTimeout(() => {
					stars[i] = { ...stars[i], opacity: 1 };
					scheduleCycle(i);
				}, 50);
			}, 600);
		}, pause);
	};
</script>

<div class="pointer-events-none absolute inset-0 overflow-hidden">
	{#each stars as star (star.id)}
		<span
			class="absolute text-stroke-disabled"
			style="
                left: {star.x}%;
                top: {star.y}%;
                font-size: {star.size}px;
                opacity: {star.opacity};
                transition: opacity 600ms ease;
            "
		>
			{star.char}
		</span>
	{/each}
</div>
