import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';
type $$ComponentProps = {
    children?: Snippet;
    variant?: 'default' | 'primary' | 'secondary' | 'menu' | 'icon';
    class?: string;
    selected?: boolean;
} & HTMLButtonAttributes;
declare const Button: import("svelte").Component<$$ComponentProps, {}, "">;
type Button = ReturnType<typeof Button>;
export default Button;
