# 素材清单

《Total War: WARHAMMER III》mod「远征尼朋 · 玉海舰队」的美术与文案素材，2026-09-06 整理。

---

## 有什么

```
nippon_expedition/                 mod 仓库
  _docs/lore/                      背景设定
    玉海舰队视觉设计.md            派系美术简报：配色、设计语言、禁用元素
    尼朋背景与原型调研.md          世界观考据
    战役人物与派系设计.md          派系定位、战役目标
    同伴任务链.md                  三位同伴的章节任务全文（剧情章节的内容来源）
    characters/*.md                4 位角色的性格与外貌设计书
  _docs/data/
    units/                         兵种规格样本 ×2（雷刃旗本 / 潮汐禁卫）
    heroes/立花直虎/  heroes/miko/  角色与数值 + 技能树 + 技能图标
    lords/沈长风/    lords/武士大将/  同上
      <技能名>/icon.png            运行尺寸 59–72 px
      <技能名>/source.png          高清母版 819–2048 px（25 个）
  art_source/concepts/             各主体的定稿美术
  ui/                              游戏里实际显示的成品

nippon-expedition-site/            站点仓库
  content/                         全部正文，中英同字段
    home/*.json                    12 个区块
    faq.json  releases/*.md  i18n.json
  assets/img/                      港口大图、mon 标记
```

## 美术

`_full` / `_full_torn_edge` 是**兵牌大图**（比例 12:26），`_portrait` 是立绘，`_porthole` 是舷窗头像。按比例归类，不看文件名。

**10 个兵种 + 6 位人物 + 3 位同伴，大图全套齐备。** 明细见 [ART-MANIFEST.md](./ART-MANIFEST.md)。

mod 里实际有约 28 个兵种，**其余十几个只有 `ui/units/infopics/` 下 120×260 的小兵牌**，没有大图也没有成稿文案。

| `ui/` 下的运行成品                                                                   | 数量 | 尺寸            |
| -------------------------------------------------------------------------------------- | ---- | --------------- |
| `eventpics/` 剧情事件图（纱代神社毁/复原、瑟兰娜揭面等）                             | 5    | 800×450        |
| `skill_icons/` 技能图标                                                              | 31   | 72×72          |
| `ability_icons/` 战场技能与被动                                                      | 29   | 59×59 / 38×38 |
| `buildings/icons/` 建筑图标                                                          | 12   | 74×74          |
| `units/infopics/` 兵牌成品                                                           | 27   | 120×260        |
| `loading_ui/` `portraits/faction_leaders/` `flags/` 读条海报、阵营领袖、舰队旗帜 | —   | —              |

同伴系统另有整套：羁绊四档徽章（含发光版）、特质图标、Q 版头像、招募立绘、面板背景，三位同伴各一份。

## 没给的

- `_docs/data/mechanisms/`、`buildings/` —— 机制与建筑设计，含未落地的候选方案
- 开发过程的记录、路线规划、实装笔记
- `_docs/translation/` —— 术语对照表
- 其余兵种 / 角色的**设计书**（美术是全套的，设计书只给了样本）
- 中间产物：未加撕边的版本、`_transparent` / `_nobg`、`_raw`、`_preview`、旧版本号、备选头型、读条海报的 8 个候选

要哪一份单说。
