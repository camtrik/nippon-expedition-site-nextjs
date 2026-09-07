# 远征尼朋 · 新站建设路线

**起草：2026-09-06**　　本文件记录**做什么、按什么顺序做、为什么这么定**。
想知道「怎么通过这个项目学 Next.js」看 [LEARNING-NEXTJS.md](./docs/local/LEARNING-NEXTJS.md)。

---

## 这是什么

把隔壁 `../nippon-expedition-site/`（Python 静态站，GitHub Pages）重建成一个 Next.js 应用，并把静态站做不到的那一半——工坊数据、评论分析、私有后台——一起做进去。

**和旧站的关系**：并存，不替换。旧站继续是线上生产站，直到新站在阶段 4 正式接手。任何时候放弃，线上都还是好的。

---

## 已定的决定（附理由，别推翻）

| # | 决定 | 理由 |
|---|---|---|
| 1 | **全做**——内容页和数据页在同一个应用里 | 作者明确要求 |
| 2 | **不走 `output: 'export'`** | 采样、鉴权、LLM 调用都要服务器。静态导出会关掉 RSC 取数、`use cache`、`proxy.ts`、PPR |
| 3 | **`content/` 目录原样搬过来，一个字不改** | 中英同字段约定、手写 front matter、`changelog-entry` skill、AGENTS.md 那一整套规矩全长在这个目录上。Next 只是换一个读它的程序，写内容的体验必须零变化。**不要改成 MDX，不要塞进组件里** |
| 3a | **搬一次就完，这边立刻成为唯一真源**（2026-09-07 定） | 作者不打算再更新旧站，所以没有「两边并行写」的窗口，也就不需要同步机制。搬过来之后**隔壁 `content/` 冻结**——别再往那儿写，也别拿它当源读。⚠️ 旧站本身仍然保持在线，见决定 5a。另：`design/source/nippon-expedition-site/content/` 是冻结的设计输入，不是源 |
| 4 | **版式照 Claude Design 的设计稿重做；配色 token 与字体栈沿用旧站** | 2026-09-07 改（原文是「CSS 原样搬」）。设计稿本来就是照旧站的 token 画的——19 个颜色值和 `base/10-tokens.css` 逐一对得上，字体也是 Sofia Sans + 文楷 GB。所以「换设计」换的只有版式和组件，色板和字体栈原样保留，**别重新取样**。实现方式不变：纯 global CSS，不 Tailwind 化、不拆 CSS Modules、不 CSS-in-JS。设计稿在 `design/远征尼朋官网.dc.html` |
| 5 | **分站路由**：`/` = 中文、`/en/` = 英文。**不做单 URL 客户端切换** | ① mod 在工坊上是中英两个独立条目（`3790908242` / `3790908523`），单 URL 会把英文条目的读者丢到中文页 ② SEO：英文页要能被单独索引 ③ 客户端切换会把**两种语言的正文都发给每个访客** ④ 「切语言整页重建」用 `<Link>` 软导航就能解，不用拿 URL 去换 |
| 5a | **旧站不做 URL 一一对应，改成挂公告条指向新站** | ⚠️ 但**旧仓库和 GitHub Pages 一直挂着别删**：Steam 评论、贴吧、Reddit 上指向旧地址的帖子会存在很多年，公告条就是它们的落点 |
| 5b | **图鉴页专名中英同显，正文不同显** | 玩家分裂在中英两个工坊条目上，只显示一种名字就有一半人对不上号。但**只限专名**（兵种名 / 技能名 / 特质名）——正文也双语并排会让页面长一倍，读起来像没做完的翻译稿 |
| 6 | 部署到 Vercel | 免费拿到独立子域名，顺手甩掉 `SITE_BASE_PATH` 那套子路径逻辑 |
| 7 | **图鉴内容从 mod 本体导出，不手写** | 28 个兵种、一堆人物，手写就是 28 份会过期的副本。数值和文本在 `../nippon_expedition/db/` 的 RPFM 导出表里 |
| 8 | **兵种和人物分两条路由，版式共用、schema 分开** | 数据形状差得远：兵种是战斗数值表，人物是技能树和剧情链。硬合成一个 `/codex/[slug]` 两头不讨好 |
| 9 | **评论分类规则和 LLM 都要，不二选一** | 正文和标签分表存，`source` 字段区分。规则快且免费适合筛选计数，LLM 适合聚类 |
| 10 | **数据采样不进本路线**（2026-09-06 定） | 见 [SNAPSHOT-CRON.md](./SNAPSHOT-CRON.md)。它是一个独立的小定时任务，现在就能跑，和建站互不阻塞 |

