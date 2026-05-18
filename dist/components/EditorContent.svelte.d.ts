import { type Node, type Edge } from '@xyflow/svelte';
type $$ComponentProps = {
    nodes: Node[];
    edges: Edge[];
};
declare const EditorContent: import("svelte").Component<$$ComponentProps, {}, "nodes" | "edges">;
type EditorContent = ReturnType<typeof EditorContent>;
export default EditorContent;
