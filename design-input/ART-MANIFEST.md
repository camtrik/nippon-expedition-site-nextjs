# 美术清单

## 命名

| 后缀 | 是什么 | 比例 |
|---|---|---|
| `_full` | 兵牌大图 | **12 : 26** |
| `_full_torn_edge` | 同一张的撕边版 | 同上 |
| `_portrait` | 立绘 / 全身画 | 约 2 : 3 |
| `_porthole` | 舷窗头像 | 约 11 : 6 |
| `_scene_16x9` | 横幅环境图 | 16 : 9 |
| `_recruit_bg` | 竖版招募背景 | 约 4 : 5 |
| `_kamon_*` | 家纹 | 1 : 1 |

按比例归类，不看文件名。同一类里各张的绝对像素不一样，比例是一致的。

## 兵种与人物

**16 个主体，`_full` 和 `_full_torn_edge` 都齐。**

兵种 10：玉海潮勇、潮汐禁卫、舰队铳手、云霄禁卫、沧溟巨炮、长枪武士、铁炮武士、雷刃旗本、稻荷灵狐使者、麒麟

人物 6：沈长风、武士大将（红 / 黑两版）、立花直虎、巫女、纱代、瑟兰娜 —— 另有 `_portrait` 和 `_porthole`

⚠️ **人物的 `_full` 绝对尺寸只有兵种的四分之一左右**（宽 159–257 px，兵种是 850+）。人物要大图用 `_portrait`（1000+ px）。

其余：沈长风 `_faction_leader`、雷刃旗本与武士大将的家纹、玉海潮勇 `_cinematic`、立花直虎 / 纱代 / 瑟兰娜的 `_scene_16x9` 与 `_recruit_bg`。

不含缩小版——是 `_full` 的等比缩放。

## 远征同伴

三位：纱代 `sayo`、瑟兰娜 `serena`、立花直虎 `tachibana_naotora`。各一套。

| 文件 | 是什么 |
|---|---|
| `<name>_deference_1..4[_glow]` | 羁绊四档徽章，从简到繁递进，第四档带旗帜衬底；另有发光版 |
| `<name>_trait_1..4` | 对应四档的特质图标 |
| `<name>_icon_master` | Q 版头像母版，1254×1254 |
| `<name>_icon_face` / `_icon_bond` | 顶栏头像与羁绊小图标，24–28 px 的引擎槽位尺寸 |
| `<name>_recruit` / `_recruit_banner` | 招募立绘与横幅 |
| `<name>_panel_bg_sky` | 面板天空背景 |
| `icon_favour` / `icon_companions` | 系统通用图标 |

## 图标与成品

| 目录 | 数量 | 尺寸 |
|---|---|---|
| `ui/eventpics/` 剧情事件图 | 5 | 800×450 |
| `ui/skill_icons/` 技能图标 | 31 | 72×72 |
| `ui/ability_icons/` 战场技能与被动 | 29 | 59×59 / 38×38 |
| `ui/buildings/icons/` 建筑图标 | 12 | 74×74 |
| `ui/units/infopics/` 兵牌成品 | 27 | 12:26 |
| `ui/flags/` 舰队旗帜 mon | 3 | — |
| `ui/loading_ui/` 读条海报 | 1 | 1920×1080 |
| `ui/portraits/faction_leaders/` 阵营领袖 | 1 | — |

技能图标另有高清母版：`_docs/data/{lords,heroes}/<角色>/<技能名>/source.png`，25 个，819–2048 px。

## 剔掉的

未加撕边的中间版、缩小版、`_transparent` / `_nobg`、`_raw`、`_preview` / `_source`、旧版本号、生成过程的临时文件、备选头型、读条海报的 8 个候选版本、同伴目录里重复的通用面板资产、构建脚本。
