import { type Node, type Edge } from '@xyflow/svelte';
type $$ComponentProps = {
    nodes?: Node[];
    edges?: Edge[];
};
declare const Editor: import("svelte").Component<$$ComponentProps, {}, "nodes" | "edges">;
type Editor = ReturnType<typeof Editor>;
export default Editor;
