<script lang="ts">
	import { store } from '../../state.svelte';
	import { NodeResizer, NodeToolbar, type NodeProps } from '@xyflow/svelte';
	import SwatchBook from 'virtual:icons/lucide/swatch-book';

	let { selected }: NodeProps = $props();

	let color = $state('pink');
	let showToolbar = $state(false);

	let title = $state('double click to edit title');
	let isEditing = $state(false);
	let inputElement: HTMLInputElement | undefined = $state(undefined);

	const colorOptions = [
		'pink',
		'rose',
		'violet',
		'teal',
		'sky',
		'emerald',
		'green',
		'yellow',
		'slate'
	];

	$effect(() => {
		if (!selected) {
			showToolbar = false;
		}
	});

	function onResizeEnd() {
		store.updateFlow = true;
	}

	function handleDoubleClick() {
		isEditing = true;
		setTimeout(() => {
			inputElement?.focus();
			inputElement?.select();
		}, 0);
	}

	function onblur(event: FocusEvent) {
		title = (event.target as HTMLInputElement).value.trim();
		isEditing = false;
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			title = (event.target as HTMLInputElement).value.trim();
			isEditing = false;
			return;
		}
		if (event.key === 'Escape') {
			isEditing = false;
		}
	}

	function toggleToolbar() {
		showToolbar = !showToolbar;
	}

	function selectColor(colorOption: string) {
		color = colorOption;
		showToolbar = false;
	}
</script>

<NodeResizer
	minWidth={256}
	minHeight={128}
	color="transparent"
	lineStyle="border-width: 5px;"
	handleStyle="background-color: transparent; border-width: 0; width: 10px; height: 10px;"
	{onResizeEnd}
/>
<NodeToolbar isVisible={showToolbar && selected} class="nopan">
	<div class="flex gap-1 rounded-lg border border-[#e5e5e5] bg-background p-2 shadow-md">
		{#each colorOptions as colorOption}
			<button
				onclick={() => selectColor(colorOption)}
				class="{colorOption} h-6 w-6 cursor-pointer rounded-full transition-transform duration-150 ease-in-out hover:scale-110"
				title="Set color to {colorOption}"
			></button>
		{/each}
	</div>
</NodeToolbar>
<div
	class="{color} {selected
		? 'is-selected'
		: ''} relative h-full min-h-24 sm:min-h-32 w-full min-w-48 sm:min-w-56 md:min-w-64 overflow-hidden rounded-md border outline-offset-2 backdrop-blur-[1px] [.is-selected]:outline-2"
>
	<div
		class="{color} flex h-7 w-full items-center justify-center border-b px-2"
		ondblclick={handleDoubleClick}
		role="button"
		tabindex="0"
	>
		{#if isEditing}
			<input
				bind:this={inputElement}
				value={title}
				{onblur}
				{onkeydown}
				class="nodrag w-full border-none bg-transparent px-2 text-center outline-none focus:border-none focus:ring-0 focus:outline-none"
				type="text"
			/>
		{:else}
			<div class="w-fit truncate">
				{title}
			</div>
		{/if}
	</div>

	<!-- Button to toggle toolbar - positioned at bottom right -->
	<div class="absolute right-1.5 bottom-1">
		<button
			onclick={toggleToolbar}
			class="curosr-pointer cursor-pointer rounded-full bg-background/50 p-1 text-xs font-medium shadow-xs transition-all duration-200 hover:bg-background/70"
			title="Toggle color options"
		>
			<SwatchBook />
		</button>
	</div>
</div>

<style>
	/* Responsive wrapper for small screens */
	@media (max-width: 640px) {
		:global(.nopan) {
			scale: 0.85;
			transform-origin: top right;
		}
	}

	.pink {
		background-color: rgba(252, 206, 232, 0.5);
		border-color: rgba(254, 165, 213, 0.5);
		outline-color: rgba(254, 165, 213, 0.5);
	}

	.rose {
		background-color: rgba(255, 204, 210, 0.5);
		border-color: rgba(255, 161, 173, 0.5);
		outline-color: rgba(255, 161, 173, 0.5);
	}

	.violet {
		background-color: rgba(221, 214, 255, 0.5);
		border-color: rgba(196, 180, 255, 0.5);
		outline-color: rgba(196, 180, 255, 0.5);
	}

	.teal {
		background-color: rgba(150, 247, 228, 0.5);
		border-color: rgba(70, 236, 212, 0.5);
		outline-color: rgba(70, 236, 212, 0.5);
	}

	.sky {
		background-color: rgba(184, 230, 254, 0.5);
		border-color: rgba(116, 212, 255, 0.5);
		outline-color: rgba(116, 212, 255, 0.5);
	}

	.emerald {
		background-color: rgba(164, 244, 207, 0.5);
		border-color: rgba(94, 233, 181, 0.5);
		outline-color: rgba(94, 233, 181, 0.5);
	}

	.green {
		background-color: rgba(185, 248, 207, 0.5);
		border-color: rgba(123, 241, 167, 0.5);
		outline-color: rgba(123, 241, 167, 0.5);
	}

	.yellow {
		background-color: rgba(255, 240, 133, 0.5);
		border-color: rgba(255, 223, 32, 0.5);
		outline-color: rgba(255, 223, 32, 0.5);
	}

	.slate {
		background-color: rgba(226, 232, 240, 0.5);
		border-color: rgba(202, 213, 226, 0.5);
		outline-color: rgba(202, 213, 226, 0.5);
	}
</style>
