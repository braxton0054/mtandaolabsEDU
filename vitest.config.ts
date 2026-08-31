import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  test: {
    include: ["src/test/unit/**/*.test.ts", "src/test/unit/**/*.test.tsx"],
    environment: "node",
    globals: false,
    setupFiles: ["./src/test/setup.ts"],
    coverage: { reporter: ["text", "html"] },
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