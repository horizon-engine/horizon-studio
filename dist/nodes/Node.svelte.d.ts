import type { HandleBlueprint } from '../types';
import { type Snippet } from 'svelte';
type $$ComponentProps = {
    id: string;
    title: string;
    enabled: boolean;
    error_message: string;
    selected: boolean;
    handles: HandleBlueprint[];
    children: Snippet;
    color?: string;
    text_color?: string;
    icon?: Snippet;
};
declare const Node: import("svelte").Component<$$ComponentProps, {
    updateNodeEdges: () => Promise<void>;
}, "">;
type Node = ReturnType<typeof Node>;
export default Node;