### 明确不做的

- **`next/image` 替掉现有图片流程** —— 现在那套是手工 LANCZOS 放大 2 倍 + `cwebp -q 90`，结果可控。默认不换
- **把内容改成 MDX** —— 见决定 3
- **登录系统** —— 私有页用密钥换 cookie，见阶段 7

### 已澄清的误解（免得以后重新纠结一遍）

1. **锚点定位不是 Next 带来的。** 旧站的 section id 早就有了（`#overview` `#lords` `#companions` `#units` `#buildings` `#victory` `#relocations` `#ai` `#compat` `#credits`，FAQ 还有 `#q-<slug>`）。缺的是「怎么把链接拿到手」的 UI —— 一个 ¶ 复制按钮，**两边都要手写，Next 不代劳**。
2. **RSC 之后「React = 每页背运行时」不成立。** 纯 Server Component 渲染的页面，浏览器收到的 JS 可以是零。旧站的干净程度保得住。
3. **`<Link>` 软导航不是白拿的。** Next 默认导航**会把滚动位置重置到顶部**，保位置仍要自己处理。
4. **AGENTS.md 里「唯一的 JS 是首访语言判断」已经不准** —— `site/partials/header.html` 里还有一段（导航栏隐藏 + IntersectionObserver）。迁移时两段都要处理。

---

## 建设阶段

**阶段 1-4 做完就上线**，之后是纯增量。每个阶段独立可交付。

### [ ] 阶段 1 · 地基与内容三页

新站在功能上追平旧站的第一步。

- Next 项目起起来，Turbopack 跑通
- `content/` 从隔壁搬过来（原样）；CSS 照设计稿新写成 global CSS，色板与字体栈从旧站 `base/10-tokens.css` 搬
- 写 loader：front matter 双语键、`inline_md()`、releases 排序
- `app/[lang]/` 路由骨架，`generateStaticParams` 展开 zh / en
- rewrite 把 `/` 映射到 `/zh`，保住 `/` = 中文、`/en/` = 英文的形状
- `layout.tsx` 承载导航和页脚（替代 `partials/header.html` + `footer.html`）
- `generateMetadata()` 生成 title / description / og / canonical / hreflang
- 简介 / 更新记录 / FAQ 三页渲染出来

**要一条条对的规则**（隔壁 AGENTS.md 里都写死了，照搬即可）：

- `latest_released()`：本体最新的**既有版本号又有日期**的条目。子 mod 条目和 `date` 留空的条目会排在它上面但**都不算数**。别图省事写回 `releases[0]`
- 子 mod 条目按**正文里最新的日期**排序；同一天再比正文里**最早**的日期；都同天才落到文件名倒序
- 顶级条目以 `YYYY-MM-DD ` 开头时包成 `.entry-date` 标签，缩进子条目不包
- front matter 支持 `key.zh` / `key.en` 两行写一个双语字段
- `version` 和 `title` 至少要有一个
- 首访语言判断**一辈子只做一次**（用过语言开关后写 `localStorage['npex-lang']` 就不再自动跳）。别改成每次访问都跳，会把别人分享的链接顶掉

