import dagre from '@dagrejs/dagre';
/**
 * Automatically arranges nodes in a hierarchical layout using the Dagre graph layout algorithm.
 * Group Nodes are handled as subgraphs.
 *
 * @param nodes - Array of nodes to be laid out
 * @param edges - Array of edges defining connections between nodes
 * @returns Map of node IDs to their updated layout properties (position, width, height)
 *
 * @remarks
 * nodes isn't modified in place, a new Map of the changes to be applied is returned.
 */
export function autoLayoutNodes(nodes, edges) {
    // Map to batch update nodes
    const node_updates = new Map();
    // post-it nodes are not included in the autolayout.
    // we manually keep them in the same relative position to
    // their closest node
    const postit_nodes_positions = nodes
        .filter((node) => node.type === 'postit_node')
        .map((postit_node) => {
        let closest_node_id = postit_node.parentId;
        let offset_x = postit_node.position.x;
        let offset_y = postit_node.position.y;
        for (const node of nodes) {
            // only consider non-postit nodes that are in the same subgraph
            if (node.type === 'postit_node' || node.parentId !== postit_node.parentId)
                continue;
            if (!closest_node_id ||
                (postit_node.position.x - node.position.x) ** 2 +
                    (postit_node.position.y - node.position.y) ** 2 <
                    offset_x ** 2 + offset_y ** 2) {
                closest_node_id = node.id;
                offset_x = postit_node.position.x - node.position.x;
                offset_y = postit_node.position.y - node.position.y;
            }
        }
        // clamp the offset if it's too far away from the node
        return {
            node_id: postit_node.id,
            closest_node_id: closest_node_id,
            offset_x: offset_x < -250 ? -250 : offset_x > 250 ? 250 : offset_x,
            offset_y: offset_y < -250 ? -250 : offset_y > 250 ? 250 : offset_y
        };
    });
    // subgraphs are either the root graph or any group node
    const subgraphs = new Set(['']);
    for (const node of nodes) {
        if (node.type === 'group_node') {
            subgraphs.add(node.id);
        }
    }
    // we reverse the array to make sure that nested group nodes
    // are autolayouted and resized from the innermost to the outermost
    for (const subgraph of Array.from(subgraphs).reverse()) {
        const dagreGraph = new dagre.graphlib.Graph();
        dagreGraph.setDefaultEdgeLabel(() => ({}));
        dagreGraph.setGraph({ rankdir: 'LR' });
        const subgraph_nodes = nodes.filter((node) => (node.parentId ?? '') === subgraph && node.type !== 'postit_node');
        subgraph_nodes.forEach((node) => {
            dagreGraph.setNode(node.id, {
                // if we can't measure the node, we assume a 400x400 box
                // this should never happen.
                width: (node.measured?.width ?? 400) + 50,
                height: (node.measured?.height ?? 400) + 50
            });
        });
        // set dagre edges
        // if a node is connected to a node inside a group node,
        // we set the edge to the group node instead in the dagre layout
        // this ensures the group node is positioned correctly
        edges.forEach((edge) => {
            const dagreNode = (id) => {
                return dagreGraph.hasNode(id) ? id : undefined;
            };
            const source = dagreNode(edge.source) ??
                dagreNode(nodes.find((node) => node.id === edge.source)?.parentId ?? '');
            const target = dagreNode(edge.target) ??
                dagreNode(nodes.find((node) => node.id === edge.target)?.parentId ?? '');
            if (source !== undefined && target !== undefined) {
                dagreGraph.setEdge(source, target);
            }
        });
        dagre.layout(dagreGraph);
        for (const node of subgraph_nodes) {
            const nodeWithPosition = dagreGraph.node(node.id);
            node_updates.set(node.id, {
                ...(node_updates.get(node.id) ?? {}),
                position: {
                    x: nodeWithPosition.x,
                    y: nodeWithPosition.y
                }
            });
        }
        // calculate bounding box of child nodes if in a group node
        if (subgraph === '')
            continue;
        // Find the bounding box of all child nodes
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        for (const node of subgraph_nodes) {
            const node_update = node_updates.get(node.id);
            const position = node_update.position;
            const size = {
                width: node_update?.width ?? node.measured?.width ?? 400,
                height: node_update?.height ?? node.measured?.height ?? 400
            };
            minX = Math.min(minX, position.x);
            maxX = Math.max(maxX, position.x + size.width);
            minY = Math.min(minY, position.y);
            maxY = Math.max(maxY, position.y + size.height);
        }
        // resize the group node to fit its children plus some padding
        const parentWidth = Math.max(maxX - minX + 20, 256);
        const parentHeight = Math.max(maxY - minY + 48, 128);
        node_updates.set(subgraph, {
            width: parentWidth,
            height: parentHeight
        });
        // move nodes inside a group node (10 and 38 are padding values that look good)
        for (const node of subgraph_nodes) {
            const node_update = node_updates.get(node.id);
            node_updates.set(node.id, {
                ...node_update,
                position: {
                    x: node_update.position.x - minX + 10,
                    y: node_update.position.y - minY + 38
                }
            });
        }
    }
    // move postit nodes
    nodes
        .filter((node) => node.type === 'postit_node')
        .forEach((postit_node) => {
        const position = postit_nodes_positions.find((postit_node_position) => postit_node_position.node_id === postit_node.id);
        const closest_node_position = node_updates.get(position.closest_node_id).position;
        node_updates.set(postit_node.id, {
            position: {
                x: closest_node_position.x + position.offset_x,
                y: closest_node_position.y + position.offset_y
            }
        });
    });
    return node_updates;
}
