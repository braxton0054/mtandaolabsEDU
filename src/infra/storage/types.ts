import type { Readable } from "node:stream";

/**
 * Phase 1 storage abstraction.
 *
 * Implementations: LocalStorage (VPS filesystem, used in dev/staging).
 * Future: S3Storage, B2Storage — must implement the same interface so
 * application code never has to change.
 */

export interface StorageObject {
  key: string;
  size: number;
  contentType?: string;
  lastModified?: Date;
}

export interface StoragePutOptions {
  contentType?: string;
  cacheControl?: string;
  metadata?: Record<string, string>;
}

export interface Storage {
  put(key: string, data: Buffer | Uint8Array | Readable | string, opts?: StoragePutOptions): Promise<StorageObject>;
  get(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  size(key: string): Promise<number>;
  list(prefix?: string): Promise<StorageObject[]>;
  url(key: string, expiresInSec?: number): Promise<string>;
}