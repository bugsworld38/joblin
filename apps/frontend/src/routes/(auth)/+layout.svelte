<script lang="ts">
	import { PublicRoute } from '$lib/shared/components/routes';
	import { StarField } from '$lib/shared/components/star-field';

	const { children } = $props();
</script>

<PublicRoute>
	<div class="flex h-screen justify-center">
		<StarField />
		<div class="-mt-[calc(224px-56px-30vh)] flex w-full flex-col items-center gap-14 px-2">
			<pre>
   ___       _     _ _
  |_  |     | |   | (_)
    | | ___ | |__ | |_ _ __
    | |/ _ \| '_ \| | | '_ \
/\__/ / (_) | |_) | | | | | |
\____/ \___/|_.__/|_|_|_| |_|
        </pre>

			{@render children()}
		</div>
	</div>
</PublicRoute>
