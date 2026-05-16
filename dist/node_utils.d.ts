import type { Edge, Node } from '@xyflow/svelte';
/**
 * Returns the global position of a node in the flow
 * instead of its position relative to its parent
 */
export declare function getNodeGlobalPosition(nodes: Node[], node: Node | undefined): {
    x: number;
    y: number;
};
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
export declare function enableAttachedNodes(nodes: Node[], edges: Edge[]): Node[];
/**
 * Reorders nodes array so that children appear before their parents.
 * This is required by Svelte Flow for parent-child relationships.
 * Handles deep hierarchies and detects circular references.
 *
 * @param nodes - Array of nodes to reorder
 * @returns Reordered array with children before parents
 * @throws Error if circular parent references are detected
 */
export declare function sortNodes<T extends Node>(nodes: T[]): T[];
