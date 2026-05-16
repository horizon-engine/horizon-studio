import type { Variable } from '../types';
type $$ComponentProps = {
    variables: Variable[];
    onAddVariable: (variable: Variable) => void;
    confirmDeleteVariable: (name: string) => Promise<boolean>;
    onReorderVariables: (variables: Variable[]) => void;
};
declare const VariableManager: import("svelte").Component<$$ComponentProps, {}, "">;
type VariableManager = ReturnType<typeof VariableManager>;
export default VariableManager;
