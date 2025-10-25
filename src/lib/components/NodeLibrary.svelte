<script lang="ts">
	import type { Variable } from '$lib/types';
	import { useDnD } from '$lib/providers/DnDProvider.svelte';
	import Fuse from 'fuse.js';
	import { useSvelteFlow, type Node } from '@xyflow/svelte';
	import { nanoid } from 'nanoid';
	import TextInput from './TextInput.svelte';
	import { getNodeSearchTerms, getNodeShortDescription, getNodeTitle } from '$lib/node_metadata';
	import { getTypeDisplay } from '$lib/type_utils';

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
			console.log('attempting focus');
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

	const nodes: string[] = [
		'value_node',
		'set_variable_node',
		'if_node',
		'while_node',
		'not_node',
		'add_node',
		'subtract_node',
		'multiply_node',
		'divide_node',
		'modulo_node',
		'equality_node',
		'inequality_node',
		'and_node',
		'or_node',
		'less_than_node',
		'less_than_or_equal_node',
		'greater_than_node',
		'greater_than_or_equal_node',
		'group_node',
		'postit_node'
	];

	let nodes_to_filter = $derived(
		nodes
			.map((node) => ({
				node_builder: get_node_builder(node),
				title: getNodeTitle(node),
				description: getNodeShortDescription(node),
				search_terms: getNodeSearchTerms(node),
				type: node
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
					style="cursor: {mode === 'drag-and-drop' ? 'grab' : 'pointer'};"
				>
					<div class="min-w-0 truncate text-sm font-medium text-text-primary">
						{node.title}
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
