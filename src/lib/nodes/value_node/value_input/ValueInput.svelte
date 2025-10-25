<script lang="ts">
	import type { Type } from '$lib/types';
	import { defaultValue } from '$lib/type_utils';

	import BoolInput from './BoolInput.svelte';
	import FloatInput from './FloatInput.svelte';
	import IntInput from './IntInput.svelte';
	import StringValue from './StringValue.svelte';
	import ValueInput from './ValueInput.svelte';

	let { type, value = $bindable() } = $props<{ type: Type; value: any }>();
</script>

{#if type === 'int'}
	<IntInput bind:value />
{:else if type === 'float'}
	<FloatInput bind:value />
{:else if type === 'string'}
	<StringValue bind:value />
{:else if type === 'bool'}
	<BoolInput bind:value />
{:else}
	<div class="mx-4 rounded-lg border-2 border-border-subtle bg-surface-elevated px-4 py-1">
		{#each Array.isArray(value) ? value : [], idx (idx)}
			<div class="flex items-center space-x-2 pt-2">
				<ValueInput
					type={type.arrayOf}
					bind:value={() => value[idx], (v) => (value = Object.assign([...value], { [idx]: v }))}
				/>
				<button
					type="button"
					class="cursor-pointer text-sm text-error hover:underline"
					onclick={() => (value = value.filter((_: any, i: number) => i !== idx))}
				>
					Remove
				</button>
			</div>
		{/each}
		<button
			type="button"
			class="cursor-pointer text-sm text-sky-600 hover:underline"
			onclick={() => (value = [...(Array.isArray(value) ? value : []), defaultValue(type.arrayOf)])}
		>
			+ Add Item
		</button>
	</div>
{/if}
