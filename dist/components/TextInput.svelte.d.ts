import type { HTMLInputAttributes } from 'svelte/elements';
type $$ComponentProps = Omit<HTMLInputAttributes, 'type' | 'input' | 'value' | 'class' | 'autocomplete'> & {
    input?: HTMLInputElement;
    value: string;
    className?: string;
    label?: string;
    showClearButton?: boolean;
};
declare const TextInput: import("svelte").Component<$$ComponentProps, {}, "value" | "input">;
type TextInput = ReturnType<typeof TextInput>;
export default TextInput;
