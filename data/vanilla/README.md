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

> **版权**：`icons/` 下全部 PNG（`icons/npex/` 除外）与本目录 JSON 里
> `"source": "vanilla"` 的全部文案、`vanilla-catalog.json` 的全部内容，著作权属
> Creative Assembly / SEGA，随《Total War: WARHAMMER III》本体分发。
> `"source": "npex"` 的才是本 mod 原创。站点上如需署名，按这个字段切。

---

## 目录

```
vanilla-assets.json      事实表：本 mod 技能树/兵种引用到的条目，按 DB key 索引，276 条
vanilla-catalog.json     原版整批文案（约 14MB），见下文「整批文案」
skills/<主体>.json       7 套技能树的节点与连线
units/<兵种>.json        10 个兵种的技能与特性
icons/campaign ui/skills/           790 张，战役技能图标，整目录
icons/battle ui/ability_icons/     2374 张，战斗能力与法术图标，整目录
icons/campaign ui/effect_bundles/   982 张，效果图标，整目录
icons/skins/default/...              97 张，modifier_icon_* / icon_stat_*，加文案里 [[img:]] 内嵌到的
icons/flags/...                    文案内嵌 token 指到 ui 下别处的（派系旗帜），按原路径放
icons/npex/                        自制图在 design/source 快照里找不到时才出现
```

`icons/` 下的路径 = 游戏内路径去掉开头的 `ui/`，大小写照游戏原样。
（Mac 文件系统大小写敏感，引用时按 JSON 里 `file` 字段原样用，别自己拼。）

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

去重后：**事实表 276 条，原版复用 172 / 本 mod 原创 104。**
（含技能效果里解锁的法术，以及 10 个兵种的能力和特性。）

兵种十个：玉海潮勇 jade-sea-sailors、舰队铳手 jade-sea-fleet-gunners、
长枪武士 yari-samurai、铁炮武士 teppo-samurai、雷刃旗本 hatamoto-raijin、
潮汐禁卫 tide-guard、云霄禁卫 empyrean-guard、麒麟 kirin、
稻荷灵狐使者 inari-fox、沧溟巨炮 abyssal-grand-cannon。

水师提督三套技能树不进图鉴，没有导出。

## 数据来源

- 结构：mod 自己的 `db/character_skill_node_set_items` → `character_skill_nodes`
  → `character_skill_node_links`
- 原版文案：`_reference_packs/_vanilla_wh3/`（`db/`、`loc_cn_en.tsv`）
- 原版图标：直接从游戏的 `ui*.pack` 读（提取物是部分的）
- 本 mod 文案：`text/db/*.loc.tsv`（中）+ `localization/en/text/db/*.loc.tsv`（英）

**结构取自 DB 而不是技能树 markdown**，因为文档里的树状图是给人看的摘要，会把
整条整条复用的原版链缩成一行。武士大将文档只列了 2 个复用 key，DB 里实际是 40 个。

## 技能效果行

事实表里每个 `character_skill` 条目带 `effects` 数组，一条一个效果：

```json
{
  "level": 1,
  "effect": "wh_main_effect_character_stat_melee_attack",
  "effect_source": "vanilla",
  "scope": "character_to_character_own",
  "value": 5.0,
  "text": { "zh": "近战攻击：+5", "en": "Melee attack: +5" },
  "template": { "zh": "近战攻击：%+n", "en": "Melee attack: %+n" },
  "priority": 130,
  "icon": { "source": "vanilla", "file": "icons/campaign ui/effect_bundles/melee_character.png", "size": "24x24" }
}
```

- 多级技能按 `level` 分组显示；同级内已按 `priority`（游戏的排序）排好。
- `text` 已代入数值（`%+n` 带符号，`%n` 原值），并拼上了作用域后缀
  （例如「\n（英雄所在军队）」，带换行和内嵌图标）。
- `text: null` 表示这个效果没有描述 loc，是隐藏管线效果，游戏里也不显示，跳过即可。
- 解锁法术的技能带 `unlocks_abilities`（法术 key 列表，法术本身也在事实表里）。
  技能自身没有描述的，已照搬法术描述并标 `desc_via_ability`（12 条）。

## 整批文案 `vanilla-catalog.json`

原版全量，**不只是本 mod 用到的**，以后要别的原版条目在 Mac 上直接查：

| 字段 | 条数 | 内容 |
| --- | ---: | --- |
| `character_skills` | 5944 | name / desc / icon / `effects`（`[level, effect, scope, value]` 原始行）/ `unlocks_abilities` |
| `unit_abilities` | 2899 | name / desc / type / source_type / icon |
| `unit_attributes` | 83 | name / desc（loc 是 `名称||描述`，已拆开）/ icon |
| `unit_bullet_points` | 223 | name / desc / state / icon（大多为 null，见下） |
| `effects` | 15064 | `template`（含 `%+n` 占位）/ icon / icon_negative / priority / category / is_positive_value_good |
| `effect_scopes` | 435 | 作用域后缀文本 |
| `inline_icons` | 147 | 文案里 `[[img:xxx]]` 的 token → 图标文件 |

