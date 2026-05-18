<script lang="ts">
    import VariableManager from './VariableManager.svelte';
    import type { Variable } from '../types';
    import { nanoid } from 'nanoid';
    import {
        Panel,
        type Node,
        type Rect,
        useSvelteFlow,
        type Edge,
        useUpdateNodeInternals
    } from '@xyflow/svelte';
    import { useDnD } from '../providers/DnDProvider.svelte';
    import { alertStore } from '../stores/alertStore.svelte.js';
    import NodeLibrary from './NodeLibrary.svelte';
    import { onMount, untrack, getContext } from 'svelte';
    import { compile } from '../compile';

    interface StoreContext {
        clearErrors: boolean;
        updateFlow: boolean;
    }

    const store = getContext<StoreContext>('editor-store');
    import FloatingPanel from './FloatingPanel.svelte';
    import Button from './Button.svelte';
    import { nodeTypes } from '../node_types';
    import Workflow from 'virtual:icons/lucide/workflow';
    import BaselineDelete from 'virtual:icons/ic/baseline-delete';
    import { enableAttachedNodes, getNodeGlobalPosition, sortNodes } from '../node_utils';
    import { autoLayoutNodes } from '../auto_layout';
    import { mode, toggleMode } from 'mode-watcher';

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

                return (
                    bounds.x < node_bounds.x &&
                    bounds.y < node_bounds.y &&
                    bounds.x + bounds.width > node_bounds.x + node_bounds.width &&
                    bounds.y + bounds.height > node_bounds.y + node_bounds.height
                );
            }

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

            nodes = nodes.map((node) => {
                const parent = findParentGroupNode(node);
                return setParent(node, parent);
            });

            nodes = sortNodes(nodes);
        }, 0);
    }

    const dndData = useDnD();

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
        if (store.updateFlow) {
            store.updateFlow = false;
            updateNodesHierarchy();
        }
    });

    $effect(() => {
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

<Panel position="top-left" class="nopan nodrag !m-4 flex flex-row gap-2">
        <Button
            variant="menu"
            class="nopan nodrag"
            selected={showPanel}
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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Node
        </Button>
        <Button
            variant="menu"
            class="nopan nodrag"
            selected={showVariablePanel}
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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Variable
        </Button>
</Panel>

<Panel position="top-right" class="nopan nodrag !m-4 flex gap-2">
        <Button
            variant="icon"
            class="nopan nodrag"
            onclick={toggleMode}
            title={mode.current === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            {mode.current === 'dark' ? '☀️' : '🌙'}
        </Button>
        <Button
            variant="icon"
            class="nopan nodrag"
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
        </Button>
</Panel>

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
