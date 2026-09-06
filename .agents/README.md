# .agents —— 这个项目自带的 agent skill

Vercel 官方插件**只装在这个目录里**，不进全局。`~/.claude` 和 `~/.codex` 下都没有 Vercel
相关的东西了（2026-09-06 清掉的），换个项目就看不到这些 skill。

## 布局

```
.agents/
  vendor/vercel-plugin/     git clone github.com/vercel/vercel-plugin（不入库，见 .gitignore）
  skills/<name>  ->         ../vendor/vercel-plugin/skills/<name>   35 个软链
  sync.sh                   更新用
.claude/settings.json       把 vendor 目录注册成项目级 marketplace + 启用插件
```

一份文件，两个工具各按自己的规矩读：

| 工具 | 怎么读到 | 拿到什么 |
| --- | --- | --- |
| Claude Code | `.claude/settings.json` 里的项目级插件（scope: project） | 35 skills + 4 commands + 3 agents + 3 hooks + `vercel` MCP server |
| Codex | 自动扫描 `<项目>/.agents/skills`，零配置 | 35 skills（前缀 `vercel:`） |
| 再加别的工具 | 在这里加一个指向 `.agents/skills` 的软链即可 | — |

Codex 的扫描路径可以用 `codex debug prompt-input` 里的 "Skill roots" 段自查；它同时认
`<项目>/.codex/skills` 和 `<项目>/.agents/skills`。

## 更新

```bash
bash .agents/sync.sh
```

会 `git pull` vendor、重建软链、再跑一次 `claude plugin update`——Claude Code 用的是
`~/.claude/plugins/cache/vercel/vercel-plugin/<版本>/` 下的副本，不是 vendor 目录本身，
所以这一步不能省。跑完要重开 session 才生效。

新克隆这个仓库时 vendor 目录是空的（被 gitignore 了），同样跑一次 sync.sh 补齐。

## 已知的小毛病

Codex 会递归扫描，于是 `skills/<name>/upstream/SKILL.md` 这些上游同步副本会多出 12 条
重名条目（`ai-sdk`、`workflow` 等）。不影响功能，只是 prompt 里多几行。Claude Code 不
递归，没这个问题。

## ⚠️ create-next-app 会拒绝在这个目录里跑

它的非空目录白名单只放行 `.gitignore` / `.vscode` / `LICENSE` 这类名字，`.agents` 和
`.claude` 不在里面。脚手架要么先搭到别处再把文件挪进来，要么临时把这两个目录移开：

```bash
mv .agents .claude /tmp/npex-agents-stash/ && npx create-next-app@latest . && mv /tmp/npex-agents-stash/{.agents,.claude} .
```
