import type { Edge, Node } from '@xyflow/svelte';
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
export declare function autoLayoutNodes(nodes: Node[], edges: Edge[]): Map<string, {
    position?: {
        x: number;
        y: number;
    };
    width?: number;
    height?: number;
}>;
