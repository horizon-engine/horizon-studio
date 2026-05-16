export declare const useDnD: () => {
    current: string | null;
};
import { type Snippet } from 'svelte';
type $$ComponentProps = {
    children: Snippet;
};
declare const DnDProvider: import("svelte").Component<$$ComponentProps, {}, "">;
type DnDProvider = ReturnType<typeof DnDProvider>;
export default DnDProvider;
