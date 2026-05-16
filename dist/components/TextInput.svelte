<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import X from 'virtual:icons/lucide/x';

	let {
		input = $bindable(),
		value = $bindable(),
		className,
		label,
		showClearButton = false,
		...restProps
	} = $props<
		Omit<HTMLInputAttributes, 'type' | 'input' | 'value' | 'class' | 'autocomplete'> & {
			input?: HTMLInputElement;
			value: string;
			className?: string;
			label?: string;
			showClearButton?: boolean;
		}
	>();
</script>

<div class="flex flex-col">
	{#if label}
		<span class="mb-0.5 text-xs font-medium text-text-primary">{label}</span>
	{/if}
	<div class="relative">
		<input
			bind:this={input}
			bind:value
			autocomplete="off"
			type="text"
			class="{className} w-full rounded border border-border-medium bg-background p-1 text-sm text-text-primary transition-colors placeholder:text-text-muted focus:border-border-strong focus:outline-none"
			{...restProps}
		/>
		{#if showClearButton && value}
			<button
				type="button"
				onclick={() => (value = '')}
				class="absolute top-1/2 right-2 -translate-y-1/2 text-text-muted transition-colors hover:text-text-secondary focus:outline-none"
				aria-label="Clear search"
			>
				<X class="h-4 w-4" />
			</button>
		{/if}
	</div>
</div>
