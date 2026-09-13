import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // 上游 vercel-plugin 的克隆，不入库也不归我们管（见 .agents/README.md）。
    // 不排掉的话 pnpm lint 会刷出两百多条别人代码里的报错，自己的问题反而看不见。
    ".agents/vendor/**",
  ]),
]);

export default eslintConfig;
