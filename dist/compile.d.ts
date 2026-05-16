import type { Edge, Node } from "@xyflow/svelte";
import type { Variable } from "./types";
export declare function compile(variables: Variable[], nodes: Node[], edges: Edge[]): {
    variables: {
        [x: string]: any;
    }[];
    body: any;
};
