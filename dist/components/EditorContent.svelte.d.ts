import { type Node, type Edge } from '@xyflow/svelte';
type $$ComponentProps = {
    nodes: Node[];
    edges: Edge[];
};
declare const EditorContent: import("svelte").Component<$$ComponentProps, {
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
}, "nodes" | "edges">;
type EditorContent = ReturnType<typeof EditorContent>;
export default EditorContent;