**⚠️ Markdown 解析器换了，必须全量对照。** Python-Markdown 有个坑：**列表项内部的空行会结束整个列表**，后面的 `- ` 变成裸横线。现有 releases 正文是按这个行为写的（补充说明一律缩进 4 空格写成子条目）。换成 marked / markdown-it 后行为可能不一样，**把现有全部 releases 跑一遍逐条对输出**。

**⚠️ `rewrites()` 里 `beforeFiles` 的规则是链式套用的，不是命中即停。** 文档只在 `afterFiles` 那条写了「第一条解析成功的就服务」，`beforeFiles` 是**每条匹配的都依次套一遍**。所以「`/` → `/zh/`」和「`/:path*` → `/zh/:path`」两条并存时，`/` 会先被第一条变成 `/zh/`、再被第二条变成 `/zh/zh/`，然后 404。**第二条的排除项里必须带上 `zh` 本身**，这一条同时也挡掉了外面直接访问 `/zh/…` 的情况。已实测，配置见 `next.config.ts`。

**⚠️ `trailingSlash: true` 是刻意开的**（2026-09-07）。旧站产出 `dir/index.html`，URL 一律带尾斜杠，而 `…/faq/#q-nrs` 这种回链散在 Steam 评论里。不开的话 Next 会把 `/faq/` 反向 308 到 `/faq`，多一跳、canonical 也得跟着改。

**⚠️ `proxy.ts` 的坑**（Next 16 起 `middleware.ts` 改的名）：导出的函数也改叫 `proxy`；**只有 nodejs runtime，不支持 edge**；两个文件同时存在会构建报错，`npx @next/codemod@canary middleware-to-proxy .` 能自动迁。

**交付**：三页文本和线上站逐段对得上，`/` 和 `/en/` 都能直达，浏览器里 JS 接近零。

---

### [ ] 阶段 2 · 交互补齐

到这里新站**体验上超过**旧站——两个原始痛点都解决了。

- 语言切换用 `<Link>`，**保住 hash 和滚动位置**（Next 默认重置到顶部，要显式处理）
- 更新记录页签（旧站是纯 CSS radio，可以继续纯 CSS）
- **锚点复制 UI**：小节标题旁一个 ¶，点了复制当前小节的完整地址
- FAQ 沿用 `#q-<slug>`。**新站上线后 slug 定死别再改**——评论区回链（「详见 …/faq/#q-nrs」）是这套锚点存在的理由

**交付**：切语言不跳回顶部；点 ¶ 拿到的链接发给别人能直接落到那一节。

---

### [ ] 阶段 3 · 图鉴与背景故事

新站相对旧站的**第一块净增内容**。瓶颈在内容管线，不在框架。

```
/[lang]/lore/            背景故事，长单页 + 锚点（和简介页同构）
/[lang]/units/[slug]     约 28 个兵种
/[lang]/lords/[slug]     传奇领主 / 英雄 / 同伴
```

简介页的兵牌和人物卡变成可点。**顺带解决简介页太长**——细节挪走，简介回到「简介」。

**现成的部分（别重做）**：`content/home/units.json` 里每个兵种已有 `slug` 和中英名，路由参数是现成的；`site/assets/img/` 里已有 `unit-<slug>.webp`（10 个）和 `char-*.webp`（6 个）。缺的补图走同一条流程：原图 `../nippon_expedition/ui/units/infopics/*.png`（120×260），LANCZOS 放大 2 倍到 240×520 再 `cwebp -q 90`。

**要写的导出脚本，源在隔壁 mod 仓库**：

