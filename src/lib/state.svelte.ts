import type { HandleType } from "./types";

export const handleValidTypes = new Map<string, Map<string, HandleType | null>>();

export let store = $state({
    clearErrors: false,
    updateFlow: false
});
