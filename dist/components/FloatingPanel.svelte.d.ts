import { type Snippet } from 'svelte';
interface Props {
    id: string;
    title: string;
    open: boolean;
    children?: Snippet;
    position: {
        x: number;
        y: number;
    };
    class?: string;
    [key: string]: unknown;
}
declare const FloatingPanel: import("svelte").Component<Props, {}, "open">;
type FloatingPanel = ReturnType<typeof FloatingPanel>;
export default FloatingPanel;
