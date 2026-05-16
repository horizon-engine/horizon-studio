/**
 * Returns the global position of a node in the flow
 * instead of its position relative to its parent
 */
export function getNodeGlobalPosition(nodes, node) {
    if (!node) {
        return { x: 0, y: 0 };
    }
    const parent_global_position = getNodeGlobalPosition(nodes, nodes.find((n) => n.id === node.parentId));
    return {
        x: node.position.x + parent_global_position.x,
        y: node.position.y + parent_global_position.y
    };
}
/**
 * Enables nodes that are connected to the flow's start node and disables all others.
 * Recursively traverses the node graph from the start node through edges to mark
 * connected nodes as enabled.
 *
 * @param nodes - Array of nodes in the flow graph
 * @param edges - Array of edges connecting the nodes
 * @returns A new array of nodes with the `enabled` property updated based on connectivity to the start node
 *
 * @remarks
 * nodes isn't modified in place, a new array of nodes is returned.
 */
export function enableAttachedNodes(nodes, edges) {
    const new_nodes = nodes.map((node) => {
        if (node.type === 'group_node' || node.type === 'postit_node' || node.type === 'start_node') {
            return node;
        }
        return {
            ...node,
            data: {
                ...node.data,
                enabled: false
            }
        };
    });
    function enable_attached_nodes(node) {
        let touching_nodes = new Set();
        for (const edge of edges) {
            if (edge.source === node && edge.target !== node) {
                touching_nodes.add(edge.target);
            }
            if (edge.target === node && edge.source !== node) {
                touching_nodes.add(edge.source);
            }
        }
        for (const touching_node of touching_nodes) {
            let node = new_nodes.find((node) => node.id === touching_node);
            if (node && !node.data.enabled) {
                node.data.enabled = true;
                enable_attached_nodes(node.id);
            }
        }
    }
    enable_attached_nodes('start_node');
    return new_nodes;
}
/**
 * Reorders nodes array so that children appear before their parents.
 * This is required by Svelte Flow for parent-child relationships.
 * Handles deep hierarchies and detects circular references.
 *
 * @param nodes - Array of nodes to reorder
 * @returns Reordered array with children before parents
 * @throws Error if circular parent references are detected
 */
export function sortNodes(nodes) {
    // Build parent-to-children map and count dependencies
    const nodeMap = new Map();
    const children = new Map();
    const parentCount = new Map();
    // Initialize structures
    nodes.forEach(node => {
        nodeMap.set(node.id, node);
        parentCount.set(node.id, node.parentId ? 1 : 0);
        if (node.parentId) {
            if (!children.has(node.parentId)) {
                children.set(node.parentId, []);
            }
            children.get(node.parentId).push(node.id);
        }
    });
    // Find all nodes with no parents (starting points)
    const queue = [];
    nodes.forEach(node => {
        if (!node.parentId) {
            queue.push(node.id);
        }
    });
    const sorted = [];
    while (queue.length > 0) {
        const nodeId = queue.shift();
        const node = nodeMap.get(nodeId);
        if (node) {
            sorted.push(node);
        }
        // Process children (they can now be added since parent is processed)
        const childIds = children.get(nodeId) || [];
        childIds.forEach(childId => {
            const count = parentCount.get(childId) - 1;
            parentCount.set(childId, count);
            if (count === 0) {
                queue.push(childId);
            }
        });
    }
    return sorted;
}
