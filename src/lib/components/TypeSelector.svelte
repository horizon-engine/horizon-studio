<script lang="ts">
	import type { Type } from '$lib/types';
	import TypeSelector from './TypeSelector.svelte';

	let {
		type = $bindable(),
		class: className,
		indent = true
	} = $props<{ type: Type; class?: string; indent?: boolean }>();

	function handleChange(e: Event) {
		const selected = (e.target as HTMLSelectElement).value;
		type = selected === 'array' ? { arrayOf: 'int' } : selected;
	}
</script>

<div class={`space-y-2 ${className}`}>
	<select
		class="w-full rounded border border-border-medium bg-background py-0.5 pr-8 pl-2 text-sm text-text-primary transition-colors focus:border-border-strong focus:outline-none"
		value={typeof type === 'string' ? type : 'array'}
		onchange={handleChange}
	>
		<option value="int">int</option>
		<option value="float">float</option>
		<option value="string">string</option>
		<option value="bool">boolean</option>
		<option value="array">array of ...</option>
	</select>
	{#if typeof type !== 'string'}
		<div class={indent ? 'ml-4' : ''}>
			<TypeSelector bind:type={() => type.arrayOf, (v) => (type = { arrayOf: v })} {indent} />
		</div>
	{/if}
</div>
