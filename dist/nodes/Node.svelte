<script lang="ts">
	import Handle from '../handles/Handle.svelte';
	import { handleValidTypes, store } from '../state.svelte';
	import type { HandleBlueprint } from '../types';
	import { getConnectionValidTypes } from '../type_utils';
	import { NodeToolbar, useEdges, type HandleConnection } from '@xyflow/svelte';
	import { onMount, tick, type Snippet } from 'svelte';
	import X from 'virtual:icons/lucide/x';
	import Info from 'virtual:icons/lucide/info';

	const { id, title, enabled, error_message, selected, handles, children, color, text_color, icon } = $props<{
		id: string;
		title: string;
		enabled: boolean;
		error_message: string;
		selected: boolean;
		handles: HandleBlueprint[];
		children: Snippet;
		color?: string;
		text_color?: string;
		icon?: Snippet;
	}>();

	let edges = useEdges();
	let updating_edges = $state(false);
	let handles_valid_types = $state(handles.map((handle: HandleBlueprint) => handle.valid_types));

	function resetHandles() {
		handleValidTypes.set(
			id,
			new Map(handles.map((handle: HandleBlueprint) => [handle.id, handle.valid_types]))
		);
		handles_valid_types = handles.map((handle: HandleBlueprint) => handle.valid_types);
	}

	onMount(() => {
		resetHandles();
	});

	function onconnect(connections: HandleConnection[]) {
		for (const connection of connections) {
			const valid_types = getConnectionValidTypes(connection)!;
			const node_handles = handleValidTypes.get(id)!;
			node_handles.set(connection.targetHandle ?? '', valid_types);
			node_handles.set(connection.sourceHandle ?? '', valid_types);
			handles
				.find(
					(handle: HandleBlueprint) =>
						(connection.source === id && handle.id === connection.sourceHandle) ||
						(connection.target === id && handle.id === connection.targetHandle)
				)
				?.onconnect?.(valid_types, node_handles);
		}
		handles_valid_types = handles.map(
			(handle: HandleBlueprint) => handleValidTypes.get(id)?.get(handle.id) ?? handle.valid_types
		);
	}

	// disconnect all edges and try to reconnect them
	// this automatically removes edges that are no longer valid,
	// forces an update on the valid types of the handles
	// and propagates the changes to the connected nodes
	export async function updateNodeEdges() {
		// when disconnecting an edge,
		if (updating_edges) {
			return;
		}
		updating_edges = true;

		const edges_to_reconnect = edges.current.filter(
			(edge) => edge.source === id || edge.target === id
		);

		resetHandles();

		edges.set(
			edges.current.filter(
				(edge) => !edges_to_reconnect.find((edge_to_reconnect) => edge.id === edge_to_reconnect.id)
			)
		);

		await tick();

		for (const new_edge of edges_to_reconnect) {
			if (edges.current.find((edge) => edge.id === new_edge.id)) {
				continue;
			}

			if (!isValidConnection(new_edge)) {
				continue;
			}

			edges.set([...edges.current, new_edge]);
		}
		updating_edges = false;
	}

	function ondisconnect() {
		updateNodeEdges();
	}

	function isValidConnection(connection: {
		source: string;
		target: string;
		sourceHandle?: string | null;
		targetHandle?: string | null;
	}): boolean {
		return getConnectionValidTypes(connection) !== null;
	}

	$effect(() => {
		handles;
		resetHandles();
	});
</script>

<NodeToolbar
	class="nopan -translate-y-2 rounded-lg border border-border-medium bg-background p-2 text-xl shadow-sm"
	isVisible={error_message !== ''}
>
	<div class="flex items-center justify-between gap-1">
		<span>{error_message}</span>
		<button
			onclick={() => (store.clearErrors = true)}
			class="shrink-0 cursor-pointer rounded p-1 text-text-primary transition-colors hover:bg-surface"
			title="Close"
			aria-label="Close error message"
		>
			<X />
		</button>
	</div>
</NodeToolbar>
<div
	class="{error_message === ''
		? ''
		: 'show-error'} overflow-hidden rounded-lg border border-border-strong text-text-primary outline-offset-2 outline-error [.show-error]:outline-2"
>
    <div
        class="{selected
            ? 'is-selected'
            : ''} dragHandle relative flex h-8 flex-col justify-center border-b border-border-strong bg-surface/50 px-8 backdrop-blur-md [.is-selected]:bg-primary-muted/10"
        style={color ? `background-color: ${color};` : ''}
    >
        <div class="flex items-center justify-start gap-2">
            {#if icon}
                <div class="[&>svg]:w-full [&>svg]:h-full flex h-4 w-4 flex-shrink-0 items-center justify-center">
                    {@render icon()}
                </div>
            {/if}
            <span style={text_color ? `color: ${text_color};` : ''}>{title}</span>
        </div>
        <button
            onclick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')?.focus()}
            class="absolute right-0.5 cursor-pointer rounded p-1 transition-colors"
            title="Documentation"
        >
            <Info class="mt-0.5 h-3 w-3 text-text-secondary" />
        </button>
    </div>
	<div class="nodrag relative h-full w-full bg-background p-2">
		<div class="cursor-auto">
			{@render children()}
		</div>
		{#if !enabled}
			<div class="pointer-events-none absolute inset-0 bg-background opacity-70"></div>
		{/if}
	</div>
</div>

{#each handles as handle, i}
	<Handle
		type={handle.type}
		valid_types={handles_valid_types[i]}
		node_id={id}
		id={handle.id}
		y_position_percents={handle.y_position_percents}
		{isValidConnection}
		{onconnect}
		{ondisconnect}
	/>
{/each}
