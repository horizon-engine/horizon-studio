import { handleValidTypes } from "./state.svelte";
import type { HandleType, Type } from "./types";

export function defaultValue(type: Type): number | boolean | string | never[] {
    switch (type) {
        case 'int':
            return 0;
        case 'float':
            return 0.0;
        case 'string':
            return '';
        case 'bool':
            return false;
        default:
            return [];
    }
}

export function getTypeDisplay(type: Type): string {
    if (typeof type === 'string') return type;
    return `array<${getTypeDisplay(type.arrayOf)}>`;
}

export function coerce_types(type0: HandleType | null, type1: HandleType | null): HandleType | null {
    if (type0 === null || type1 === null) return null;
    if (type0 === 'any') return type1 === 'none' ? null : type1;
    if (type1 === 'any') return type0 === 'none' ? null : type0;
    if (JSON.stringify(type0) === JSON.stringify(type1)) return type0;

    if (
        typeof type0 === 'object' &&
        'arrayOf' in type0 &&
        typeof type1 === 'object' &&
        'arrayOf' in type1
    ) {
        const innerType = coerce_types(type0.arrayOf, type1.arrayOf);
        return innerType ? { arrayOf: innerType } : null;
    }

    const types0 = typeof type0 === 'object' && 'or' in type0 ? type0.or : [type0];
    const types1 = typeof type1 === 'object' && 'or' in type1 ? type1.or : [type1];

    if (types0.length <= 1 && types1.length <= 1) return null;

    let results: HandleType[] = [];
    for (const t0 of types0) {
        for (const t1 of types1) {
            const result = coerce_types(t0, t1);
            if (result !== null) results.push(result);
        }
    }

    // Simplification pass: remove redundant types
    results = results.filter((type, i) => {
        return !results.some((other, j) => {
            if (i === j) return false;
            const coerced = coerce_types(type, other);
            return coerced !== null && JSON.stringify(coerced) === JSON.stringify(other);
        });
    });

    return results.length === 0 ? null : results.length === 1 ? results[0] : { or: results };
}

export function getTypeColors(type: HandleType | null): string[] {
    switch (type) {
        case 'any':
            return ['float', 'string', 'bool', 'int'].map(t => getTypeColors(t as HandleType)).flat() as string[];
        case 'int':
            return ['oklch(74.6% 0.16 232.661)'];
        case 'float':
            return ['oklch(70.4% 0.191 22.216)'];
        case 'string':
            return ['oklch(79.2% 0.209 151.711)'];
        case 'bool':
            return ['oklch(82.8% 0.189 84.429)'];
    }
    if (type && typeof type === 'object') {
        if ('arrayOf' in type) {
            return getTypeColors(type.arrayOf).map(color => `color-mix(in oklch, ${color}, black 20%)`);
        }
        if ('or' in type) {
            return type.or.map(getTypeColors).flat();
        }
    }
    return ['oklch(37.2% 0.044 257.287)'];
}

export function getConnectionValidTypes(connection: {
    source: string;
    target: string;
    sourceHandle?: string | null;
    targetHandle?: string | null;
}): HandleType | null {
    const sourceType: HandleType | null =
        handleValidTypes.get(connection.source)?.get(connection.sourceHandle ?? '') ?? null;
    const targetType: HandleType | null =
        handleValidTypes.get(connection.target)?.get(connection.targetHandle ?? '') ?? null;
    return coerce_types(sourceType, targetType);
}
