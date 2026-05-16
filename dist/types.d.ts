type PrimitiveType = 'int' | 'float' | 'string' | 'bool';
export type Type = PrimitiveType | {
    arrayOf: Type;
};
export interface Variable {
    name: string;
    type: Type;
}
export interface HandleBlueprint {
    id: string;
    type: "source" | "target";
    y_position_percents?: number;
    valid_types: HandleType | null;
    onconnect?: (valid_types: HandleType | null, node_handle_types: Map<string, HandleType | null>) => void;
}
export type HandleType = 'none' | 'int' | 'float' | 'string' | 'bool' | 'any' | {
    arrayOf: HandleType;
} | {
    or: HandleType[];
};
export {};
