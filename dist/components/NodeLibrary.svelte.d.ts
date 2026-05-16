import type { Variable } from '../types';
import { type Node } from '@xyflow/svelte';
type $$ComponentProps = {
    variables: Variable[];
    mode?: 'drag-and-drop' | 'click-to-add';
    include_variables?: boolean;
    addNode: (node: Node) => void;
};
declare const NodeLibrary: import("svelte").Component<$$ComponentProps, {
    updateSearch: (search: string) => void;
    focusSearch: () => void;
}, "">;
type NodeLibrary = ReturnType<typeof NodeLibrary>;
export default NodeLibrary;
