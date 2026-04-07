<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	import type { WithElementRef } from '$lib/shared/types';
	import { cn } from '$lib/shared/utils';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="card"
	class={cn(
		'relative flex flex-col gap-6 bg-surface-secondary p-6 text-card-foreground',
		className,
	)}
	{...restProps}
>
	{@render corner('-top-[1px] -left-[1px] border-t-2 border-l-2')}
	{@render corner('-top-[1px] -right-[1px] border-t-2 border-r-2')}
	{@render corner('-bottom-[1px] -left-[1px] border-b-2 border-l-2')}
	{@render corner('-bottom-[1px] -right-[1px] border-b-2 border-r-2')}

	{@render children?.()}
</div>

{#snippet corner(position: string)}
	<span class="absolute h-5 w-5 border-stroke-disabled {position}"></span>
{/snippet}
