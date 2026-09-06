#!/usr/bin/env bash
# 把 .agents/vendor/vercel-plugin 更到上游最新，并同步给各个 agent CLI。
# 用法：bash .agents/sync.sh
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VENDOR="$ROOT/.agents/vendor/vercel-plugin"

# 1. 取上游（首次运行会自动克隆）
if [ -d "$VENDOR/.git" ]; then
  git -C "$VENDOR" pull --ff-only
else
  mkdir -p "$ROOT/.agents/vendor"
  git clone --depth 1 https://github.com/vercel/vercel-plugin.git "$VENDOR"
fi
echo "vendor 版本: $(grep -m1 '"version"' "$VENDOR/.claude-plugin/plugin.json")"

# 2. 重建 .agents/skills 软链（新增 / 删除的 skill 都跟上）
mkdir -p "$ROOT/.agents/skills"
find "$ROOT/.agents/skills" -maxdepth 1 -type l -delete
for d in "$VENDOR"/skills/*/; do
  n="$(basename "$d")"
  ln -sfn "../vendor/vercel-plugin/skills/$n" "$ROOT/.agents/skills/$n"
done
echo "skills 软链: $(find "$ROOT/.agents/skills" -maxdepth 1 -type l | wc -l | tr -d ' ') 个"

# 3. Claude Code 用的是 ~/.claude 下的缓存副本，要单独更一次
( cd "$ROOT" && claude plugin update vercel-plugin@vercel )
echo "完成。Claude Code 需要重开 session 才生效。"
