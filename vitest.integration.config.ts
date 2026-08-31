import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  test: {
    include: ["src/test/integration/**/*.test.ts"],
    environment: "node",
    globals: false,
    setupFiles: ["./src/test/setup.ts"],
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@web": resolve(__dirname, "src/web"),
      "@api": resolve(__dirname, "src/api"),
      "@db": resolve(__dirname, "src/db"),
      "@shared": resolve(__dirname, "src/shared"),
      "@lib": resolve(__dirname, "src/lib"),
      "@config": resolve(__dirname, "src/config"),
      "@infra": resolve(__dirname, "src/infra"),
    },
  },
});