| 要什么 | 从哪导 |
|---|---|
| 兵种战斗数值 | `db/land_units_tables/cth_npex.tsv`（armour / melee_attack / melee_defence / morale / charge_bonus / accuracy …） |
| 单位组成与招募 | `db/main_units_tables/cth_npex.tsv` |
| 兵种背景文本 | `db/unit_description_historical_texts_tables/`、`db/unit_description_short_texts_tables/` |
| 兵种中英名 | `text/db/cth_npex_land_units_onscreen_names.loc.tsv` |
| 人物技能 / 特质 / 剧情 | `db/character_skills_tables/` 等 + `text/db/cth_npex_companions.loc.tsv`、`cth_npex_lord_traits.loc.tsv`、`cth_npex_quests.loc.tsv` |
| 背景故事原料 | `steam_description_zh.txt`、`DESIGN.md`、`_docs/lore/`（背景考据、派系设计、4 份角色设计书）。⚠️ **别去翻 `cth_npex_loading_screen_quotes.loc.tsv`**——2026-09-06 查过，那 41 行全是 `{{tr:}}` 交叉引用和属性图标标记，是读条界面的新单位提示卡，**没有一句原创 lore** |

**三条纪律**：

1. **导出产物落进 `content/`，和手写内容同一个形状**（中英同字段），这样共用一套 loader
2. **本仓库是公开的**。兵种数值玩家在游戏里本来就看得到，公开没问题；但别把表名、字段名、db key 原样带进页面正文——那是隔壁 AGENTS.md「写玩家视角，不写实装细节」的红线
3. **专名必须查表**。新出现的兵种名、技能名先查 `_docs/translation/术语对照_*.tsv`，查不到才自拟，拟完**回填**
4. **技能图标按 db key 索引，别按显示名。** 设计稿里那份 `skill-icons.js` 是拿显示名当键的（`"Wavebreaker"` 和 `"破浪之帅"` 各一条指向同一张图）——改一次 loc 文案图标就静默变裂图，而且中英各断一半。`design/source/vanilla/vanilla-assets.json` 里每条都带 `ref`，照 `ref` 索引

**交付**：改一个兵种的护甲值，重跑导出，页面数字跟着变；28 个页面没有一份手写副本。

---

### [ ] 阶段 4 · 上线切换

新站正式接手。**这一步之后旧站只剩公告条。**

- [ ] 逐页对照文本，确认没有内容丢失
- [ ] 部署到 Vercel，确认线上表现
- [ ] 工坊描述里的链接改指向：**中文条目指 `/`，英文条目指 `/en/`**
- [ ] 旧站每页顶部加公告条「请查看新页面」+ 链接
- [ ] **旧仓库和 GitHub Pages 保持在线，别删**（决定 5a）
- [ ] `SITE_BASE_PATH` 那套逻辑删掉
- [ ] 隔壁仓库 README 说明新站地址

**交付**：新站是玩家看到的那个站。

---

### [ ] 阶段 5 · 工坊数据（公开）

第一次真的用到服务器。

- `app/api/cron/route.ts` 采样端点，Vercel Cron 每天调一次
- [SNAPSHOT-CRON.md](./SNAPSHOT-CRON.md) 攒的 JSON 灌进库（Neon 免费 Postgres 或同类）
- **公开页 · 工坊数据**：7 个条目一张表（订阅 / 收藏 / 浏览 / 好评率）
- 缓存：`'use cache'` + `cacheLife('hours')` + `cacheTag`，采样跑完 `revalidateTag`
- 试 PPR（`cacheComponents: true`）：版式静态、数字动态

**三个端点的分工**（已实测）：

| 要什么 | 端点 | 要 key 吗 |
|---|---|---|
| 订阅 / 收藏 / 浏览 / 更新时间 | `ISteamRemoteStorage/GetPublishedFileDetails/v1/`（POST） | ❌ 免 key |
| **好评率（votes_up / votes_down）** | `IPublishedFileService/GetDetails/v1/?includevotes=true` | ✅ **必须 key**，免 key 端点没有 vote_data，实测 401 |
| 评论 | `steamcommunity.com/comment/PublishedFile_Public/render/<creator_steamid64>/<fileid>/` | ❌ 免 key 免登录 |

- creator steamid64：`76561198297010613`；7 个工坊条目见隔壁 `scripts/sitegen/workshop.py`
- Hobby 计划的 cron 频率有限制，**用之前确认**；一天一次本来就够
- `revalidateTag` **现在必须传第二个参数**（一个缓存档位），只传 tag 会报错

