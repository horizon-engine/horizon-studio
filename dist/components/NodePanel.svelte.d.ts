import type { Variable } from '../types';
import type { Node } from '@xyflow/svelte';
type $$ComponentProps = {
    variables: Variable[];
    addNode: (node: Node) => void;
};
declare const NodePanel: import("svelte").Component<$$ComponentProps, {}, "">;
type NodePanel = ReturnType<typeof NodePanel>;
export default NodePanel;
