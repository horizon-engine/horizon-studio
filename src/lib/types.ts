type PrimitiveType = 'int' | 'float' | 'string' | 'bool';
export type Type = PrimitiveType | { arrayOf: Type };

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

// none represents a handle that doesn't accept any type of value, and that is only used for flow control
// any represents a handle that accepts any type of value, except for 'none'
// or allows for a type union (the handle accepts values of any type in the union)
// arrayOf is for a handle that accepts an array of values of a specific type
export type HandleType = 'none' | 'int' | 'float' | 'string' | 'bool' | 'any' | { arrayOf: HandleType } | { or: HandleType[] };
