# 原版复用素材导出

技能树与兵种页要渲染的**原版（Creative Assembly）**图标与中英文案。
由 `nippon_expedition/tools/build_site_vanilla_export.py` 生成，**不要手改**——
改了下次重跑就没了。数值或技能树一变，重跑一次即可。

**位置**：站点仓库 `data/vanilla/`，2026-09-14 从 `design/source/vanilla/` 挪过来。
`design/source/` 放的是冻结的设计稿素材，管线产物不该混在里面。这里是**原料**，
只给站点的 `pnpm export:codex` 读，页面不直接引用：页面实际用到的图标由导出脚本
按 DB key 挑进 `assets/icons/`，文案写进 `content/codex/`。整批图标不放
`assets/`（动态 import 会把整个目录打进构建产物），也不放 `content/`（字体覆盖
检查会递归扫描它）。

本文是**给站点看的**：产物是什么、渲染要注意什么。**要动这条导出管线本身**
（加人物、加兵种、改取图规则）看 mod 仓库的
`_docs/ai_docs/原版图标与文案导出到站点.md`，那份是操作手册。

> **版权**：`icons/` 下全部 92 个 PNG 与本目录 JSON 里 `"source": "vanilla"` 的
> 全部文案，著作权属 Creative Assembly / SEGA，随《Total War: WARHAMMER III》
> 本体分发。本 mod 只是在技能树里复用这些原版节点。
> `"source": "npex"` 的才是本 mod 原创。站点上如需署名，按这个字段切。

---

## 目录

```
vanilla-assets.json      事实表：按 DB key 索引，206 条
skills/<主体>.json       7 套技能树的节点与连线
units/<兵种>.json        2 个兵种的技能与特性
icons/skills/            70 张，战役技能格
icons/abilities/         21 张，战斗能力格
icons/effect_bundles/     1 张，效果图
```

两层结构：**结构文件只存 key 引用**，文本和图都到 `vanilla-assets.json` 里查。
同一个原版节点被多人复用时（`wh_main_skill_all_all_self_blade_master_starter`
沈长风和立花直虎都有）事实表里只有一条，`referenced_by` 列出谁引用了它。

## 覆盖范围

| 主体 | 节点数 | 其中原版技能 |
| --- | ---: | ---: |
| 沈长风 shen-changfeng | 62 | 48 |
| 立花直虎 tachibana-naotora | 28 | 20 |
| 纱代 sayo | 34 | 14 |
| 瑟兰娜 serena | 39 | 29 |
| 武士大将 samurai-taisho | 57 | 40 |
| 武士大将（黑）samurai-taisho-black | 57 | 40 |
| 巫女 miko | 49 | 32 |

去重后：**事实表 206 条，原版复用 126 / 本 mod 原创 80。**

兵种两个：潮汐禁卫 tide-guard、雷刃旗本 hatamoto-raijin。

## 数据来源

- 结构：mod 自己的 `db/character_skill_node_set_items` → `character_skill_nodes`
  → `character_skill_node_links`
- 原版文案/图标：`_reference_packs/_vanilla_wh3/`（`db/`、`loc_cn_en.tsv`、`ui/`），
  提取物里缺的图回原版 `ui*.pack` 现取
- 本 mod 文案：`text/db/*.loc.tsv`（中）+ `localization/en/text/db/*.loc.tsv`（英）

**结构取自 DB 而不是技能树 markdown**，因为文档里的树状图是给人看的摘要，会把
整条整条复用的原版链缩成一行。武士大将文档只列了 2 个复用 key，DB 里实际是 40 个。

## 站点渲染要注意的几件事

**1. 先按 `visible_in_ui` 过滤。** 7 个条目没有名称，全部挂在
`visible_in_ui: false` 的节点上（`*_dummy`、`*_actions_dummy`、
`wh3_main_agent_action_scaling`）——那是发效果用的隐藏管线，原版就没给 loc。
过滤掉之后没有任何该显示的东西是缺的。

**2. `icon.source` 和条目的 `source` 是两回事。** 我们自建的技能大量复用 CA 的
图标（`character_attack.png` 之类）。要标"原版素材"就看 `icon.source`，
要标"原版技能"就看外层 `source`。

`icon.source: "npex"` 的 33 条不在本目录，`file` 指向站点仓库 `design/source` 里已有的
那份（`nippon_expedition/ui/skill_icons/...`），路径相对站点仓库的 `design/source/`，
不是相对本目录——注意那边的文件名**去掉了 `cth_npex_` 前缀**。

