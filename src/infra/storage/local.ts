import { promises as fs, createWriteStream } from "node:fs";
import { dirname, join, normalize, relative } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { env } from "@config/index";
import { NotFoundError, BadRequestError } from "@api/errors/types";
import type { Storage, StorageObject, StoragePutOptions } from "./types";

/**
 * VPS-local filesystem storage.
 * Root is configured via STORAGE_LOCAL_ROOT; keys are sanitized to prevent path traversal.
 */
export class LocalStorage implements Storage {
  private readonly root: string;

  constructor(root: string) {
    this.root = normalize(root);
  }

  private resolve(key: string): string {
    const safe = normalize(key).replace(/^([/\\])+/, "");
    if (safe.includes("..")) throw new BadRequestError("Invalid storage key");
    const full = join(this.root, safe);
    const rel = relative(this.root, full);
    if (rel.startsWith("..") || rel === "..") throw new BadRequestError("Invalid storage key");
    return full;
  }

  async put(key: string, data: Buffer | Uint8Array | Readable | string, opts: StoragePutOptions = {}): Promise<StorageObject> {
    const path = this.resolve(key);
    await fs.mkdir(dirname(path), { recursive: true });
    const ws = createWriteStream(path);
    if (typeof data === "string" || data instanceof Buffer || data instanceof Uint8Array) {
      await pipeline(Readable.from(data instanceof Uint8Array && !(data instanceof Buffer) ? Buffer.from(data) : data), ws);
    } else {
      await pipeline(data, ws);
    }
    const stat = await fs.stat(path);
    return { key, size: stat.size, contentType: opts.contentType, lastModified: stat.mtime };
  }

  async get(key: string): Promise<Buffer> {
    const path = this.resolve(key);
    try {
      return await fs.readFile(path);
    } catch {
      throw new NotFoundError(`Storage object not found: ${key}`);
    }
  }

  async delete(key: string): Promise<void> {
    await fs.rm(this.resolve(key), { force: true });
  }

  async exists(key: string): Promise<boolean> {
    try {
      await fs.access(this.resolve(key));
      return true;
    } catch {
      return false;
    }
  }

  async size(key: string): Promise<number> {
    const stat = await fs.stat(this.resolve(key));
    return stat.size;
  }

  async list(prefix = ""): Promise<StorageObject[]> {
    const base = this.resolve(prefix);
    const out: StorageObject[] = [];
    const walk = async (dir: string): Promise<void> => {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) await walk(full);
        else {
          const stat = await fs.stat(full);
          out.push({
            key: relative(this.root, full).replace(/\\/g, "/"),
            size: stat.size,
            lastModified: stat.mtime,
          });
        }
      }
    };
    try {
      await walk(base);
    } catch {
      return [];
    }
    return out;
  }

  async url(key: string, _expiresInSec?: number): Promise<string> {
    return `/api/storage/${encodeURIComponent(key)}`;
  }
}

let cached: Storage | null = null;

export function getStorage(): Storage {
  if (cached) return cached;
  switch (env.STORAGE_DRIVER) {
    case "local":
      cached = new LocalStorage(env.STORAGE_LOCAL_ROOT);
      break;
    default:
      throw new Error(`Unsupported storage driver: ${env.STORAGE_DRIVER}`);
  }
  return cached;
}