**交付**：数字自己会变，不用重新部署。

---

### [ ] 阶段 6 · 评论管线与兼容性地图

- 抓取：**评论端点用 POST**，body `start=<offset>&totalcount=0&count=<n>`。GET 和 POST 拿到的总数不一样（实测 GET 131 / POST 147），**以 POST 为准**
- 先探一次 `count=1` 拿总数再翻页；1 秒间隔；遇 429/5xx 退避重试
- **别用正则解析 HTML**，用 cheerio 选 `.commentthread_comment_text`
- **非文档化端点，Steam 随时会改。** 写容错，挂了跳过这次，别让整个任务失败
- 规则分类七类：`bug / question / solution / compat / positive / negative / noise`，中英简繁都要覆盖
- 从评论正文抠出别人提到的工坊 id → **兼容性地图**（公开页）

**数据模型：**

```
mods(publishedfileid, name, role)                     -- 7 条，手填
snapshots(mod_id, taken_at, subs, lifetime_subs, favorited, views, votes_up, votes_down)
comments(comment_id PK, mod_id, author_steamid, is_author, posted_at, text)
comment_tags(comment_id, tag, source)                 -- source: 'rule' | 'llm'
linked_mods(comment_id, target_fileid)                -- 兼容地图的边
analyses(id, run_at, window, model, output_json)
```

**正文和标签必须分表。** 规则表一定会反复调，LLM 也会重跑，正文抓一次就固定了——这样规则和 LLM 的结果能并存对比（决定 9）。

**`is_author` 很重要**：作者自己的回复要从情绪统计里排掉。实测 147 条里作者占 40 条，不排会把结论完全带偏。

**交付**：兼容性地图上线，玩家能看到「这个 mod 和哪些 mod 有冲突」。

---

### [ ] 阶段 7 · 私有后台

**不做登录系统。** 第一次用带密钥的 URL 访问，服务端把密钥换成 httpOnly cookie，之后直接访问 `/admin` 就进得去，其他人看到 **404**（不是 401——别人连「这里有个后台」都不该知道）。

**三层都要挡，少一层就漏：**

1. 页面 `/admin/*`
2. **接口 `/api/admin/*` 必须一起写进 matcher。** 漏了别人直接打接口就能把数据全捞走
3. **私有数据别传给公开页的 Client Component。** Server Component 里的数据不会泄漏，但**一旦作为 props 传给 Client Component 就会被序列化进 HTML**

```ts
const secret = process.env.ADMIN_KEY
if (!secret) return notFound()   // ⚠️ 少了这行，环境变量没配时 undefined === undefined 会直接放行
```

**页面：**

- **评论收件箱** —— 按 bug / 提问 / 兼容 / 情绪筛，能标「已回复 / 已进 FAQ / 忽略」。**唯一一个每天真会打开的页面**
- **趋势** —— 订阅和好评率曲线，叠版本发布竖线（版本号和日期从 `content/releases/*.md` 读，不另填一份）
- **LLM 分析报告** —— 新评论攒够一批跑一次，**结果存库，页面只读库**。别在渲染时调模型：每次访问都要等几秒、都花钱、结论还不一样
- **任务状态** —— 采样上次跑成功没有、抓了几条

**⚠️ 评论是玩家写的，喂给模型时当纯数据处理。** 别让模型把评论里的句子当指令执行——真有人会在评论里写 "ignore previous instructions"。

**交付**：别人访问 `/admin` 和 `/api/admin/*` 都是 404；自己收藏的 `/admin` 直接进得去。

---

## 迁移期的护栏

### ⚠️ 字体子集——全场唯一一个 Next 帮不上、还可能添乱的地方

中文正文用自托管的文楷 GB 子集，**只含站点当前实际渲染的字**。隔壁 `sitegen/fonts.py` 的 `check_font_coverage()` 会在引入子集外的字时**构建报错并列出缺哪几个**。

