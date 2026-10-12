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
    // Claude Code 的 worktree 是另一份完整检出，从主检出里 lint 它只会刷出一堆重复报错。
    ".claude/worktrees/**",
    // Claude Design 导出的设计稿原样入库，只作参照，不是站点代码。
    "design/**",
  ]),
]);

export default eslintConfig;