**3. 图标尺寸不统一，别按目录假定，读 `icon.size`。** 每条的尺寸都是从 PNG
的 IHDR 实测写进去的，实际分布：

| 尺寸 | 张数 | 是什么 |
| --- | ---: | --- |
| 72x72 | 110 | 战役技能格，主流 |
| 24x24 | 29 | 出身特性节点复用的 `trait_*.png`，游戏里是放大显示的 |
| 59x59 | 15 | 法术 / 主动技能图标 |
| 38x38 | 8 | 战斗被动图标 |
| 71x72 / 72x71 / 57x57 | 5 | 原版自己就差这一两个像素 |

**`ui/campaign ui/skills/` 并不是清一色 72x72** —— 出身特性那 29 条拿的是
24x24 的小图。按目录一刀切拉伸会把它们糊成一团。

**4. 富文本标记要自己解析。** 描述里有 `[[img:...]]`、`[[col:white]]...[[/col]]`、
`[[b]]`，以及 `\n` 换行。`[[img:icon_ap]]` 这种简写还要再过一层
`ui_text_replacements` 才是真路径。**`{{tr:...}}` 转写已经在导出时展开了**
（206 条里有 31 条命中），展开过的带 `_via_tr: true`。

**5. 有 6 条没有图标，都不是漏导：**
- `armoured` / `armour_piercing` / `anti_large` / `deflect_shots` / `hybrid`
  —— 这五个是 `ui_unit_bullet_point_enums`，那张表的 `icon_path` 列本来就是空的，
  图标由兵牌 layout 现画，游戏文件里不存在可导的 PNG。条目上有
  `has_icon: false` 和 `icon_missing_reason`，站点得自己给个通用样式。
  （同表的 `yin` 有 `icon_path`，正常导出了。）
- `wh3_dlc27_skill_node_hef_unique_scrolls_of_power_mist_mage` ——
  原版这行指向 `arcane_essays.png`，而这个文件在全部原版 pack 里都不存在
  （只有 `emp_arcane_essays.png`）。CA 自己的悬空引用，游戏里也是回落占位图。
  该节点 `visible_in_ui: false`，站点按第 1 条过滤掉就碰不到。

**6. 法术解锁类技能在原版没有描述。** `desc: null` 且带
`desc_missing_reason`，游戏里显示的是所解锁法术自己的说明。要补的话得再走一趟
`character_skill_level_to_effects_junctions` → 法术 → `unit_abilities_*` loc，
这一趟本次没做。

## 兵种的「特性」有两套来源

`units/*.json` 里分了两个字段，因为背后是两套完全不同的机制：

- `attributes_from_db` —— 从 mod DB 的 `unit_attributes_to_groups_junctions`
  直接读出来的，权威。这些在原版 `unit_attributes` 表里有行，有
  `unit_attributes_bullet_text_<key>` loc（格式是 `名称||描述`），有图标。
- `traits_from_doc` —— 兵种设计文档 `## 特性` / `## 部队属性` 两节里列的中文名，
  按 loc 反查回 key。这一路会命中上面那些 `ui_unit_bullet_point_enums`
  派生特性（装备重甲、破甲杀伤那类），它们**不是 DB 里的兵种属性行**，而是游戏
  按数值阈值现算出来的（`ui_unit_bullet_points_generations` 里 302 条阈值规则）。
  所以只能从文档取，`ref: null` 表示这个写法在原版 loc 里查不到唯一对应。

## 重新生成

```bash
python tools/build_site_vanilla_export.py
```

`--check` 只校验不写盘，退出码非 0 表示有解析不了的条目。
`--out <目录>` 换输出位置。⚠️ 挪目录之后，脚本的 `DEFAULT_OUT` 还指着旧的
`design/source/vanilla/`；另外有两处用「输出目录的上一级」反推 `design/source`
（`_snapshot_icon()` 和 `check()` 第 2 条），也会断。这几处在 mod 仓库 backlog
`_docs/backlog/0914_站点图鉴缺原版导出.md` 里排着，改完之前别直接重跑。

加人物：在脚本的 `SUBJECTS` 里加一行 `node set key -> (slug, 中文名, role)`。
加兵种：在 `UNITS` 里加一行 `land_unit key -> (slug, 中文名, 设计文档路径)`。
其余全自动。
