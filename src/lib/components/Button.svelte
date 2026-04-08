<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	let {
		children,
		variant = 'default',
		class: className = '',
		selected = false,
		...rest
	} = $props<{
		children?: Snippet;
		variant?: 'default' | 'primary' | 'secondary' | 'menu' | 'icon';
		class?: string;
		selected?: boolean;
	} & HTMLButtonAttributes>();

	let computedClass = $derived.by(() => {
		const base = 'transition-all duration-200';
		
		switch (variant) {
			case 'menu':
				return `cursor-pointer rounded-xl p-4 flex flex-row items-center gap-2 text-[var(--new-color-text-btn)] ${selected ? "bg-[var(--new-color-btn-bg-selected)] text-[var(--new-color-text-selected)]" : "bg-[var(--new-color-btn-bg)] hover:bg-[var(--new-color-btn-hover)] hover:text-[var(--new-color-text-hover)]"} ${base} ${className}`;
			case 'icon':
				return `cursor-pointer rounded-xl border border-border-subtle bg-background p-3 shadow-md hover:border-border-medium text-text-primary flex justify-center items-center ${base} ${className}`;
			case 'primary':
				return `rounded bg-primary px-4 py-2 text-text-inverted hover:bg-primary-dark w-fit font-medium disabled:opacity-50 disabled:cursor-not-allowed ${base} ${className}`;
			case 'secondary':
				return `rounded bg-surface px-4 py-2 text-text-primary hover:bg-border-strong w-fit font-medium disabled:opacity-50 disabled:cursor-not-allowed ${base} ${className}`;
			default:
				return `${base} ${className}`;
		}
	});
</script>

<button
	class={computedClass}
	{...rest}
>
	{#if children}
		{@render children()}
	{/if}
</button>