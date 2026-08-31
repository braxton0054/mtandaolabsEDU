import { describe, it, expect, afterAll } from "vitest";
import { mkdtempSync, rmSync, existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { LocalStorage } from "@infra/storage/local";
import type { StorageObject } from "@infra/storage/types";

describe("LocalStorage", () => {
  const dir = mkdtempSync(join(tmpdir(), "mlabs-storage-"));
  const store = new LocalStorage(dir);

  afterAll(() => rmSync(dir, { recursive: true, force: true }));

  it("put + get + exists + size", async () => {
    await store.put("hello/world.txt", "hello phase 1");
    expect(await store.exists("hello/world.txt")).toBe(true);
    expect((await store.get("hello/world.txt")).toString()).toBe("hello phase 1");
    expect(await store.size("hello/world.txt")).toBeGreaterThan(0);
  });

  it("list returns stored keys", async () => {
    const list = await store.list("hello");
    expect(list.find((o: StorageObject) => o.key === "hello/world.txt")).toBeTruthy();
  });

  it("refuses path-traversal keys", async () => {
    await expect(store.get("../etc/passwd")).rejects.toThrow(/Invalid storage key/);
  });

  it("delete removes the file", async () => {
    await store.put("to-delete.txt", "bye");
    expect(await store.exists("to-delete.txt")).toBe(true);
    await store.delete("to-delete.txt");
    expect(await store.exists("to-delete.txt")).toBe(false);
  });

  it("swappable driver surface — file lives at root/<key>", () => {
    expect(existsSync(join(dir, "hello", "world.txt"))).toBe(true);
    expect(readFileSync(join(dir, "hello", "world.txt"), "utf8")).toBe("hello phase 1");
  });
});