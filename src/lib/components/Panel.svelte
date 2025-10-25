<script lang="ts">
	import type { Snippet } from 'svelte';

	let { title, children } = $props<{ title?: string; children: Snippet }>();
</script>

<div
	class="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden rounded-lg border-2 border-border-strong bg-background shadow-sm"
>
	{#if title}
		<div
			class="shrink-0 border-b-2 border-border-strong bg-linear-to-r from-primary/5 to-secondary/5 px-4 py-3"
		>
			<h3 class="text-sm font-semibold text-text-primary">
				{title}
			</h3>
		</div>
	{/if}
	<div class="h-full min-h-0 w-full flex-1">
		{@render children()}
	</div>
</div>
