import { writable } from "svelte/store";

export const currentUnitId = writable(null);
export const currentUnitName = writable("");