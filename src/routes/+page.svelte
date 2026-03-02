<script lang="ts">
	import VariableManager from '$lib/components/VariableManager.svelte';
	import type { Variable } from '$lib/types';
	import { nanoid } from 'nanoid';
	import {
		MiniMap,
		Controls,
		Background,
		SvelteFlow,
		type Node,
		type Rect,
		useSvelteFlow,
		ControlButton,
		type Edge,
		useUpdateNodeInternals
	} from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import { useDnD } from '$lib/providers/DnDProvider.svelte';
	import { alertStore } from '$lib/stores/alertStore.svelte.js';
	import NodeLibrary from '$lib/components/NodeLibrary.svelte';
	import { onMount, untrack } from 'svelte';
	import { handleValidTypes, store } from '$lib/state.svelte';
	import { compile } from '$lib/compile';
	import FloatingPanel from '$lib/components/FloatingPanel.svelte';
	import NodePanel from '$lib/components/NodePanel.svelte';
	import { nodeTypes } from '$lib/node_types';
	import Workflow from 'virtual:icons/lucide/workflow';
	import BaselineDelete from 'virtual:icons/ic/baseline-delete';
	import { enableAttachedNodes, getNodeGlobalPosition, sortNodes } from '$lib/node_utils';
	import { autoLayoutNodes } from '$lib/auto_layout';
	import { mode, toggleMode } from 'mode-watcher';
	import { backIn, linear } from 'svelte/easing';
	const { screenToFlowPosition, deleteElements, fitView } = useSvelteFlow();
	const updateNodeInternals = useUpdateNodeInternals();

	let showPanel = $state(false);
	let panelPosition = $state({ x: 0, y: 0 });
	let showVariablePanel = $state(false);
	let variablePanelPosition = $state({ x: 0, y: 0 });
	let variables = $state<Variable[]>([]);

	let nodes = $state.raw<Node[]>([
		{
			id: 'start_node',
			type: 'start_node',
			position: { x: 76, y: 62 },
			data: { error_message: '' },
			deletable: false
		}
	]);
	let edges = $state.raw<Edge[]>([]);

	let selected_nodes = $derived(
		nodes.filter((node) => node.selected && node.type !== 'start_node')
	);
	let selected_edges = $derived(edges.filter((edge) => edge.selected));
	let delete_button_disabled = $derived(selected_nodes.length === 0 && selected_edges.length === 0);

	let nodeLibrary: NodeLibrary;

	onMount(() => {
		let mouse_position = { x: 0, y: 0 };

		function handleMouseMove(event: MouseEvent | TouchEvent | DragEvent) {
			mouse_position = {
				x: event instanceof MouseEvent ? event.clientX : event.touches[0].clientX,
				y: event instanceof MouseEvent ? event.clientY : event.touches[0].clientY
			};
		}
		function handleKeyDown(event: KeyboardEvent) {
			if (showPanel || showVariablePanel) {
				if (event.key === 'Escape') {
					showPanel = false;
					showVariablePanel = false;
				}
				return;
			}

			if (
				(event.target instanceof HTMLElement &&
					(event.target?.tagName === 'INPUT' ||
						event.target?.tagName === 'TEXTAREA' ||
						event.target?.isContentEditable)) ||
				event.key?.length !== 1 ||
				event.altKey ||
				event.ctrlKey ||
				event.metaKey ||
				event.shiftKey
			) {
				return;
			}

			event.preventDefault();

			panelPosition = {
				x: Math.min(
					window.innerWidth - 150,
					Math.max(window.innerWidth * 0.25 + 50, mouse_position.x)
				),
				y: Math.min(window.innerHeight - 280, Math.max(160, mouse_position.y))
			};
			nodes = nodes.map((node) => ({ ...node, selected: false }));
			showPanel = true;
			nodeLibrary.updateSearch(event.key === ' ' ? '' : event.key);

			nodeLibrary.focusSearch();
		}

		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('touchstart', handleMouseMove);
		window.addEventListener('drop', handleMouseMove);
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('touchstart', handleMouseMove);
			window.removeEventListener('keydown', handleKeyDown);
		};
	});

	// when a node is inside a group node, set it as a child of the group node
	function updateNodesHierarchy() {
		setTimeout(() => {
			const groupNodes: {
				node: Node;
				bounds: Rect;
			}[] = nodes
				.filter((node) => node.type === 'group_node')
				.map((node) => {
					const node_position = getNodeGlobalPosition(nodes, node);
					return {
						node,
						bounds: {
							x: node_position.x,
							y: node_position.y,
							// default bounds of a group node is 256x128 (this should never happen)
							width: node.measured?.width ?? 256,
							height: node.measured?.height ?? 128
						}
					};
				});

			function isNodeInBounds(node: Node, bounds: Rect): boolean {
				if (!node.measured?.width || !node.measured?.height) {
					return false;
				}

				const node_position = getNodeGlobalPosition(nodes, node);

				const node_bounds = {
					x: node_position.x,
					y: node_position.y,
					width: node.measured.width,
					height: node.measured.height
				};

				// we use strict > and < comparaisons instead of >= and <=to ensure
				// that nodes can't be in group nodes of the exact same size as themselves
				// this avoids confusion when two group nodes of the same size are superimposed
				return (
					bounds.x < node_bounds.x &&
					bounds.y < node_bounds.y &&
					bounds.x + bounds.width > node_bounds.x + node_bounds.width &&
					bounds.y + bounds.height > node_bounds.y + node_bounds.height
				);
			}

			// get the group node that should be the parent of the given node by analysing the flow
			// if multiple group nodes have the node in their bounds,
			// the most front one is returned (this handles nested group nodes)
			// if no group node has the node in its bounds, undefined is returned
			function findParentGroupNode(node: Node): Node | undefined {
				if (node.type === 'start_node') return undefined;
				for (let i = groupNodes.length - 1; i >= 0; i--) {
					const groupNode = groupNodes[i];
					if (groupNode.node.id !== node.id && isNodeInBounds(node, groupNode.bounds)) {
						return groupNode.node;
					}
				}
				return undefined;
			}

			function setParent(node: Node, parent: Node | undefined): Node {
				if (node.parentId === parent?.id) {
					return node;
				}

				const globalposition = getNodeGlobalPosition(nodes, node);
				const parentGlobalPosition = getNodeGlobalPosition(nodes, parent);

				return {
					...node,
					parentId: parent?.id,
					position: {
						x: globalposition.x - parentGlobalPosition.x,
						y: globalposition.y - parentGlobalPosition.y
					}
				};
			}

			// we update the entire array to enable svelte to detect changes
			nodes = nodes.map((node) => {
				const parent = findParentGroupNode(node);
				return setParent(node, parent);
			});

			// svelte flow expects all children nodes to appear after their parent node
			nodes = sortNodes(nodes);
		}, 0);
	}

	const dndData = useDnD();

	const ondragover = (event: DragEvent) => {
		event.preventDefault();

		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'move';
		}
	};

	const ondrop = (event: DragEvent) => {
		event.preventDefault();

		if (!dndData.current) {
			return;
		}

		const node_data = JSON.parse(dndData.current);

		const position = screenToFlowPosition({
			x: event.clientX - 40,
			y: event.clientY - 30
		});

		let newNode = {
			...node_data,
			id: nanoid(),
			position
		} satisfies Node;

		nodes = [...nodes, newNode];
		dndData.current = null;
		updateNodesHierarchy();
	};

	function onAddVariable(variable: Variable) {
		variables = [...variables, variable];
		nodes = nodes.map((node) => {
			if (node.type === 'set_variable_node') {
				return {
					...node,
					data: {
						...node.data,
						variables
					}
				};
			}
			return node;
		});
	}

	async function confirmDeleteVariable(name: string) {
		function deleteVariable(name: string) {
			variables = variables.filter((v: Variable) => v.name !== name);

			const nodes_to_remove = nodes
				.filter(
					(node) =>
						node.type === 'variable_node' &&
						(node.data.variable as { type: string; name: string }).name === name
				)
				.map((node) => node.id);

			edges = edges.filter(
				(edge) => !(nodes_to_remove.includes(edge.source) || nodes_to_remove.includes(edge.target))
			);

			nodes = nodes
				.filter((node) => !nodes_to_remove.includes(node.id))
				.map((node) => {
					if (node.type === 'set_variable_node') {
						return {
							...node,
							data: {
								...node.data,
								variables
							}
						};
					}
					return node;
				});
		}

		if (
			!nodes.find(
				(node) =>
					node.type === 'variable_node' &&
					(node.data.variable as { type: string; name: string }).name === name
			)
		) {
			deleteVariable(name);
			return true;
		}

		return await alertStore.show({
			title: 'Confirm deleting variable',
			body: 'Deleting this variable will remove every node that uses it. Do you wish to continue?',
			continueText: 'Continue',
			cancelText: 'Cancel',
			onContinue: () => deleteVariable(name)
		});
	}

	function onReorderVariables(newVariables: Variable[]) {
		variables = variables;
		nodes = nodes.map((node) => {
			if (node.type === 'set_variable_node') {
				return {
					...node,
					data: {
						...node.data,
						variables: newVariables
					}
				};
			}
			return node;
		});
	}

	function ondelete({ nodes }: { nodes: Node[] }) {
		// cleanup handleValidTypes
		const nodeIds = new Set(nodes.map((node) => node.id));
		for (const key of handleValidTypes.keys()) {
			if (nodeIds.has(key)) {
				handleValidTypes.delete(key);
			}
		}
	}

	function autoLayout() {
		const node_updates = autoLayoutNodes(nodes, edges);
		nodes = nodes.map((node) => {
			const node_update = node_updates.get(node.id);
			if (!node_update) return node;
			return {
				...node,
				...node_update
			};
		});
		// update the internal dimensions of the nodes that were resized
		updateNodeInternals(
			Array.from(node_updates)
				.filter(([_, node_update]) => node_update.width || node_update.height)
				.map(([node_id]) => node_id)
		);
		fitView({
			padding: 0.2,
			maxZoom: 1.5
		});
		updateNodesHierarchy();
	}

	$effect(() => {
		nodes = enableAttachedNodes(
			untrack(() => nodes),
			edges
		);
	});

	$effect(() => {
		// update flow if requested (for example, when a group node is resized)
		if (store.updateFlow) {
			store.updateFlow = false;
			updateNodesHierarchy();
		}
	});

	$effect(() => {
		// clear error messages from all nodes
		if (store.clearErrors) {
			store.clearErrors = false;
			nodes = nodes.map((node) => {
				return {
					...node,
					data: {
						...node.data,
						error_message: ''
					}
				};
			});
		}
	});
