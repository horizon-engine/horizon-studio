import { type Node, type Edge } from '@xyflow/svelte';
type $$ComponentProps = {
    nodes?: Node[];
    edges?: Edge[];
};
declare const Editor: import("svelte").Component<$$ComponentProps, {
    compileToJson: () => {
        readonly ok: true;
        readonly data: {
            variables: {
                [x: string]: any;
            }[];
            body: any;
        };
        readonly error?: undefined;
    } | {
        readonly ok: false;
        readonly error: {
            readonly message: any;
            readonly cause: any;
        };
        readonly data?: undefined;
    };
    loadFromJson: (payload: string | unknown) => {
        readonly ok: true;
        readonly error?: undefined;
    } | {
        readonly ok: false;
        readonly error: {
            readonly message: any;
            readonly cause: any;
        };
    };
}, "nodes" | "edges">;
type Editor = ReturnType<typeof Editor>;
export default Editor;
