<script lang="ts">
	import type { Variable } from '../types';
	import { useDnD } from '../providers/DnDProvider.svelte';
	import Fuse from 'fuse.js';
	import { useSvelteFlow, type Node } from '@xyflow/svelte';
	import { nanoid } from 'nanoid';
	import TextInput from './TextInput.svelte';
	import { getNodeSearchTerms, getNodeShortDescription, getNodeTitle } from '../node_metadata';
	import { getTypeDisplay } from '../type_utils';

	interface NodeDefinition {
		type: string;
		color: string;
		icon?: string;
	}

	let {
		variables,
		mode = 'drag-and-drop',
		include_variables = false,
		addNode
	} = $props<{
		variables: Variable[];
		mode?: 'drag-and-drop' | 'click-to-add';
		include_variables?: boolean;
		addNode: (node: Node) => void;
	}>();

	let searchInput: HTMLInputElement | undefined = $state(undefined);

	const { screenToFlowPosition } = useSvelteFlow();

	const type = useDnD();

	let searchQuery = $state('');

	export function updateSearch(search: string) {
		searchQuery = search;
	}

	export function focusSearch() {
		const attemptFocus = () => {
			if (searchInput && searchInput.offsetParent !== null) {
				searchInput.focus();
			} else {
				setTimeout(() => {
					attemptFocus();
				}, 0);
			}
		};
		setTimeout(() => {
			attemptFocus();
		}, 0);
	}

	interface NodeBlueprint {
		type: string;
		data: {
			[key: string]: any;
		};
	}

	function get_node_builder(type: string): () => NodeBlueprint {
		return () => {
			return {
				type,
				data: {
					...(type !== 'postit_node' &&
						type !== 'group_node' && {
							error_message: '',
							enabled: false
						}),
					...(type === 'set_variable_node' && { variables }),
					...(type === 'value_node' && { type: 'int' })
				}
			};
		};
	}

	const nodes: NodeDefinition[] = [
		{ type: 'value_node',                 color: '#1D3C36' },
		{ type: 'set_variable_node',          color: '#2E4A6B' },
		{ type: 'if_node',                    color: '#45342A' },
		{ type: 'while_node',                 color: '#5C3317' },
		{ type: 'not_node',                   color: '#3B1F5E' },
		{ type: 'add_node',                   color: '#1A4A2E' },
		{ type: 'subtract_node',              color: '#1A4A2E' },
		{ type: 'multiply_node',              color: '#1A4A2E' },
		{ type: 'divide_node',                color: '#1A4A2E' },
		{ type: 'modulo_node',                color: '#1A4A2E' },
		{ type: 'equality_node',              color: '#4A3B1A' },
		{ type: 'inequality_node',            color: '#4A3B1A' },
		{ type: 'and_node',                   color: '#3B1A1A' },
		{ type: 'or_node',                    color: '#3B1A1A' },
		{ type: 'less_than_node',             color: '#4A3B1A' },
		{ type: 'less_than_or_equal_node',    color: '#4A3B1A' },
		{ type: 'greater_than_node',          color: '#4A3B1A' },
		{ type: 'greater_than_or_equal_node', color: '#4A3B1A' },
		{ type: 'group_node',                 color: '#2A2A2A' },
		{ type: 'postit_node',                color: '#5C5C00' }
	];

	let nodes_to_filter = $derived(
		nodes
			.map((node) => ({
				node_builder: get_node_builder(node.type),
				title: getNodeTitle(node.type),
				description: getNodeShortDescription(node.type),
				search_terms: getNodeSearchTerms(node.type),
				type: node,
				color: node.color,
				icon: node.icon
			}))
			.concat(
				include_variables
					? variables.map((variable: Variable) => ({
							node_builder: () => {
								return {
									type: 'variable_node',
									data: {
										enabled: false,
										error_message: '',
										variable: { type: getTypeDisplay(variable.type), name: variable.name }
									}
								};
							},
							title: variable.name,
							description: getTypeDisplay(variable.type),
							search_terms: getNodeSearchTerms('variable_node'),
							type: 'variable_node'
						}))
					: []
			)
	);

	const nodeSearcher = $derived(
		new Fuse(nodes_to_filter, {
			keys: ['title', 'description', 'type', 'search_terms'],
			threshold: 0.5
		})
	);

	const filteredNodes = $derived.by(() => {
		if (!searchQuery.trim()) {
			return nodes_to_filter;
		}
		const results = nodeSearcher.search(searchQuery);
		return results.map((result) => result.item);
	});

	const onDragStart = (event: DragEvent, nodeData: string) => {
		if (!event.dataTransfer) {
			return null;
		}

		type.current = nodeData;

		event.dataTransfer.effectAllowed = 'move';
	};

	function addNodeToFlow(event: MouseEvent | KeyboardEvent, node: NodeBlueprint) {
		const element = event.currentTarget as HTMLElement;
		const rect = element.getBoundingClientRect!();
		const position =
			mode === 'click-to-add'
				? { x: rect.x - rect.width * 0.25, y: rect.y }
				: { x: window.innerWidth / 2, y: window.innerHeight / 2 };
		addNode({
			...node,
			id: nanoid(),
			position: screenToFlowPosition(position)
		});
	}
