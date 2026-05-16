import type { Type } from '../types';
import TypeSelector from './TypeSelector.svelte';
type $$ComponentProps = {
    type: Type;
    class?: string;
    indent?: boolean;
};
declare const TypeSelector: import("svelte").Component<$$ComponentProps, {}, "type">;
type TypeSelector = ReturnType<typeof TypeSelector>;
export default TypeSelector;