- 这里的文案**没有展开 `{{tr:}}`、没有代入数值**，是原样照搬；要显示得自己
  拿 `effects.<effect>.template` 代入，再拼 `effect_scopes.<scope>`。
- icon 字段是相对本目录的路径字符串，找不到图的为 null。

## 站点渲染要注意的几件事

**1. 先按 `visible_in_ui` 过滤。** 无名称的 8 条全部挂在
`visible_in_ui: false` 的节点上（`*_dummy`、`*_actions_dummy`、
`wh3_main_agent_action_scaling`）——那是发效果用的隐藏管线，原版就没给 loc。
仍无描述的 6 个技能也都在隐藏节点上。过滤掉之后没有任何该显示的东西是缺的。

**2. `icon.source` 和条目的 `source` 是两回事。** 我们自建的技能大量复用 CA 的
图标（`character_attack.png` 之类）。要标"原版素材"就看 `icon.source`，
要标"原版技能"就看外层 `source`。

`icon.source: "npex"` 的条目不在本目录，`file` 指向站点仓库 `design/source` 里已有的
那份（`nippon_expedition/ui/skill_icons/...`），路径相对站点仓库的 `design/source/`，
不是相对本目录——注意那边的文件名**去掉了 `cth_npex_` 前缀**。

**3. 图标尺寸不统一，别按目录假定，读 `icon.size`。** 事实表里每条的尺寸都是从
PNG 的 IHDR 实测写进去的。战役技能格主流 72x72，但出身特性节点复用的
`trait_*.png` 是 24x24；法术/主动 59x59，战斗被动 38x38，效果图标 24x24；
原版自己还有 71x72 / 72x71 / 57x57 这种差一两个像素的。

**4. 富文本标记要自己解析。** 描述里有 `[[img:...]]`、`[[col:white]]...[[/col]]`、
`[[b]]`，以及 `\n` 换行。`[[img:]]` 里是完整路径（`ui/skins/default/...png`）
或简写别名（`icon_hero`、`icon_ap`、`rank7`……），两种都已解析进
`vanilla-catalog.json` 的 `inline_icons`，直接用 token 查表即可。
解析不到的 2 个（`elector_count_B`、`tmb_khemri`）游戏文件里也没有这张图。
**`{{tr:...}}` 转写在事实表里已经展开**，展开过的带 `_via_tr: true`。

**5. 事实表里有 11 条没有图标，都不是漏导：**
- 10 个 `ui_unit_bullet_point_enums`（`armoured`、`armour_piercing`、`anti_large`、
  `anti_infantry`、`deflect_shots`、`hybrid`、`shielded`、`aquatic`、`very_fast`、
  `vanguard_deployment`）——那张表的 `icon_path` 列本来就是空的，
  图标由兵牌 layout 现画，游戏文件里不存在可导的 PNG。条目上有
  `has_icon: false` 和 `icon_missing_reason`，站点得自己给个通用样式。
- `wh3_dlc27_skill_node_hef_unique_scrolls_of_power_mist_mage` ——
  原版这行指向 `arcane_essays.png`，而这个文件在全部原版 pack 里都不存在。
  CA 自己的悬空引用，该节点 `visible_in_ui: false`，按第 1 条过滤掉就碰不到。

**6. 两个本 mod 自建效果缺描述 loc**（工兵协助补员、纱代式神麒麟开关），效果行 `text: null`，
是 mod 本体的问题，已记进 mod 仓库 backlog，站点不用处理。

## 兵种的「特性」有两套来源

`units/*.json` 里分了两个字段，因为背后是两套完全不同的机制：

- `attributes_from_db` —— 从 mod DB 的 `unit_attributes_to_groups_junctions`
  直接读出来的，权威。这些在原版 `unit_attributes` 表里有行，有
  `unit_attributes_bullet_text_<key>` loc（格式是 `名称||描述`），有图标。
- `traits_from_doc` —— 兵种设计文档 `## 特性` / `## 部队属性` 两节里列的中文名，
  按 loc 反查回 key。这一路会命中上面那些 `ui_unit_bullet_point_enums`
  派生特性（装备重甲、破甲杀伤那类），它们**不是 DB 里的兵种属性行**，而是游戏
  按数值阈值现算出来的（`ui_unit_bullet_points_generations` 里 302 条阈值规则）。
  所以只能从文档取，`ref: null` 表示这个写法在原版 loc 里查不到唯一对应
  （攻城者、引发惊骇、魔法弹药这类本 mod 自己的说法），文案直接用文档里的中文名。

## 重新生成

在 Windows 上，mod 仓库根目录：

```bash
python tools/build_site_vanilla_export.py
```

`--check` 只校验不写盘，退出码非 0 表示有解析不了的条目。
`--out <目录>` 换输出位置。每次写盘会先整删 `icons/` 再重写。

加人物：在脚本的 `SUBJECTS` 里加一行 `node set key -> (slug, 中文名, role)`。
加兵种：在 `UNITS` 里加一行 `land_unit key -> (slug, 中文名, 设计文档路径)`。
其余全自动。
