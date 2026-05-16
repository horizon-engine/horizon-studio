import type { HandleType, Type } from "./types";
export declare function defaultValue(type: Type): number | boolean | string | never[];
export declare function getTypeDisplay(type: Type): string;
export declare function coerce_types(type0: HandleType | null, type1: HandleType | null): HandleType | null;
export declare function getTypeColors(type: HandleType | null): string[];
export declare function getConnectionValidTypes(connection: {
    source: string;
    target: string;
    sourceHandle?: string | null;
    targetHandle?: string | null;
}): HandleType | null;