</script>

<div class="flex h-full w-full max-w-full flex-col">
	<div class="border-b border-border-medium p-3">
		<TextInput
			bind:input={searchInput}
			bind:value={searchQuery}
			placeholder="Search nodes..."
			showClearButton={true}
			onkeydown={(event: KeyboardEvent) => {
				if (event.key === 'Enter' && filteredNodes.length > 0) {
					addNodeToFlow(event, filteredNodes[0].node_builder());
				}
			}}
		/>
	</div>
	<div class="h-full w-full flex-1 overflow-y-auto">
		<div class="space-y-2 p-3">
			{#each filteredNodes as node}
				<div
					role="button"
					tabindex="0"
					class="w-full overflow-hidden rounded-md border border-border-medium bg-surface p-2.5 transition-all hover:border-border-strong hover:bg-surface-elevated hover:shadow-sm"
					ondragstart={(event: DragEvent) => {
						if (mode === 'click-to-add') return;
						const dragImage = (event.currentTarget as HTMLDivElement).cloneNode(
							true
						) as HTMLDivElement;
						const width = (event.currentTarget as HTMLDivElement).offsetWidth;
						dragImage.style.position = 'absolute';
						dragImage.style.top = '-9999px';
						dragImage.style.left = '-9999px';
						dragImage.style.width = `${width}px`;
						document.body.appendChild(dragImage);
						event.dataTransfer?.setDragImage(dragImage, event.offsetX, event.offsetY);
						setTimeout(() => {
							document.body.removeChild(dragImage);
						}, 0);
						onDragStart(event, JSON.stringify(node.node_builder()));
					}}
					onclick={(event: MouseEvent) => addNodeToFlow(event, node.node_builder())}
					onkeydown={(event: KeyboardEvent) => {
						if (event.key === 'Enter') {
							addNodeToFlow(event, node.node_builder());
						}
					}}
					draggable={mode === 'drag-and-drop'}
					style="border-color: {node.color ?? 'var(--border-medium)'}; cursor: {mode === 'drag-and-drop' ? 'grab' : 'pointer'};"
				>
					<div class="flex items-center gap-2 min-w-0 text-sm font-medium text-text-primary">
                        <!-- {node.icon} ici plus tard -->
                        <span
                            class="inline-block h-2 w-2 flex-shrink-0 rounded-full"
                            style="background-color: {node.color ?? 'var(--border-medium)'};"
                        ></span>
                        <span class="truncate">{node.title}</span>
                    </div>
                    <div class="min-w-0 truncate text-xs text-text-muted">
                        {node.description}
                    </div>
				</div>
			{:else}
				<div class="flex h-full w-full flex-col items-center justify-center py-8 text-center">
					<p class="text-sm text-text-secondary">No nodes found</p>
					<p class="mt-1 text-xs text-text-muted">Try a different search term</p>
				</div>
			{/each}
		</div>
	</div>
</div>
