import { getStorage } from "./local";
export type { Storage, StorageObject, StoragePutOptions } from "./types";
export { LocalStorage } from "./local";

export function storage() {
  return getStorage();
}