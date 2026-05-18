<script lang="ts">
    import {
        Background,
        MiniMap,
        SvelteFlow,
        SvelteFlowProvider,
        type Node,
        type Edge,
        type Rect,
        useUpdateNodeInternals
    } from '@xyflow/svelte';
    import { nodeTypes } from '$lib/node_types';
    import { mode } from 'mode-watcher';
    import { useDnD } from '$lib/providers/DnDProvider.svelte';
    import { nanoid } from 'nanoid';
    import { handleValidTypes, store } from '$lib/state.svelte';
    import { getNodeGlobalPosition, sortNodes } from '$lib/node_utils';
    import { setContext } from 'svelte';
    import EditorContent from './EditorContent.svelte';

    setContext('editor-store', store);

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

    const dndData = useDnD();

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

        let newNode = {
            ...node_data,
            id: nanoid(),
            position: { x: event.clientX - 40, y: event.clientY - 30 }
        } satisfies Node;

        nodes = [...nodes, newNode];
        dndData.current = null;
        updateNodesHierarchy();
    };

    const ondelete = ({ nodes: nodesToDelete }: { nodes: Node[] }) => {
        const nodeIds = new Set(nodesToDelete.map((node) => node.id));
        for (const key of handleValidTypes.keys()) {
            if (nodeIds.has(key)) {
                handleValidTypes.delete(key);
            }
        }
    };
</script>

<SvelteFlowProvider>
<div class="h-full w-full">
    <SvelteFlow
        colorMode={mode.current}
        class="h-full w-full"
        style="background-color: var(--new-color-primary-bg);"
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
        {ondragover}
        {ondrop}
        {ondelete}
        onnodedragstop={updateNodesHierarchy}
    >
        <Background bgColor="transparent" />
        <MiniMap />
        <EditorContent {nodes} {edges} />
    </SvelteFlow>
</div>
</SvelteFlowProvider>
