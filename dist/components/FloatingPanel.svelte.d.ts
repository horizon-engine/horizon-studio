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
    [key: string]: any;
}
declare const FloatingPanel: import("svelte").Component<Props, {}, "open">;
type FloatingPanel = ReturnType<typeof FloatingPanel>;
export default FloatingPanel;