</script>

<div class="flex h-screen w-screen flex-row bg-background">
	<!-- <div
		class="flex w-1/5 shrink-0 flex-col gap-4 border-r-2 border-border-strong bg-linear-to-br from-background via-primary/5 to-secondary/10 p-4"
	>
		<VariableManager {variables} {onAddVariable} {confirmDeleteVariable} {onReorderVariables} />
		<NodePanel
			{variables}
			addNode={(node: Node) => {
				nodes = [...nodes, node];
				updateNodesHierarchy();
			}}
		/>
	</div> -->

	<SvelteFlow
		colorMode={mode.current}
		class="h-full w-full"
		style="
		     background: linear-gradient(
		 		to bottom right,
		 		var(--color-background),
		 		color-mix(in oklab, var(--color-background) 90%, var(--color-secondary)),
		 		color-mix(in oklab, var(--color-background) 90%, var(--color-primary))
		 	);
		 "
		bind:nodes
		bind:edges
		{nodeTypes}
		proOptions={{ hideAttribution: true }}
		defaultEdgeOptions={{ animated: true }}
		minZoom={0.3}
		maxZoom={4}
		fitViewOptions={{
			padding: 0.2,
			maxZoom: 1.5
		}}
		fitView
		onnodedragstop={updateNodesHierarchy}
		{ondragover}
		{ondrop}
		{ondelete}
	>
		<MiniMap />
		<Controls
			class="bg-accent"
			fitViewOptions={{
				padding: 0.2,
				maxZoom: 1.5,
				duration: 100,
				interpolate: 'smooth'
			}}
			showLock={false}
		>
			<ControlButton title="Auto Layout" onclick={autoLayout}>
				<Workflow />
			</ControlButton>
			<ControlButton
				title="Delete"
				disabled={delete_button_disabled}
				onclick={() => deleteElements({ nodes: selected_nodes, edges: selected_edges })}
			>
				<BaselineDelete />
			</ControlButton>
		</Controls>
		<Background bgColor="transparent" />
	</SvelteFlow>
	<div class="absolute top-0 left-0 m-8 flex flex-row gap-2">
		<!-- button add node -->
		<button
			class="cursor-pointer rounded-xl border border-r-2 border-border-strong bg-linear-to-br p-4"
			onclick={() => {
				panelPosition = {
					x: Math.min(window.innerWidth - 150, Math.max(window.innerWidth * 0.25 + 50, 200)),
					y: Math.min(window.innerHeight - 280, Math.max(160, 200))
				};
				nodes = nodes.map((node) => ({ ...node, selected: false }));
				showPanel = true;
				nodeLibrary.updateSearch('');

				nodeLibrary.focusSearch();
			}}
			title="Add Node (Shortcut: Any key)"
		>
			Add Node
		</button>
		<!-- button add variable -->
		<button
			class="cursor-pointer rounded-xl border border-r-2 border-border-strong bg-linear-to-br p-4"
			onclick={() => {
				variablePanelPosition = {
					x: Math.min(window.innerWidth - 150, Math.max(window.innerWidth * 0.25 + 50, 220)),
					y: Math.min(window.innerHeight - 280, Math.max(160, 200))
				};
				showPanel = false;
				showVariablePanel = true;
			}}
			title="Add Variable"
		>
			Add Variable
		</button>
	</div>
	<div class="absolute top-0 right-0 m-8 flex gap-2">
		<button
			class="cursor-pointer rounded-xl border border-border-subtle bg-background p-3 shadow-md transition-colors hover:border-border-medium"
			onclick={toggleMode}
			title={mode.current === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
		>
			{mode.current === 'dark' ? '☀️' : '🌙'}
		</button>
		<button
			class="cursor-pointer rounded-xl border border-border-subtle bg-background p-3 text-text-primary shadow-md transition-colors hover:border-border-medium"
			onclick={() => {
				try {
					alert(JSON.stringify(compile(variables, nodes, edges)));
					store.clearErrors = true;
				} catch (e: any) {
					nodes = nodes.map((node) => {
						return {
							...node,
							data: {
								...node.data,
								error_message: node.id === e.cause ? e.message : ''
							}
						};
					});
					fitView({
						padding: 0.2,
						maxZoom: 1.5,
						duration: 100,
						interpolate: 'smooth',
						nodes: [nodes.find((node) => node.id === e.cause)!]
					});
				}
			}}
		>
			compile to JSON
		</button>
	</div>
</div>
<FloatingPanel
	id="floating-node-library"
	title="Nodes"
	bind:open={showPanel}
	position={panelPosition}
>
	<NodeLibrary
		bind:this={nodeLibrary}
		{variables}
		mode="click-to-add"
		include_variables={true}
		addNode={(node: Node) => {
			showPanel = false;
			nodes = [...nodes, node];
			updateNodesHierarchy();
		}}
	/>
</FloatingPanel>

<FloatingPanel
	id="floating-variable-manager"
	title="Variables"
	bind:open={showVariablePanel}
	position={variablePanelPosition}
>
	<VariableManager {variables} {onAddVariable} {confirmDeleteVariable} {onReorderVariables} />
</FloatingPanel>
