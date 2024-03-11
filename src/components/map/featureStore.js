import { writable } from "svelte/store";

export const toRemove = writable(null);
export const toAdd = writable(null);
export const toHideTooltip = writable(null);
export const toShowTooltip = writable(null);