**这个护栏必须自己保住。** `next/font` 不提供它。缺字不报错就会静默回退系统字体，同一句话里出现两套字形——页面不报错，只有肉眼看才发现。

两条路：CI 里留一个 Python 后置步骤扫构建产物，或用 fontkit 重写。**不能省。**

⚠️ **设计稿在这一点上是反的**：它 `<head>` 里直接挂 jsDelivr 的完整文楷 GB webfont（`lxgw-wenkai-gb-web@1.522.0`）。那是设计稿要能在别人机器上打开才这么写的，**不能照搬上线**——完整字重好几 MB，而且把子集护栏整个绕过去了。落地时换回自托管子集。

回退栈的顺序（**简体中文字体必须排在任何日文字体之前**）见隔壁 `site/styles/base/10-tokens.css` 里 `--font-sans` 的注释——那是修过的 bug，别推翻。

⚠️ 阶段 3 的图鉴会引入大量新字（兵种名、技能名、背景文本），**是最容易触发缺字的一步**，导出脚本跑完记得重新切子集。

### 回归对照

隔壁 `scripts/verify_build.py` 那套逐字节比对**换栈后失效**（HTML 结构必变）。替代做法：提取纯文本 + 关键属性（href / id / hreflang）来对，不比字节。

---

## 素材与参考

| 要什么 | 在哪 |
|---|---|
| 内容原料、专名对照表、FAQ 成稿 | `../nippon_expedition/_docs/`，规矩见 `../nippon-expedition-site/AGENTS.md` |
| 现有渲染逻辑（要重写成 TS 的） | `../nippon-expedition-site/scripts/sitegen/` |
| **设计稿**（版式的唯一依据） | 本目录 `design/远征尼朋官网.dc.html` |
| 配色 token 与字体栈（照搬这一份） | `../nippon-expedition-site/site/styles/base/10-tokens.css` |
| 旧站 CSS（只当参考，不再原样搬） | `../nippon-expedition-site/site/styles/` |
| 7 个工坊条目的 id | `../nippon-expedition-site/scripts/sitegen/workshop.py` |
| 兵种 / 人物数据源 | `../nippon_expedition/db/`、`../nippon_expedition/text/db/` |
| Vercel / Next 技能包 | 本目录 `.agents/skills/` |

### ⚠️ 待抢救：上一轮的评论数据

上一轮在临时目录里跑出过一份数据，**那个目录会被清理**：

```
/private/tmp/claude-501/-Users-ebbi-Work-wh3-mod-projects-warhammer-3-nippon-expedition-site/d44a95d5-edb8-49e9-93d1-2d2f83db532a/scratchpad/
  3790908242.comments.json   147 条评论（2026-08-27 → 09-05），已带规则分类字段
  nippon-report.html         可离线看的分析报告
```

`3790908242.comments.json` 是自己 mod 的评论，值得拷出来当阶段 6 的对照样本。

同目录下的 `analyzer.py` **不要拷进本仓库**——来自 [AobaKuma/Fortified-Framework](https://github.com/AobaKuma/Fortified-Framework)，**仓库没有 LICENSE，默认保留所有权利**。读思路、照着重写没问题，别整段抄。它那张七类分类规则表和「从评论抠出工坊 id」的正则值得参考。

---

## 记录区

做完一个阶段回来打勾，补记踩到的坑。**决定改了就在上面那张表里改，别只在这里加一行。**

- 2026-09-06 起草。
- 2026-09-06 重构：学习路线拆到 [LEARNING-NEXTJS.md](./docs/local/LEARNING-NEXTJS.md)，采样任务拆到 [SNAPSHOT-CRON.md](./SNAPSHOT-CRON.md)。本文件改成按建设阶段组织，上线切换从最后提前到阶段 4。
- 2026-09-07 设计稿到位，改了决定 4（见上表）。`design-input/` 更名为 `design/source/`，设计稿放在 `design/` 下；隔壁 `nippon_expedition/tools/build_site_vanilla_export.py` 的默认输出路径同步改了。
