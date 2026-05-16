import type { HandleType } from '../types';
import { Handle, type HandleProps, type IsValidConnection } from '@xyflow/svelte';
type CustomHandleProps = Omit<HandleProps, 'position' | 'id' | 'isValidConnection'> & {
    node_id: string;
    id: string;
    isValidConnection: IsValidConnection;
    y_position_percents?: number;
    valid_types: HandleType | null;
};
declare const Handle: import("svelte").Component<CustomHandleProps, {}, "">;
type Handle = ReturnType<typeof Handle>;
export default Handle;
