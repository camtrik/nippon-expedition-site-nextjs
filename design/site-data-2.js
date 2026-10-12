/* 远征尼朋 · 玉海舰队 — 详情页数据
   兵种 2 份、人物 4 份按 _docs/data 的样本字段写实；其余条目字段结构相同、数值待补。 */
(function () {
  var S = (window.SITE_DATA = window.SITE_DATA || {});

  function kv(zh, en, v, n, nen) {
    return { k: { zh: zh, en: en }, v: v, n: n ? { zh: n, en: nen || n } : null };
  }

  /* ─────────── 兵种 ─────────── */
  S.units = [
    {
      slug: "jade-sea-warriors",
      name: { zh: "玉海潮勇", en: "Jade Sea Warriors" },
      group: "fleet",
      status: "pending",
      card: "assets/unit/jade-sea-warriors.png",
      role: { zh: "舰队主力步兵", en: "Fleet line infantry" },
      recruit: [kv("招募来源", "Recruited from", { zh: "旗舰建筑树", en: "The flagship building tree" })]
    },
    {
      slug: "fleet-gunners",
      name: { zh: "舰队铳手", en: "Fleet Gunners" },
      group: "fleet",
      status: "pending",
      card: "assets/unit/fleet-gunners.png",
      role: { zh: "舰队远程步兵", en: "Fleet missile infantry" },
      recruit: [kv("招募来源", "Recruited from", { zh: "旗舰建筑树", en: "The flagship building tree" })]
    },
    {
      slug: "abyssal-grand-cannon",
      name: { zh: "沧溟巨炮", en: "Abyssal Grand Cannon" },
      group: "fleet",
      status: "pending",
      card: "assets/unit/abyssal-grand-cannon.png",
      role: { zh: "舰队炮兵", en: "Fleet artillery" },
      desc: { zh: "可以切换两种魔法炮弹「奔流」与「骤雨」。", en: "Switches between two magic shells, Torrent and Cloudburst." },
      recruit: [kv("招募来源", "Recruited from", { zh: "旗舰建筑树；v1.0.3 起沈长风开局自带", en: "The flagship building tree; in Shen Changfeng's starting army since v1.0.3" })]
    },
    {
      slug: "tide-guard",
      name: { zh: "潮汐禁卫", en: "Tide Guard" },
      group: "fleet",
      status: "live",
      card: "assets/unit/tide-guard.png",
      role: { zh: "精英混合远程步兵（T3）", en: "Elite hybrid missile infantry, T3" },
      desc: {
        zh: "玉海舰队的魔法战士无人可当，没几个人能在潮汐禁卫的刀锋下全身而退。",
        en: "The Jade Sea Fleet's magic-bearing warriors have no answer on the field, and few walk away from the Tide Guard's blades."
      },
      story: {
        zh: "沈长风亲统的嫡系禁卫，从玉海潮勇中百里挑一。她们持长柄刀、挎和弓，以震旦水师旧军的军纪驾驭尼朋的风浪。潮汐禁卫不挂任何大名家纹、也不打震旦皇室的龙旗——她们只认沈长风本人，「逆潮」提督的旗帜所指，便是她们挥刀的方向。每逢舰队的旗舰靠岸、敌阵当前，这些墨蓝甲衣的卫士总是最先列阵、最后撤离的一列；海风把她们的旗号吹得猎猎作响时，对手便知道，玉海舰队的提督今日亲自下场了。",
        en: "The admiral's own guard, one picked from a hundred Jade Sea Warriors. They carry naginata and yumi, and they hold Nippon's weather with the discipline of the old Cathayan navy. The Tide Guard fly no daimyo's kamon and no imperial dragon — they answer to Shen Changfeng and to nothing else; where the Countertide's banner points is where the blades go. When the flagship comes ashore with an enemy line in front of it, these ink-blue guards are the first rank formed and the last to withdraw. When the sea wind snaps their colours out, the other side knows the admiral has taken the field in person."
      },
      type: [
        kv("战场定位", "Battlefield role", { zh: "精英混合远程步兵（T3）", en: "Elite hybrid missile infantry (T3)" }),
        kv("兵种类别", "Category", { zh: "步兵", en: "Infantry" }),
        kv("作战类别", "Combat class", { zh: "混合（近战＋远程）", en: "Hybrid (melee + missile)" }),
        kv("护甲与盾牌", "Armour and shield", { zh: "护甲 70（锁子甲）；无盾", en: "Armour 70 (mail); no shield" }),
        kv("武器配置", "Weapons", { zh: "长柄刀（魔法近战，反大）＋和弓（魔法箭）", en: "Naginata (magical melee, anti-large) + yumi (magical arrows)" }),
        kv("训练等级", "Training", { zh: "训练有素", en: "Trained" })
      ],
      recruit: [
        kv("招募来源", "Recruited from", { zh: "舰队统帅厅（4 级）／玉海旗舰厅（5 级），游牧主城建筑链", en: "Fleet Command Hall (lv4) / Jade Sea Flagship Hall (lv5), on the nomadic capital chain" }),
        kv("解锁条件", "Unlocked by", { zh: "建至舰队统帅厅", en: "Build up to the Fleet Command Hall" }),
        kv("招募时间", "Recruit time", { zh: "2 回合", en: "2 turns" }),
        kv("数量限制", "Cap", { zh: "无上限（campaign_cap = -1）", en: "Uncapped (campaign_cap = -1)" })
      ],
      key: [
        { k: { zh: "护甲", en: "Armour" }, v: "70" },
        { k: { zh: "近战攻击", en: "Melee attack" }, v: "40" },
        { k: { zh: "近战防御", en: "Melee defence" }, v: "45" },
        { k: { zh: "领导力", en: "Leadership" }, v: "80" },
        { k: { zh: "射程", en: "Range" }, v: "160" },
        { k: { zh: "人数", en: "Model count" }, v: "80" }
      ],
      stats: [
        kv("近战攻击", "Melee attack", "40", "近战武器带魔法攻击", "Magical melee weapon"),
        kv("近战防御", "Melee defence", "45"),
        kv("近战武器威力（基础／破甲）", "Melee damage (base / AP)", "12 / 22", "自制长柄刀，反大 18", "Bespoke naginata, +18 vs large"),
        kv("对大型单位加成", "Bonus vs large", "18", "武器加成", "Weapon bonus"),
        kv("冲锋加成", "Charge bonus", "10"),
        kv("远程武器威力（基础／破甲）", "Missile damage (base / AP)", "13 / 17", "自制和弓，魔法箭", "Bespoke yumi with magical arrows"),
        kv("射程", "Range", "160"),
        kv("弹药", "Ammunition", "22"),
        kv("装填时间", "Reload", "10 秒"),
        kv("护甲", "Armour", "70"),
        kv("领导力", "Leadership", "80"),
        kv("速度", "Speed", "3.6", "DB run_speed 原值，游戏内显示 36", "Raw DB run_speed; shown in game as 36"),
        kv("单模型生命值", "Health per model", "88", "80 模型合计 7040", "7,040 across 80 models"),
        kv("人数 num_men", "num_men", "80", "精英小编制", "Small elite formation"),
        kv("抗性", "Resistance", "法术抗性 35%", "正值即减免", "Positive values reduce damage")
      ],
      tags: [
        { k: "caste", v: "missile_infantry" },
        { k: "category", v: "inf_ranged" },
        { k: "class", v: "inf_mis" },
        { k: "tier", v: "3" },
        { k: "training_level", v: "trained" },
        { k: "shield", v: "none" },
        { k: "spacing", v: "wh_main_infantry_ice_guard" },
        { k: "ai_usage_group", v: "hybrid_melee" }
      ],
      cost: { recruit: "1100", upkeep: "275" },
      traits: [
        kv("反大型部队", "Anti-large", { zh: "长柄刀近战对大型目标 +18", en: "+18 melee against large targets" }),
        kv("破甲杀伤", "Armour-piercing", { zh: "近战与远程均以破甲为主", en: "Both melee and missile lean armour-piercing" }),
        kv("混合武器部队", "Hybrid unit", { zh: "可在远程射击与近战之间切换", en: "Switches between shooting and melee" }),
        kv("装备重甲", "Armoured", { zh: "护甲 70", en: "Armour 70" }),
        kv("宁和：阴", "Harmony: Yin", { zh: "作为阴相单位参与阴阳宁和", en: "Counts as a Yin unit for Harmony" })
      ],
      passives: [
        kv("阴阳宁和：阴", "Harmony: Yin", { zh: "阴阳宁和生效时：速度 +4%、领导力 +4、装填技能 +12", en: "While Harmony applies: +4% speed, +4 leadership, +12 reload skill" })
      ],
      actives: [],
      spells: [],
      attrs: [
        kv("抵御冲锋（大型部队）", "Charge defence vs large", { zh: "抵御大型敌人的冲锋", en: "Resists charges from large enemies" }),
        kv("冲锋反制", "Counter-charge", { zh: "遭受冲锋时进行反制", en: "Counters incoming charges" }),
        kv("于森林中隐蔽", "Hide in forest", { zh: "步兵通用", en: "Standard for infantry" }),
        kv("心理免疫", "Immune to psychology", { zh: "免疫恐惧／惊骇等心理效果", en: "Immune to fear and terror" }),
        kv("精力充沛", "Vigorous", { zh: "免疫疲劳", en: "Immune to fatigue" })
      ]
    },
    {
      slug: "empyrean-guard",
      name: { zh: "云霄禁卫", en: "Empyrean Guard" },
      group: "fleet",
      status: "pending",
      card: "assets/unit/empyrean-guard.png",
      role: { zh: "舰队骑兵（海龙马）", en: "Fleet cavalry — Sea Longma" },
      desc: { zh: "带有独特的定时魔法技能「天河倾」。", en: "Carries a timed magic ability of its own, The Heavenly River Tips." },
      recruit: [kv("招募来源", "Recruited from", { zh: "旗舰建筑树；v1.0.3 起沈长风开局自带", en: "The flagship building tree; in Shen Changfeng's starting army since v1.0.3" })]
    },
    {
      slug: "yari-samurai",
      name: { zh: "长枪武士", en: "Yari Samurai" },
      group: "nippon",
      status: "pending",
      card: "assets/unit/yari-samurai.png",
      role: { zh: "尼朋长枪步兵", en: "Nipponese spear infantry" },
      recruit: [kv("招募来源", "Recruited from", { zh: "侍所链 · 番所（2 级定居点起）；立花直虎第壹章解锁", en: "Samurai Hall chain — Watch Post, from a level 2 settlement; unlocked by Naotora's chapter I" })]
    },
    {
      slug: "teppo-samurai",
      name: { zh: "铁炮武士", en: "Teppo Samurai" },
      group: "nippon",
      status: "pending",
      card: "assets/unit/teppo-samurai.png",
      role: { zh: "尼朋火器步兵", en: "Nipponese gunpowder infantry" },
      recruit: [kv("招募来源", "Recruited from", { zh: "侍所链 · 侍所；立花直虎第贰章解锁", en: "Samurai Hall chain — Samurai Hall; unlocked by Naotora's chapter II" })]
    },
    {
      slug: "thunderblade-hatamoto",
      name: { zh: "雷刃旗本", en: "Hatamoto of the Thunderblade" },
      group: "nippon",
      status: "live",
      card: "assets/unit/thunderblade-hatamoto.png",
      kamon: "assets/kamon/hatamoto.png",
      role: { zh: "精锐近战步兵（大名近卫 / T4）", en: "Elite melee infantry — Daimyo's guard, T4" },
      desc: {
        zh: "大名直属的精锐武士，持雷神赐福的大太刀。刀身紫电缠绕，一挥可斩铁裂甲。",
        en: "Elite samurai answering to the daimyo himself, bearing nodachi blessed by Raijin. Violet lightning crawls along the blade; one stroke cuts iron and splits armour."
      },
      story: {
        zh: "旗本是武士中的武士。他们受大名直接统辖、世袭其位的近卫，非百战之功不得入列。所执的大太刀逾寻常太刀之长，须以双手挥舞，本是阵前斩马破甲的重器。其中一脉承雷神之契：相传昔日一位剑圣于雷暴之夜登峰参悟，以身试雷，引天火入刀，自此后人与门徒所持之刃皆具唤雷之能。刀出鞘时紫电自刃脊游走，挥斩之际雷光随刀锋迸裂；此非术士之法，而是以血肉之躯承雷霆、以剑技驭雷威的武道。旗本以剑技为根本，经年苦修，一刀之威已胜寻常武士数合，雷神之力不过为这极致剑技添上最后一道锋芒。两军阵前，见紫电破阵而来者，皆知旗本至矣。",
        en: "The hatamoto are samurai among samurai: hereditary guards under the daimyo's own hand, admitted only on the strength of a hundred battles. Their nodachi run longer than any tachi and must be swung two-handed — weapons made to cut down horses and open armour. One line of them holds a covenant with the thunder god: a swordmaster is said to have climbed a peak on a storming night, taken the lightning into his body and drawn the heavenly fire into his blade, and every heir and student since has carried a sword that can call it. Violet current walks the spine of the drawn blade, and the light bursts along the edge as the cut lands. This is not a sorcerer's art but a martial one — flesh taking the thunder, swordsmanship steering it. The blade comes first: years of it, until one stroke is worth several exchanges from a lesser samurai, and the thunder god's gift only adds the last edge. When the violet light comes through the line, both armies know the hatamoto have arrived."
      },
      type: [
        kv("战场定位", "Battlefield role", { zh: "精锐近战步兵（大名近卫 / T4）", en: "Elite melee infantry (Daimyo's guard / T4)" }),
        kv("兵种类别", "Category", { zh: "步兵", en: "Infantry" }),
        kv("作战类别", "Combat class", { zh: "近战", en: "Melee" }),
        kv("护甲与盾牌", "Armour and shield", { zh: "板甲 100；无实体盾牌，30% 斩箭远程格挡", en: "Plate 100; no physical shield, 30% missile block" }),
        kv("武器配置", "Weapons", { zh: "双手大太刀（魔法近战，破甲为主）", en: "Two-handed nodachi (magical melee, armour-piercing)" }),
        kv("训练等级", "Training", { zh: "训练有素", en: "Trained" })
      ],
      recruit: [
        kv("招募来源", "Recruited from", {
          zh: "侍大将屋形（2 级）／旗本番（2 级）／引雷之峰（地标）；另可经立花直虎的同伴面板以名望征召",
          en: "Warrior's Manor (lv2) / Hatamoto Guard (lv2) / Thunder-Drawing Peak (landmark); also mustered with Renown from Naotora's companion panel"
        }),
        kv("解锁条件", "Unlocked by", { zh: "建成上述任一建筑；同伴征召随羁绊档位解锁并给容量", en: "Any of those buildings; companion muster unlocks with bond tier, which also grants capacity" }),
        kv("招募时间", "Recruit time", { zh: "2 回合", en: "2 turns" }),
        kv("数量限制", "Cap", { zh: "建筑招募无上限；同伴征召容量随羁绊档位", en: "Uncapped from buildings; companion capacity scales with bond tier" })
      ],
      key: [
        { k: { zh: "护甲", en: "Armour" }, v: "100" },
        { k: { zh: "近战攻击", en: "Melee attack" }, v: "52" },
        { k: { zh: "近战防御", en: "Melee defence" }, v: "45" },
        { k: { zh: "领导力", en: "Leadership" }, v: "90" },
        { k: { zh: "冲锋加成", en: "Charge bonus" }, v: "32" },
        { k: { zh: "人数", en: "Model count" }, v: "80" }
      ],
      stats: [
        kv("近战攻击", "Melee attack", "52", "带魔法攻击（武器附魔）", "Magical attacks (enchanted weapon)"),
        kv("近战防御", "Melee defence", "45"),
        kv("近战武器威力（基础／破甲）", "Melee damage (base / AP)", "22 / 35", "破甲为主", "Mostly armour-piercing"),
        kv("对大型单位加成", "Bonus vs large", "14"),
        kv("冲锋加成", "Charge bonus", "32"),
        kv("远程武器威力", "Missile damage", "—"),
        kv("射程", "Range", "—"),
        kv("弹药", "Ammunition", "—"),
        kv("装填时间", "Reload", "—"),
        kv("护甲", "Armour", "100"),
        kv("领导力", "Leadership", "90"),
        kv("速度", "Speed", "3.1", "DB run_speed 原值，游戏内显示 31", "Raw DB run_speed; shown in game as 31"),
        kv("单模型生命值", "Health per model", "139", "80 模型合计 11120", "11,120 across 80 models"),
        kv("人数 num_men", "num_men", "80", "精锐小编制", "Small elite formation"),
        kv("抗性", "Resistance", "法术抗性 25%", "正值即减免", "Positive values reduce damage")
      ],
      tags: [
        { k: "caste", v: "melee_infantry" },
        { k: "category", v: "inf_melee" },
        { k: "class", v: "inf_mel" },
        { k: "tier", v: "4" },
        { k: "training_level", v: "trained" },
        { k: "shield", v: "wh_missile_block_30_inaudible" },
        { k: "man_animation", v: "hu1d_def_2handed_sword" },
        { k: "spacing", v: "wh_main_infantry_2handed" },
        { k: "ai_usage_group", v: "melee" },
        { k: "ui_unit_group_land", v: "infantry_sword_great" }
      ],
      cost: { recruit: "1500", upkeep: "375" },
      traits: [
        kv("装备重甲", "Armoured", { zh: "护甲 100 达重甲阈值", en: "Armour 100 meets the armoured threshold" }),
        kv("破甲杀伤", "Armour-piercing", { zh: "大太刀破甲 35 为主", en: "The nodachi deals 35 armour-piercing damage" }),
        kv("斩箭术", "Blade-block", { zh: "30% 远程格挡——以剑技拨落箭矢，非盾牌格挡，故双手大太刀仍可挡箭", en: "30% missile block — arrows knocked down by swordsmanship rather than a shield, so a two-handed blade still blocks" })
      ],
      passives: [
        kv("武士道", "Bushido", { zh: "生命值降至 50% 或以下时自动激活：基础／破甲武器杀伤 +15%、近战攻击 +10、永不败逃，持续 25 秒。与长枪武士共享", en: "Triggers at 50% health or below: +15% base and AP weapon damage, +10 melee attack, unbreakable, for 25 seconds. Shared with Yari Samurai" }),
        kv("人剑合一", "One with the blade", { zh: "生命值高于 25% 时常驻：近战攻击 +10、近战防御 +10，生命跌破 25% 自动失效", en: "Active above 25% health: +10 melee attack, +10 melee defence; lapses below 25%" })
      ],
      actives: [],
      spells: [],
      attrs: [
        kv("引发恐惧", "Causes fear", { zh: "对周围敌军施加恐惧", en: "Inflicts fear on nearby enemies" }),
        kv("于森林中隐蔽", "Hide in forest", { zh: "步兵通用", en: "Standard for infantry" }),
        kv("心理免疫", "Immune to psychology", { zh: "免疫恐惧／惊骇等心理效果（卡片不显示）", en: "Immune to fear and terror (not shown on the unit card)" }),
        kv("精力充沛", "Vigorous", { zh: "免疫疲劳", en: "Immune to fatigue" })
      ]
    },
    {
      slug: "inari-fox",
      name: { zh: "稻荷灵狐使者", en: "Inari Fox Emissary" },
      group: "nippon",
      status: "pending",
      card: "assets/unit/inari-fox.png",
      role: { zh: "尼朋神使", en: "Nipponese shrine emissary" },
      recruit: [kv("招募来源", "Recruited from", { zh: "神社链 · 稻荷神社；纱代第壹章解锁", en: "Shrine chain — Inari Shrine; unlocked by Sayo's chapter I" })]
    },
    {
      slug: "kirin",
      name: { zh: "麒麟", en: "Kirin" },
      group: "nippon",
      status: "pending",
      card: "assets/unit/kirin.png",
      role: { zh: "尼朋灵兽", en: "Nipponese divine beast" },
      recruit: [kv("招募来源", "Recruited from", { zh: "神社链 · 灵兽神宫；纱代第叁章解锁。招募 2 回合", en: "Shrine chain — Divine Beast Sanctuary; unlocked by Sayo's chapter III. 2 turns to recruit" })]
    }
  ];

  /* ─────────── 人物 ─────────── */
  function node(id, name, en, o) {
    o = o || {};
    o.id = id;
    o.name = { zh: name, en: en };
    return o;
  }

  S.chars = [
    {
      slug: "shen-changfeng",
      rank: "legendary-lord",
      rankLabel: { zh: "传奇领主", en: "Legendary Lord" },
      name: { zh: "沈长风", en: "Shen Changfeng" },
      epithet: { zh: "无冕提督", en: "the Uncrowned Admiral" },
      portrait: "assets/portrait/shen_changfeng.png",
      porthole: "assets/porthole/shen_changfeng.png",
      desc: { zh: "震旦海军的提督，玉海剑圣。她对来犯之敌绝不留情。", en: "An admiral of the Cathayan navy and the Jade Sea's swordmaster. She gives an aggressor nothing." },
      story: {
        zh: "沈长风是卫东列省战功最显赫的提督。胤隐失踪后，尼朋海盗再度犯境。她率领舰队越界追击，直至尼朋领海，大获全胜，却同时击沉了数艘尼朋官方战舰。凯旋的捷报与尼朋的抗议同日送抵朝廷，朝廷却有人趁胤隐失踪从中作梗，以北面长垣战事吃紧，不应招惹尼朋人而下了问罪诏书，要求收回兵权。诏令已至，她没有奉旨回京，而是带着愿意追随她的战士们扬帆出海，径直航向尼朋。",
        en: "The most decorated admiral of the Eastern Provinces. After Yin-Yin went missing the Nipponese pirates came back, and Shen Changfeng chased them across the border into Nippon's own waters. She won outright — and sank several of Nippon's official warships doing it. The report of victory and Nippon's protest reached the court the same day, and with Yin-Yin gone someone there used the pressure on the northern Wall as reason to indict her and take her command. The writ came. She did not answer it: she put to sea with the soldiers willing to follow her and sailed straight for Nippon."
      },
      identity: [
        kv("角色位阶", "Rank", { zh: "传奇领主", en: "Legendary Lord" }),
        kv("定位", "Class", { zh: "法师（Wizard），兼具近战武将身手", en: "Wizard, with a melee general's hands" }),
        kv("法系", "Lores", { zh: "深渊系、阳系", en: "Lore of the Deep, Lore of Yang" })
      ],
      recruit: [
        kv("招募来源", "Source", { zh: "战役初始自带（阵营领主）", en: "Starts the campaign as faction leader" }),
        kv("解锁条件", "Unlocked by", { zh: "无", en: "None" }),
        kv("数量限制", "Cap", { zh: "唯一", en: "Unique" }),
        kv("招募费 / 维持费", "Cost / upkeep", { zh: "不适用", en: "N/A" })
      ],
      formsNote: {
        zh: "徒步、骑玉龙马与骑凌涛是三个独立的战斗形态，装备坐骑即整体切换形态，数值不叠加。",
        en: "On foot, on the Jade Longma and on Tidestrider are three separate combat forms. Equipping a mount swaps the whole form; the numbers do not stack."
      },
      forms: [
        { zh: "徒步", en: "On foot" },
        { zh: "骑玉龙马", en: "Jade Longma" },
        { zh: "骑凌涛", en: "Tidestrider" }
      ],
      statRows: [
        { k: { zh: "护甲", en: "Armour" }, v: ["90", "90", "120"] },
        { k: { zh: "近战攻击", en: "Melee attack" }, v: ["65", "65", "65"] },
        { k: { zh: "近战防御", en: "Melee defence" }, v: ["45", "45", "45"] },
        { k: { zh: "武器威力（基础／破甲）", en: "Weapon damage (base / AP)" }, v: ["150 / 300", "150 / 300", "150 / 300"] },
        { k: { zh: "冲锋加成", en: "Charge bonus" }, v: ["40", "70", "85"] },
        { k: { zh: "生命值", en: "Health" }, v: ["5064", "6064", "6664"] },
        { k: { zh: "领导力", en: "Leadership" }, v: ["85", "85", "85"] },
        { k: { zh: "速度", en: "Speed" }, v: ["38", "82 / 105", "82 / 105"] }
      ],
      statNote: {
        zh: "特殊属性 —— 徒步：魔法攻击／阳系施法；于森林中隐蔽。两个骑乘形态：魔法攻击／阳系施法；可以飞行；引发恐惧。速度栏「82 / 105」为跑动／飞行。",
        en: "Special: on foot — magical attacks, Yang casting, hides in forest. Both mounted forms — magical attacks, Yang casting, flying, causes fear. Speed \"82 / 105\" is running / flying."
      },
      weapons: [
        {
          k: { zh: "「镇澜」佩枪与「逆潮」名刀", en: "Zhenlan the pistol and Countertide the blade" },
          v: {
            zh: "150／300，魔法攻击；对大型 +20。",
            en: "150 / 300, magical; +20 against large."
          }
        }
      ],
      mounts: [
        {
          k: { zh: "玉龙马", en: "Jade Longma" },
          v: { zh: "飞行坐骑；冲锋 +30、生命值 +1000；可以飞行、引发恐惧；不再能于森林中隐蔽", en: "Flying mount: +30 charge, +1000 health, flight and fear; loses hide in forest" }
        },
        {
          k: { zh: "凌涛", en: "Tidestrider" },
          v: { zh: "终极飞行坐骑：护甲升至 120、冲锋 85、生命值再 +600；其余差异同玉龙马；获得形态绑定被动「潮随刃动」", en: "Ultimate flying mount: armour to 120, charge 85, another +600 health; otherwise as the Jade Longma; grants the form-bound passive Tide Follows the Blade" }
        }
      ],
      traits: [
        kv("宁和化生：+50%", "Harmony conversion: +50%", { zh: "全形态", en: "All forms" }),
        kv("法术吟唱者", "Spellcaster", { zh: "全形态", en: "All forms" }),
        kv("近战专家", "Melee expert", { zh: "全形态", en: "All forms" }),
        kv("重甲", "Armoured", { zh: "全形态", en: "All forms" }),
        kv("可以飞行", "Flying", { zh: "仅两个骑乘形态", en: "Mounted forms only" })
      ],
      passives: [
        { k: { zh: "龙之意志", en: "Will of the Dragon" }, form: { zh: "全部形态", en: "All forms" }, v: { zh: "光环内友军领导力 +4（原版震旦领主通用被动）", en: "+4 leadership to allies in the aura (standard Cathay lord passive)" } },
        { k: { zh: "奥术导管", en: "Arcane Conduit" }, form: { zh: "全部形态", en: "All forms" }, v: { zh: "提升魔法之风储备的回复速度（法师通用被动）", en: "Faster Winds of Magic reserve recovery (standard wizard passive)" } },
        { k: { zh: "潮随刃动", en: "Tide Follows the Blade" }, form: { zh: "仅骑凌涛", en: "Tidestrider only" }, v: { zh: "陷入近战后开始充能，首次约 10 秒、其后每 15 秒自动向身前掀起一次浪涌，每次伤害 33（其中 11 破甲）；只伤敌，不误伤己方；脱离近战即停止充能", en: "Charges once in melee: a surge in front of her after roughly 10 seconds and every 15 thereafter, 33 damage each (11 of it armour-piercing), enemies only. Charging stops when she leaves melee" } }
      ],
      actives: [],
      attrs: [
        kv("激励友军", "Encouraging", { zh: "全形态；提升周围友军领导力", en: "All forms; raises nearby allied leadership" }),
        kv("精气之风精通", "Winds of Qi mastery", { zh: "全形态；军中多支部队共有此属性时，法术威力提升", en: "All forms; magic power rises when several units in the army share it" })
      ],
      gear: {
        zh: "两件、套装「镇澜·逆潮」：附魔物品「镇澜」（Lv7 自动获得）＋武器「逆潮」（Lv12 自动获得）。",
        en: "Two pieces forming the Zhenlan & Countertide set: the enchanted item Zhenlan at level 7, and the weapon Countertide at level 12. Both are granted automatically."
      },
      tree: {
        note: {
          zh: "下列只收本 mod 原创的分支，战斗、魔法、军团、战役等原版复用链不在此列。各分支独立推进、互不阻塞，前置条件写在每个节点名下；「需 N/M」= M 个并行父节点中至少点 N 个。",
          en: "Only this mod's original branches are listed; the reused vanilla chains — combat, magic, army, campaign — are not. Branches advance independently and never block one another; each node states its own prerequisite, and \"N/M\" means at least N of M parallel parents."
        },
        branches: [
          {
            id: "trait",
            label: { zh: "特性", en: "Trait" },
            sub: { zh: "开局自带", en: "From the start" },
            cols: [[node("zhenhai", "镇海提督", "Admiral of the Quelled Sea", {
              tier: 0,
              icon: "assets/skill/changfeng_powo.png",
              unlock: { zh: "开局自带 · 单级", en: "From the start · single rank" },
              desc: { zh: "玉海舰队的统帅受到远东海洋的庇护。", en: "The Jade Sea Fleet's commander is under the far eastern ocean's protection." },
              effects: [
                { zh: "免疫高海、礁石与风暴海域损耗", en: "Immune to attrition in deep sea, reefs and storms" },
                { zh: "战略地图移动距离：在海上时 +10%", en: "+10% campaign movement range while at sea" },
                { zh: "维持费：玉海潮勇、舰队铳手、潮汐禁卫、云霄禁卫 −15%", en: "−15% upkeep for Jade Sea Warriors, Fleet Gunners, Tide Guard and Empyrean Guard" },
                { zh: "潮汐禁卫、云霄禁卫近战威力 +10%；潮汐禁卫远程威力 +10%", en: "+10% melee damage for Tide Guard and Empyrean Guard; +10% missile damage for Tide Guard" }
              ]
            })]]
          },
          {
            id: "unique",
            label: { zh: "个人专属线", en: "Unique line" },
            sub: { zh: "完全原创", en: "Wholly original" },
            cols: [
              [node("swordmaster", "玉海剑圣", "Jade Sea Swordmaster", {
                tier: 0,
                icon: "assets/skill/jade_swordmaster.png",
                unlock: { zh: "8 级解锁 · 单级", en: "Level 8 · single rank" },
                desc: { zh: "真正的剑圣往往精通数种不同的武器，比如刀剑和长枪。", en: "A true swordmaster usually knows several weapons — the blade and the spear among them." },
                effects: [
                  { zh: "自身近战攻击 +8、近战防御 +6", en: "+8 melee attack, +6 melee defence for herself" },
                  { zh: "解锁战场主动技「玉海剑舞」：武器杀伤 ×1.25、近战攻击 +10、近战防御 +10、远程格挡 +25%，持续 25 秒／冷却 90 秒，仅自身，无限次", en: "Unlocks the battle ability Jade Blade Dance: ×1.25 weapon damage, +10 melee attack, +10 melee defence, +25% missile block, 25s duration / 90s cooldown, self only, unlimited uses" }
                ]
              })],
              [
                node("oldguard", "玉海旧部", "Jade Sea Veterans", {
                  tier: 1,
                  unlock: { zh: "前置：玉海剑圣", en: "Requires Jade Sea Swordmaster" },
                  desc: { zh: "随提督征战的老兵们身经百战。", en: "The veterans who sailed with the admiral have been through a hundred fights." },
                  effects: [{ zh: "玉海潮勇、舰队铳手、潮汐禁卫、云霄禁卫获得领导力 +5、近战攻击 +8、近战防御 +6", en: "+5 leadership, +8 melee attack, +6 melee defence for Jade Sea Warriors, Fleet Gunners, Tide Guard and Empyrean Guard" }]
                }),
                node("powder", "枪炮与魔法", "Powder and Sorcery", {
                  tier: 2,
                  icon: "assets/skill/powder_sorcery.png",
                  unlock: { zh: "前置：玉海剑圣 · v1.0.3 新增", en: "Requires Jade Sea Swordmaster · added in v1.0.3" },
                  desc: { zh: "「要火药还是魔法？」——「为何不能都要？」", en: "\"Powder or sorcery?\" — \"Why not both?\"" },
                  effects: [
                    { zh: "舰队铳手、潮汐禁卫、沧溟巨炮远程武器威力 +10%（基础与破甲）", en: "+10% missile damage, base and AP, for Fleet Gunners, Tide Guard and Abyssal Grand Cannon" },
                    { zh: "同上弹药 +20%", en: "+20% ammunition for the same units" },
                    { zh: "沈长风法术强度 +10%", en: "+10% magic power for Shen Changfeng herself" }
                  ]
                }),
                node("kendo", "剑道导师", "Master of the Way of the Sword", {
                  tier: 3,
                  unlock: { zh: "前置：玉海剑圣", en: "Requires Jade Sea Swordmaster" },
                  desc: { zh: "震旦的剑法在尼朋的战士之间仍然通用。", en: "Cathayan swordsmanship still carries among Nippon's warriors." },
                  effects: [{ zh: "长枪武士、铁炮武士、雷刃旗本获得领导力 +8、近战攻击 +6、近战防御 +4", en: "+8 leadership, +6 melee attack, +4 melee defence for Yari Samurai, Teppo Samurai and Thunderblade Hatamoto" }]
                }),
                node("seamanship", "震旦航海术", "Cathayan Seamanship", {
                  tier: 4,
                  unlock: { zh: "前置：玉海剑圣", en: "Requires Jade Sea Swordmaster" },
                  effects: [
                    { zh: "战胜后恢复 10% 战役移动力", en: "Recover 10% campaign movement after a victory" },
                    { zh: "战役海上移动距离 +10%", en: "+10% campaign movement at sea" },
                    { zh: "贸易货物收益 +20%", en: "+20% income from trade goods" },
                    { zh: "己方行省海路贸易产值（即港口产值）+10%", en: "+10% sea-trade GDP in your own provinces, i.e. port income" }
                  ]
                }),
                node("strategist", "战略大师", "Master Strategist", {
                  tier: 5,
                  unlock: { zh: "前置：玉海剑圣", en: "Requires Jade Sea Swordmaster" },
                  desc: { zh: "先发制人，攻其不备。", en: "Strike first; strike where they are not ready." },
                  effects: [
                    { zh: "全军解锁先锋部署", en: "Vanguard deployment for the whole army" },
                    { zh: "伏击成功率 +20%", en: "+20% ambush success chance" }
                  ]
                })
              ],
              [node("uncrowned", "无冕之师", "The Uncrowned Host", {
                tier: 6,
                hub: "3/5",
                icon: "assets/skill/old_guard.png",
                unlock: { zh: "需前 5 个并行节点中点出 3 个", en: "Requires 3 of the 5 parallel nodes" },
                desc: { zh: "虽已不受朝廷承认，但仍是远东海域最为强大的水师。", en: "No longer acknowledged by the court, and still the strongest navy in the far eastern sea." },
                effects: [
                  { zh: "战胜后恢复 10% 战役移动力", en: "Recover 10% campaign movement after a victory" },
                  { zh: "本军队武器威力 +10%、远程威力 +10%", en: "+10% weapon damage and +10% missile damage for this army" }
                ]
              })]
            ]
          },
          {
            id: "wavebreak",
            label: { zh: "破浪支线", en: "Wave-breaker branch" },
            sub: { zh: "独立支线，不需要无冕之师作前置", en: "Independent; the Uncrowned Host is not a prerequisite" },
            cols: [
              [node("wavelord", "破浪之帅", "Marshal Through the Waves", {
                tier: 7,
                icon: "assets/skill/wave_breaker.png",
                unlock: { zh: "15 级解锁 · 支线起点", en: "Level 15 · start of the branch" },
                effects: [
                  { zh: "本军队补员 +5%", en: "+5% replenishment for this army" },
                  { zh: "全军维护费 −10%", en: "−10% upkeep across all armies" }
                ]
              })],
              [node("longwind", "万里长风", "Ten Thousand Miles of Wind", {
                tier: 8,
                icon: "assets/skill/long_wind.png",
                unlock: { zh: "前置：破浪之帅", en: "Requires Marshal Through the Waves" },
                desc: { zh: "凌云破浪，万里长风。", en: "Over the clouds, through the waves, ten thousand miles of wind." },
                effects: [
                  { zh: "领主自身启用【不溃】", en: "Unbreakable for the lord herself" },
                  { zh: "本军队领导力 +8", en: "+8 leadership for this army" },
                  { zh: "战役移动力 +15%", en: "+15% campaign movement" }
                ]
              })]
            ]
          },
          {
            id: "mount",
            label: { zh: "坐骑", en: "Mounts" },
            sub: { zh: "孤立节点，到等级自动获得", en: "Isolated nodes, granted on reaching the level" },
            cols: [[
              node("longma", "玉龙马", "Jade Longma", {
                tier: 0,
                unlock: { zh: "角色等级 7 自动获得", en: "Automatic at level 7" },
                effects: [{ zh: "解锁坐骑形态", en: "Unlocks the mounted form" }]
              }),
              node("tidestrider", "凌涛", "Tidestrider", {
                tier: 0,
                unlock: { zh: "角色等级 16 自动获得", en: "Automatic at level 16" },
                desc: { zh: "吸收了海元素的玉龙马，被海军视作能够凌云破浪的祥瑞坐骑。", en: "A Jade Longma that has taken in the sea's element; the navy reads it as the auspicious mount that rides over cloud and wave." },
                effects: [
                  { zh: "解锁终极骑乘形态", en: "Unlocks the ultimate mounted form" },
                  { zh: "骑乘期间战场被动「潮随刃动」（伤害 22＋11 破甲、每 15 秒，仅伤敌）", en: "While mounted, the battle passive Tide Follows the Blade: 22 damage plus 11 AP every 15 seconds, enemies only" }
                ]
              })
            ]]
          },
          {
            id: "relic",
            label: { zh: "神器", en: "Relics" },
            sub: { zh: "隐藏节点：不走技能树 UI，到等级直接发神器", en: "Hidden nodes: not shown in the skill-tree UI; the item is granted on reaching the level" },
            cols: [[
              node("zhenlan", "镇澜", "Zhenlan", {
                tier: 0,
                hidden: true,
                icon: "assets/skill/zhenlan.png",
                unlock: { zh: "角色等级 7 自动发神器", en: "Granted automatically at level 7" },
                desc: { zh: "她实际使用的另一件兵器。", en: "The other weapon she actually carries." },
                effects: [{ zh: "授予神器「镇澜」，数值全在 ancillary 上", en: "Grants the relic Zhenlan; all its numbers sit on the ancillary" }]
              }),
              node("countertide", "逆潮", "Countertide", {
                tier: 0,
                hidden: true,
                icon: "assets/skill/nichao.png",
                unlock: { zh: "角色等级 12 自动发神器", en: "Granted automatically at level 12" },
                desc: { zh: "名刀「逆潮」的武技延伸，呼应 magic 线的两个深渊系法术。", en: "The martial extension of the blade Countertide, answering the two Lore of the Deep spells on the magic branch." },
                effects: [{ zh: "近战攻击 +10／武器强度 +15／战后掠夺 +10%，另带专属主动技", en: "+10 melee attack, +15 weapon strength, +10% post-battle loot, plus a unique active ability" }]
              })
            ]]
          },
          {
            id: "combat",
            label: { zh: "战斗", en: "Combat" },
            sub: { zh: "复用通用自身强化链，龙形专属节点以人形等价物替代", en: "Reused generic self-buff chain; dragon-form nodes swapped for human equivalents" },
            reuse: true,
            cols: [
              [node("c0", "剑术大师", "Blade Master", { reuse: true, tier: 0, unlock: { zh: "起点", en: "Starter" } })],
              [
                node("c1", "致命冲锋", "Deadly Charge", { reuse: true }),
                node("c2", "躲闪腾挪", "Dodging", { reuse: true }),
                node("c3", "疤面老兵", "Scarred Veteran", { reuse: true }),
                node("c4", "全身板甲", "Full Plate", { reuse: true, note: { zh: "替代龙形位", en: "Replaces a dragon-form node" } })
              ],
              [node("c5", "索敌者", "Foe-Seeker", { reuse: true, hub: "4/4" })],
              [
                node("c6", "杀伤猛士", "Wound-Maker", { reuse: true }),
                node("c7", "健步如飞", "Fleet-Footed", { reuse: true, note: { zh: "替代龙形位", en: "Replaces a dragon-form node" } }),
                node("c8", "致命利刃", "Deadly Blades", { reuse: true, note: { zh: "替代龙形位", en: "Replaces a dragon-form node" } }),
                node("c9", "坚韧", "Resilience", { reuse: true })
              ],
              [node("c10", "致命猛攻", "Deadly Onslaught", { reuse: true, hub: "4/4" })]
            ]
          },
          {
            id: "magic",
            label: { zh: "魔法", en: "Magic" },
            sub: { zh: "阳系为主，两个位置点缀深渊系 —— 名刀「逆潮」带来的越界力量", en: "Mostly Yang, with two Lore of the Deep nodes — the borrowed power the blade Countertide brings" },
            reuse: true,
            cols: [
              [node("m0", "海潮之唤", "Call of the Tide", { reuse: true, tier: 0, unlock: { zh: "起点 · 开局自带 L1", en: "Starter · rank 1 from the start" }, note: { zh: "L2 仍需玩家自购：冷却 −50%、失控 −15%、风耗 −1/−2", en: "Rank 2 must still be bought: −50% cooldown, −15% miscast, −1/−2 winds" } })],
              [
                node("m1", "阳之强", "Strength of Yang", { reuse: true }),
                node("m2", "翠御诀", "Jade Ward", { reuse: true }),
                node("m3", "风火诀", "Wind and Fire", { reuse: true }),
                node("m4", "坚岩诀", "Stone Rite", { reuse: true })
              ],
              [node("m5", "闪避", "Evasion", { reuse: true, hub: "4/4" })],
              [
                node("m6", "瓦格赫斯特的复仇", "Vaghast's Revenge", { reuse: true, note: { zh: "深渊系点缀位", en: "Lore of the Deep accent" } }),
                node("m7", "龙星诀", "Dragon Star", { reuse: true }),
                node("m8", "缚风大地", "Earthing", { reuse: true }),
                node("m9", "魔力储备", "Power Drain", { reuse: true })
              ],
              [node("m10", "奥术导管", "Arcane Conduit", { reuse: true, hub: "4/4" })]
            ]
          },
          {
            id: "army",
            label: { zh: "军团", en: "Army" },
            sub: { zh: "原样复用震旦领主军团链", en: "Cathay lord army chain, reused as-is" },
            reuse: true,
            cols: [
              [node("a0", "威风凛凛", "Inspiring Presence", { reuse: true, tier: 0, unlock: { zh: "起点", en: "Starter" } })],
              [
                node("a1", "宁折不弯", "Unyielding", { reuse: true }),
                node("a2", "控弦破的", "True Aim", { reuse: true }),
                node("a3", "东方业炎", "Eastern Flame", { reuse: true }),
                node("a4", "势若奔雷", "Like Thunder", { reuse: true }),
                node("a5", "坚岩凝视", "Stone Gaze", { reuse: true }),
                node("a6", "苍穹之火", "Fire of Heaven", { reuse: true })
              ],
              [node("a7", "重整", "Rally", { reuse: true, hub: "6/6" })],
              [
                node("a8", "军团强化 1", "Army buff 1", { reuse: true }),
                node("a9", "军团强化 2", "Army buff 2", { reuse: true }),
                node("a10", "军团强化 3", "Army buff 3", { reuse: true }),
                node("a11", "军团强化 4", "Army buff 4", { reuse: true })
              ],
              [node("a12", "坚守阵地", "Stand Your Ground", { reuse: true, hub: "1/4" })]
            ]
          },
          {
            id: "campaign",
            label: { zh: "战役", en: "Campaign" },
            sub: { zh: "原样复用震旦领主战役链", en: "Cathay lord campaign chain, reused as-is" },
            reuse: true,
            cols: [
              [node("p0", "赶路人", "Route Marcher", { reuse: true, tier: 0, unlock: { zh: "起点", en: "Starter" } })],
              [
                node("p1", "钢铁纪律", "Iron Disciplinarian", { reuse: true }),
                node("p2", "荣誉招募", "Honourable Recruit", { reuse: true }),
                node("p3", "鼓舞军心", "Reassuring Presence", { reuse: true }),
                node("p4", "无限热忱", "Fervent", { reuse: true })
              ],
              [node("p5", "战欲难抑", "Eager for Battle", { reuse: true, hub: "4/4" })],
              [
                node("p6", "闪击战", "Lightning Strike", { reuse: true }),
                node("p7", "军需官", "Quartermaster", { reuse: true }),
                node("p8", "后勤官", "Logistician", { reuse: true }),
                node("p9", "警戒", "Alert", { reuse: true })
              ],
              [node("p10", "战役 capstone", "Campaign capstone", { reuse: true, hub: "4/4" })]
            ]
          }
        ]
      }
    },
    {
      slug: "naotora",
      rank: "legendary-hero",
      rankLabel: { zh: "传奇英雄 · 远征同伴", en: "Legendary Hero · Companion" },
      name: { zh: "立花直虎", en: "Tachibana Naotora" },
      epithet: { zh: "战鬼", en: "the Ghost" },
      portrait: "assets/portrait/naotora.png",
      porthole: "assets/porthole/naotora.png",
      scene: "assets/scene/naotora.png",
      kamon: "assets/kamon/hatamoto.png",
      desc: { zh: "近战突击向传奇英雄，双刀「紫电」的剑豪当主。", en: "A melee-assault legendary hero: the swordmaster head of a house, wielding the paired blades Shiden." },
      story: {
        zh: "立花家曾是尼朋名门。家中没有男嗣，直虎年少继了家督，提着双刀带旗本出征。直虎从小和旗本接受一样的训练。在尼朋内战中，立花家所属的派系战败，家族领地被没收。直虎在被囚禁为人质之前逃出了城门。然而内战落幕后的尼朋并没有长久的太平。在尼朋大名们人马疲惫之时，混沌与绿皮登上了尼朋列岛，开始了对这里的侵略。直虎从此戴上鬼面化身战鬼，以自己的方式守护无辜之人。",
        en: "The Tachibana were a name in Nippon. With no male heir, Naotora took the headship young and led the hatamoto out with a blade in each hand — she had trained alongside them since childhood. Her faction lost the civil war and the domain was confiscated; she got out of the gate before they could hold her hostage. The peace that followed did not last. With the daimyo's men worn thin, Chaos and greenskins came ashore, and from then on she put on the oni mask and became the Ghost, protecting the innocent her own way."
      },
      identity: [
        kv("角色位阶", "Rank", { zh: "传奇英雄（远征同伴）", en: "Legendary Hero (Expedition Companion)" }),
        kv("定位", "Class", { zh: "近战突击", en: "Melee assault" }),
        kv("象征主线", "Narrative thread", { zh: "本地武力归附", en: "Nippon's martial strength joining the fleet" }),
        kv("招募", "Recruitment", { zh: "远征同伴面板：序章「战鬼的传闻」→ 第壹章「一合」", en: "Companion panel: prologue \"Rumour of the Ghost\" then chapter I, \"A Single Exchange\"" }),
        kv("羁绊解锁", "Bond unlocks", { zh: "武士线兵种（长枪武士／铁炮武士／雷刃旗本）的名望征召", en: "Renown muster for the samurai line: Yari Samurai, Teppo Samurai, Thunderblade Hatamoto" })
      ],
      recruit: [
        kv("招募来源", "Source", { zh: "远征同伴面板（召集「招募立花直虎」）", en: "The Expedition Companions panel — muster \"Recruit Tachibana Naotora\"" }),
        kv("解锁条件", "Unlocked by", { zh: "序章「战鬼的传闻」解锁召集；第壹章「一合」正式入队", en: "The prologue, Rumour of the Ghost, opens the muster; chapter I, A Single Exchange, brings her in" }),
        kv("数量限制", "Cap", { zh: "唯一", en: "Unique" })
      ],
      formsNote: {
        zh: "唯一战斗形态：徒步双刀，没有坐骑。",
        en: "One combat form only: on foot with paired blades, no mount."
      },
      forms: [{ zh: "徒步", en: "On foot" }],
      statRows: [
        { k: { zh: "护甲", en: "Armour" }, v: ["65"] },
        { k: { zh: "近战攻击", en: "Melee attack" }, v: ["70"] },
        { k: { zh: "近战防御", en: "Melee defence" }, v: ["55"] },
        { k: { zh: "武器威力（基础／破甲）", en: "Weapon damage (base / AP)" }, v: ["180 / 340"] },
        { k: { zh: "冲锋加成", en: "Charge bonus" }, v: ["55"] },
        { k: { zh: "生命值", en: "Health" }, v: ["4956"] },
        { k: { zh: "领导力", en: "Leadership" }, v: ["80"] },
        { k: { zh: "速度", en: "Speed" }, v: ["58"] }
      ],
      statNote: {
        zh: "特殊属性 —— 魔法攻击；物理抗性 20%。",
        en: "Special: magical attacks; 20% physical resistance."
      },
      weapons: [
        {
          k: { zh: "双刀「紫电」", en: "Shiden, the paired blades" },
          v: {
            zh: "180／340，魔法攻击；反步兵 +20。",
            en: "180 / 340, magical; +20 against infantry."
          }
        }
      ],
      traits: [
        kv("反步兵部队", "Anti-infantry", { zh: "对小型目标有额外伤害加成", en: "Extra damage against small targets" }),
        kv("破甲杀伤", "Armour-piercing", { zh: "武器伤害大多无视护甲", en: "Most of her weapon damage ignores armour" }),
        kv("灵巧闪避", "Nimble", { zh: "敏捷极高，可闪避剑刃与投掷武器", en: "Agile enough to dodge blades and thrown weapons" })
      ],
      passives: [
        { k: { zh: "武士道", en: "Bushido" }, form: { zh: "全部形态", en: "All forms" }, v: { zh: "生命值降至 50% 或以下时激活，残血期间常驻：基础／破甲武器杀伤 +15%、近战攻击 +10，并获得「永不败逃」", en: "Triggers at 50% health or below and stays on while she is hurt: +15% weapon damage base and AP, +10 melee attack, and Unbreakable" } },
        { k: { zh: "人剑合一", en: "Blade in Unison" }, form: { zh: "全部形态", en: "All forms" }, v: { zh: "常驻：近战攻击 +10、近战防御 +10；生命值低于 25% 时自动失效", en: "Always on: +10 melee attack, +10 melee defence; switches off below 25% health" } },
        { k: { zh: "地形适应", en: "Terrain Adept" }, form: { zh: "仅森林", en: "Forest only" }, v: { zh: "身处森林时：护甲 +15、远程抗性 +20", en: "While in forest: +15 armour, +20 missile resistance" } },
        { k: { zh: "英武必杀", en: "Heroic Killing Blow" }, form: { zh: "全部形态", en: "All forms" }, v: { zh: "原版通用被动：近战中有几率对单体目标一击必杀", en: "Standard vanilla passive: a chance to kill a single-entity target outright in melee" } }
      ],
      actives: [],
      attrs: [
        kv("引发恐惧", "Causes Fear", { zh: "邻近敌军领导力下降", en: "Nearby enemies lose leadership" }),
        kv("激励友军", "Encouraging", { zh: "领导力光环", en: "Leadership aura" }),
        kv("于森林中隐蔽", "Hide in Forest", { zh: "可在森林中隐蔽", en: "Can hide in forest" })
      ],
      gear: {
        zh: "两件、无套装，召集即自带：武器「紫电」＋护符「鬼面」。",
        en: "Two pieces, no set bonus, both carried from the moment she is mustered: the blades Shiden and the oni-mask charm."
      },
      tree: {
        note: {
          zh: "个人专属线与原版复用分支各自独立推进，不设任何互斥锁；下列只收本 mod 原创的分支。前置条件写在每个节点名下；「需 N/M」= M 个并行父节点中至少点 N 个。",
          en: "The unique line and the reused vanilla branches advance independently, with no mutual locks; only the original branches are listed below. Each node states its own prerequisite, and \"N/M\" means at least N of M parallel parents."
        },
        branches: [
          {
            id: "trait",
            label: { zh: "特性", en: "Trait" },
            sub: { zh: "开局自带，固定不变", en: "From the start, never changes" },
            cols: [[node("leader", "武士领袖", "Samurai Leader", {
              tier: 0,
              unlock: { zh: "开局自带 · 单级", en: "From the start · single rank" },
              desc: { zh: "家系战败、领地尽失，她仍是那个亲提双刀率旗本冲阵的当主——名分能被夺走，治军用人的本事夺不走。", en: "The house lost the war and the domain with it, and she is still the head who led the hatamoto in with a blade in each hand. A title can be taken away; knowing how to hold soldiers together cannot." },
              effects: [
                { zh: "所在省份己方定居点建筑成本 −20%", en: "−20% building cost in your settlements in her province" },
                { zh: "所在军队的武士部队（长枪武士／铁炮武士／雷刃旗本）武器威力 +10%（近战与远程，基础与破甲）", en: "+10% weapon damage — melee and missile, base and AP — for the samurai units in her army: Yari Samurai, Teppo Samurai and Thunderblade Hatamoto" }
              ]
            })]]
          },
          {
            id: "companion",
            label: { zh: "同伴特性", en: "Companion trait" },
            sub: { zh: "随羁绊四档成长，只升不降", en: "Grows with the bond across four stages; it never falls back" },
            cols: [[node("bugyo", "奉行", "Bugyo", {
              tier: 0,
              unlock: { zh: "随羁绊档位由开局脚本授予", en: "Granted by the bond stage" },
              desc: { zh: "她照立花家的规矩立起丈量与工期，账目第一次对得上；到了生死之交，她终于肯把「立花」这个姓氏挂回阵前，连同立花家历代的治世之法。", en: "She sets out measurements and work schedules the Tachibana way, and for the first time the books balance. By Devoted she is willing to hang the name Tachibana at the front of the line again — and the family's way of governing with it." },
              effects: [
                { zh: "所在行省所有建筑收入产值 +5／+10／+15／+20%（随羁绊档位）", en: "+5 / +10 / +15 / +20% income from every building in her province, by bond stage" },
                { zh: "所在军队免疫心理（「军令如山」，四档恒定）", en: "Immune to psychology for her army — Orders Are Orders, the same at all four stages" }
              ]
            })]]
          },
          {
            id: "unique",
            label: { zh: "个人专属线", en: "Unique line" },
            sub: { zh: "完全原创，剑豪与雷刃主题", en: "Wholly original: swordmaster and thunderblade" },
            cols: [
              [node("nito", "二刀流", "Two-Blade Style", {
                tier: 0,
                unlock: { zh: "8 级解锁 · 单级 · 本线起点", en: "Level 8 · single rank · start of the line" },
                desc: { zh: "双刀攻防一体，滴水不漏。", en: "Two blades, attack and guard in one, with nothing left open." },
                effects: [{ zh: "自身近战攻击 +6、近战防御 +6", en: "+6 melee attack and +6 melee defence for herself" }]
              })],
              [
                node("model", "武士典范", "Model of the Samurai", {
                  tier: 1,
                  unlock: { zh: "前置：二刀流", en: "Requires Two-Blade Style" },
                  desc: { zh: "率旗本征战的当主，她的武范是麾下武士的标尺。", en: "A house head who campaigned at the head of her hatamoto: her form is the measure her samurai are held to." },
                  effects: [{ zh: "长枪武士／铁炮武士／雷刃旗本近战攻击 +6、近战防御 +6、士气 +5", en: "+6 melee attack, +6 melee defence and +5 leadership for Yari Samurai, Teppo Samurai and Thunderblade Hatamoto" }]
                }),
                node("rootout", "铲奸除恶", "Rooting Out Evil", {
                  tier: 2,
                  unlock: { zh: "前置：二刀流", en: "Requires Two-Blade Style" },
                  desc: { zh: "隐姓埋名于乡野铲奸除恶的岁月，练就了一身安民治地的本事。", en: "The years spent nameless in the countryside cutting down what preyed on it taught her how to settle a district and the people in it." },
                  effects: [
                    { zh: "所在行省掌控力 +6", en: "+6 control in her province" },
                    { zh: "所在军队招募成本 −10%", en: "−10% recruitment cost for her army" },
                    { zh: "所在军队维护费 −5%", en: "−5% upkeep for her army" }
                  ]
                }),
                node("raijin", "雷神祝福", "Blessing of Raijin", {
                  tier: 3,
                  unlock: { zh: "前置：二刀流", en: "Requires Two-Blade Style" },
                  desc: { zh: "同承雷神之契的旗本与她心意相通。", en: "The hatamoto who hold the same pact with the thunder god read her without being told." },
                  effects: [
                    { zh: "自身生命值 +10%", en: "+10% health for herself" },
                    { zh: "雷刃旗本武器威力 +15%、全伤害抗性 +8%、移动速度 +20%、冲锋加成 +10", en: "Thunderblade Hatamoto gain +15% weapon damage, +8% resistance to all damage, +20% speed and +10 charge bonus" }
                  ]
                }),
                node("swift", "雷厉风行", "Thunder-Swift", {
                  tier: 4,
                  unlock: { zh: "前置：二刀流", en: "Requires Two-Blade Style" },
                  desc: { zh: "雷刃剑豪的高速突阵，雷厉而至，一击破阵。", en: "The thunderblade swordmaster's charge: it arrives as thunder does, and the line opens." },
                  effects: [{ zh: "自身冲锋加成 +15、移动速度 +15%", en: "+15 charge bonus and +15% speed for herself" }]
                })
              ],
              [node("shiden", "紫电一闪", "Shiden Flash", {
                tier: 5,
                hub: "4/4",
                unlock: { zh: "需点满前 4 个并行节点", en: "Requires all four parallel nodes" },
                desc: { zh: "紫电一闪，斩雷断阵。", en: "One flash of violet lightning: the thunder cuts, and the line breaks." },
                effects: [
                  { zh: "解锁战场主动技「紫电一闪」：斩杀判定 ≤20% 血量即死、伤害 732、拦截 50 米", en: "Unlocks the battle ability Shiden Flash: an execute below 20% health, 732 damage, 50m intercept range" },
                  { zh: "每场 2 次，仅可对敌方领主／英雄施放", en: "Twice per battle, only against enemy lords and heroes" }
                ]
              })]
            ]
          },
          {
            id: "combat",
            label: { zh: "战斗", en: "Combat" },
            sub: { zh: "原样复用通用战斗链", en: "Generic combat chain, reused as-is" },
            reuse: true,
            cols: [
              [node("n_c0", "剑术大师", "Blade Master", { reuse: true, tier: 0, unlock: { zh: "起点", en: "Starter" } })],
              [
                node("n_c1", "致命冲锋", "Deadly Charge", { reuse: true }),
                node("n_c2", "全身板甲", "Full Plate", { reuse: true }),
                node("n_c3", "躲闪腾挪", "Dodging", { reuse: true }),
                node("n_c4", "致命利刃", "Deadly Blades", { reuse: true })
              ],
              [node("n_c5", "索敌者", "Foe-Seeker", { reuse: true, hub: "4/4" })],
              [
                node("n_c6", "杀伤猛士", "Wound-Maker", { reuse: true }),
                node("n_c7", "疤面老兵", "Scarred Veteran", { reuse: true }),
                node("n_c8", "健步如飞", "Fleet-Footed", { reuse: true }),
                node("n_c9", "剑盾", "Blade Shield", { reuse: true })
              ],
              [node("n_c10", "巨人一击", "Giant Blow", { reuse: true, hub: "4/4" })]
            ]
          },
          {
            id: "generic",
            label: { zh: "通用", en: "Generic" },
            sub: { zh: "孤立节点，原版复用", en: "Isolated vanilla nodes" },
            reuse: true,
            cols: [[
              node("n_g0", "魔法抗性", "Magic Resistance", { reuse: true }),
              node("n_g1", "远程抗性", "Missile Resistance", { reuse: true })
            ]]
          },
          {
            id: "campaign",
            label: { zh: "战役", en: "Campaign" },
            sub: { zh: "原样复用武者型英雄战役行动", en: "Champion-type hero campaign actions, reused as-is" },
            reuse: true,
            cols: [[
              node("n_p0", "训练军队", "Train Army", { reuse: true }),
              node("n_p1", "散播治安", "Spread Public Order", { reuse: true }),
              node("n_p2", "攻击驻军", "Attack Garrison", { reuse: true }),
              node("n_p3", "刺伤特工", "Wound Agent", { reuse: true }),
              node("n_p4", "攻击部队", "Attack Army", { reuse: true }),
              node("n_p5", "降低行动成本", "Cheaper Actions", { reuse: true })
            ]]
          }
        ]
      },
      knot: {
        zh: "她曾是名正言顺的当主，却被战败连根拔起，从此只信手里的刀，不再信任何名分。她投效沈长风，是因为认出了同道——一个真在做事的人，而不是又一个需要她低头的名分。她的四章要走的不是重新学会信任，而是敢不敢再一次把自己交出去，哪怕这次没有名分作担保。",
        en: "She was the rightful head of a house and defeat pulled her up by the roots; since then she trusts the blade in her hand and no title. She follows Shen Changfeng because she recognised a peer — someone actually doing the work, not another rank she would have to bow to. Her four chapters are not about learning to trust again but about whether she dares hand herself over once more, this time with no title to guarantee it."
      },
      chapters: [
        {
          short: { zh: "序", en: "Pr." },
          n: { zh: "序章", en: "Prologue" },
          title: { zh: "战鬼的传闻", en: "Rumour of the Ghost" },
          bond: { zh: "无（入队前）", en: "None (before joining)" },
          goal: { zh: "打赢谷口救援战（在任务面板上选中军队传送进场，直虎作为友军并肩作战）", en: "Win the relief battle at Taniguchi — select an army on the mission panel to teleport in; Naotora fights alongside you as an ally" },
          story: [
            { zh: "斥候来报时，语气里带着点困惑。一伙溃兵在洗劫輝山附近的村庄，还没等我们的先头部队赶到，就被人从背后放倒了大半。被俘获的逃兵嘴里念叨着『战鬼』这个词语。『手持双刀的战鬼，身后跟着紫色的闪电』，这种传闻在乱世里并不稀罕。但同样的三队斥候带来了相似的信息，有时是击退强盗，有时是独自与混沌勇士作战。或许应该派人去一探究竟？", en: "The scouts came back puzzled. A band of routed soldiers had been sacking villages near Hikariya, and before our vanguard even arrived most of them had been put down from behind. The captured deserters kept saying one word: the Ghost. \"A ghost with two blades, violet lightning behind her.\" That sort of rumour is cheap in a broken age. But three separate scout parties brought the same story back — bandits driven off here, a Chaos champion fought alone there. Perhaps someone should go and look." }
          ]
        },
        {
          short: { zh: "壹", en: "I" },
          n: { zh: "第壹章", en: "Chapter I" },
          title: { zh: "一合", en: "A Single Exchange" },
          bond: { zh: "结缘", en: "Bound" },
          goal: { zh: "招募立花直虎", en: "Recruit Tachibana Naotora" },
          story: [
            { zh: "战斗结束后，我们终于有机会近距离观察那位被当地人称为『战鬼』的武士。她先是组织收拢伤者，又把几个惊惶失措的村民送回尚未烧尽的屋舍旁。在安顿完那些人之后，径直来到我的营前，并提出了一个有些出人意料的请求。她要与我比试一场。", en: "After the fighting we finally got a close look at the samurai the locals call the Ghost. First she organised the wounded, then walked a few badly frightened villagers back to the houses that had not burned. Once they were settled she came straight to my camp and made a request I did not expect: she wanted a bout with me." },
            { zh: "这应该不是挑衅，至少我没有从她的语气中听出这种意思。我接受了她的请求。双刀与单刀只交了一合，雷光沿着她的刃口一闪即逝，双方随即各自收势。胜负并未分明，但她似乎已经得到了想要的答案。", en: "Not a provocation, or nothing in her voice said so. I accepted. Two blades against one, a single exchange; lightning ran the length of her edge and was gone, and we both drew back. Nothing was decided — but she seemed to have got the answer she came for." },
            { zh: "『你的剑术很有意思』，面具下传出清脆的声音。『我想跟着你多看看』。", en: "\"Your swordsmanship is interesting,\" said a clear voice from behind the mask. \"I would like to follow you and see more.\"" }
          ],
          reward: { zh: "解锁长枪武士；解锁舰队建筑「武者屋形」", en: "Unlocks Yari Samurai; unlocks the fleet building Warrior's Manor" }
        },
        {
          short: { zh: "贰", en: "II" },
          n: { zh: "第贰章", en: "Chapter II" },
          title: { zh: "鬼面大人", en: "Lady Oni-Mask" },
          bond: { zh: "信任", en: "Trusted" },
          goal: { zh: "占领灵道大社", en: "Take the Grand Vim-To Shrine" },
          story: [
            { zh: "立花直虎是一个直率且有趣的人，她讲话很大声，声音往往透过鬼面传遍舰船。令我惊讯的是她有着很好的领袖气质，与到处招惹人的第一印象不同，士兵们似乎很愿意听她的指挥。", en: "Naotora is direct and good company. She talks loudly, and the sound carries through the oni mask across the whole ship. What surprised me is how well she leads: nothing like the first impression of someone picking fights everywhere — the soldiers take her orders willingly." },
            { zh: "她的战斗方式也快速并且直接，敌人往往在看清动作前就已经被斩下脑袋。我在震旦时也曾听过一部分尼朋的武士掌握了引雷之法，看来传言为真。", en: "Her fighting is fast and just as direct; heads come off before the enemy has seen the movement. Back in Cathay I had heard that some Nipponese samurai had a way of drawing the lightning down. It seems the story is true." },
            { zh: "在又一次剿灭匪徒之后，立花直虎走到我的面前。『我听说外来者已经占据了灵道大社作为据点』，她说，『我们应当去那里看看，斩草除根』。", en: "After another band of bandits was cleared out she came to me. \"I hear outsiders have made a base of the Grand Vim-To Shrine,\" she said. \"We should go and look, and pull it up by the root.\"" }
          ],
          reward: { zh: "长枪武士容量 +4（其中 1 队直接入池）；解锁铁炮武士", en: "+4 Yari Samurai capacity, one unit straight into the pool; unlocks Teppo Samurai" }
        },
        {
          short: { zh: "叁", en: "III" },
          n: { zh: "第叁章", en: "Chapter III" },
          title: { zh: "引雷之峰", en: "Thunder-Drawing Peak" },
          bond: { zh: "托付", en: "Sworn" },
          goal: { zh: "在竜舰海港建成「引雷之峰」", en: "Build Thunder-Drawing Peak at Dragon Fleet Port" },
          story: [
            { zh: "立花家曾是尼朋名门。家中没有男嗣，直虎年少继了家督，提着双刀带旗本出征。直虎从小和旗本接受一样的训练。", en: "The Tachibana were a name in Nippon. With no male heir Naotora took the headship young and led the hatamoto out with a blade in each hand; she had trained alongside them since childhood." },
            { zh: "据她所说，龙舰海港旁的山峰上有一处神庙曾供最初的雷刃武者们在那里修炼，她希望我能将其修缮。", en: "By her account there is a shrine on the peak beside Dragon Fleet Port where the first thunderblade warriors trained. She would like me to restore it." }
          ],
          reward: { zh: "长枪武士容量 +3；铁炮武士容量 +4（其中 1 队直接入池）；解锁雷刃旗本", en: "+3 Yari Samurai capacity; +4 Teppo Samurai capacity, one straight into the pool; unlocks Thunderblade Hatamoto" }
        },
        {
          short: { zh: "肆", en: "IV" },
          n: { zh: "第肆章", en: "Chapter IV" },
          title: { zh: "雷神之女", en: "Daughter of Raijin" },
          bond: { zh: "生死之交", en: "Devoted" },
          goal: { zh: "一条任务，两个派系 —— 消灭铁皮所部（绿皮部落）与斯卡布兰德所部（恐虐的流亡者），两个都灭了才收官", en: "One mission, two factions: destroy Ironhide's greenskin tribe and Skarbrand's exiles of Khorne. It closes only when both are gone" },
          story: [
            { zh: "在尼朋内战中，立花家所属的派系战败，家族领地被没收。直虎在被囚禁为人质之前逃出了城门。然而内战落幕后的尼朋并没有长久的太平。在尼朋大名们人马疲惫之时，混沌与绿皮登上了尼朋列岛，开始了对这里的侵略。直虎从此戴上鬼面化身战鬼，以自己的方式守护无辜之人。", en: "Her faction lost the civil war and the domain was confiscated; she got out of the gate before they could hold her hostage. The peace that followed did not last: with the daimyo's men worn thin, Chaos and greenskins landed on the isles. From then on she put on the oni mask and became the Ghost, protecting the innocent her own way." },
            { zh: "『我们必须除掉这两个祸根。』", en: "\"Both of these roots have to come out.\"" }
          ],
          reward: { zh: "长枪武士容量 +3、铁炮武士容量 +3、雷刃旗本容量 +4（其中 1 队直接入池）；羁绊进「生死之交」；特性「奉行」升到第四阶", en: "+3 Yari Samurai, +3 Teppo Samurai and +4 Thunderblade Hatamoto capacity, one of the latter straight into the pool; bond reaches Devoted; the Bugyo trait rises to its fourth stage" }
        }
      ]
    },
    {
      slug: "sayo",
      rank: "legendary-hero",
      rankLabel: { zh: "传奇英雄 · 远征同伴", en: "Legendary Hero · Companion" },
      name: { zh: "纱代", en: "Sayo" },
      epithet: { zh: "阴阳之巫女", en: "the Onmyo Miko" },
      portrait: "assets/portrait/sayo.png",
      porthole: "assets/porthole/sayo.png",
      scene: "assets/scene/sayo.png",
      desc: { zh: "法术向传奇英雄，镜山神社末代巫女。走自建巫女法系，拥有神使（灵狐）与神兽（麒麟）召唤。", en: "A caster legendary hero: the last miko of the Kagamiyama shrine. She uses the bespoke Miko lore and summons the fox emissary and the divine beast." },
      identity: [
        kv("角色位阶", "Rank", { zh: "传奇英雄（远征同伴）", en: "Legendary Hero (Expedition Companion)" }),
        kv("定位", "Class", { zh: "法术向", en: "Caster" }),
        kv("象征主线", "Narrative thread", { zh: "本地信仰归附", en: "Nippon's faith joining the fleet" }),
        kv("招募", "Recruitment", { zh: "占领灵道大社 → 第壹章「废社之铃」", en: "Take the Grand Vim-To Shrine, then chapter I, \"The Bell in the Ruined Shrine\"" }),
        kv("默认不朽", "Immortal", { zh: "是（v1.0.1 补上）", en: "Yes — added in v1.0.1" })
      ],
      knot: {
        zh: "神社被毁之后，她带着神乐铃藏进地下，活着，却不再以巫女的身份活着。她的四章要走的是把这个身份一件一件捡回来：走出藏身所、修好社殿、夺回被夷平的灵苑，最后站到封印面前。性格促狭爱打趣、看似对什么都不上心、把要紧事藏在玩笑里说；关键时刻收起轻佻，比谁都可靠。",
        en: "After the shrine burned she took the kagura bells underground and went on living — but not as a miko. Her four chapters are about picking that identity back up piece by piece: leaving the hiding place, rebuilding the hall, retaking the levelled grove, and finally standing in front of the seal. She teases, seems to care about nothing, and hides what matters inside a joke; when it counts the flippancy goes and she is the most reliable person aboard."
      },
      chapters: [
        {
          short: { zh: "壹", en: "I" },
          n: { zh: "第壹章", en: "Chapter I" },
          title: { zh: "废社之铃", en: "The Bell in the Ruined Shrine" },
          bond: { zh: "结缘", en: "Bound" },
          goal: { zh: "在远征同伴面板中招募纱代（我军占领灵道大社后的下一回合触发）", en: "Recruit Sayo from the companion panel — triggers the turn after you take the Grand Vim-To Shrine" },
          pic: "assets/eventpic/sayo_destroyed.png",
          story: [
            { zh: "攻下灵道大社之后，士兵们不肯在社殿附近扎营。说入夜后废社里偶然会闪过白色的光，贴着地面还能听到铃声。", en: "After we took the Grand Vim-To Shrine the soldiers would not camp near the hall. They said a white light passed through the ruin after dark, and low to the ground you could hear bells." },
            { zh: "第三夜我决定自己去查看。等我站到社殿门前，铃声停了。千本鸟居前方的地砖上裂开了一条缝，一个身着巫女服饰的白发女子走了出来，浮动在她身边的阴阳双鱼在黑夜里格外亮眼。她朝我俯身行礼。", en: "On the third night I went to look myself. By the time I stood at the doors the bells had stopped. A crack had opened in the paving before the thousand gates, and a white-haired woman in a miko's dress stepped out of it, the yin-yang fish drifting at her side unmistakably bright in the dark. She bowed to me." },
            { zh: "她自称纱代，这座社最后的巫女。其他问题便笑而不答，反倒端详起我来：『将军的兵没有拆我的社殿当柴烧，比之前住在这里的那些盗贼和兽人们可讲究多了』。", en: "She gave the name Sayo, last miko of this shrine, smiled at every other question and looked me over instead. \"The general's soldiers did not pull my hall apart for firewood. Rather more considerate than the bandits and beastmen who lived here before.\"" },
            { zh: "她微微偏头，『若将军愿意修缮神社，我可以为军效力』。", en: "She tilted her head. \"If the general is willing to restore the shrine, I can serve the army.\"" }
          ],
          reward: { zh: "解锁稻荷灵狐使者；解锁舰队建筑「舰上稻荷社」", en: "Unlocks the Inari Fox Emissary; unlocks the fleet building Shipboard Inari Shrine" }
        },
        {
          short: { zh: "贰", en: "II" },
          n: { zh: "第贰章", en: "Chapter II" },
          title: { zh: "末代巫女", en: "The Last Miko" },
          bond: { zh: "信任", en: "Trusted" },
          goal: { zh: "在灵道大社重建「灵道本殿」", en: "Rebuild the Vim-To Main Hall at the Grand Vim-To Shrine" },
          story: [
            { zh: "纱代在舰上过得比谁都自在。她似乎有种蛊惑人心的魔力。士兵们排队找她求签，军中几个胆大的后生被她唤作『小朋友』，被使唤着跑腿买蜜饯，还都跑得心甘情愿。她似乎对什么事都不怎么上心，却总是入夜后独自立在船头，望着日升之地内陆的方向。", en: "Sayo settled in aboard better than anyone. There is something beguiling about her. Soldiers queue for her fortunes; a few of the bolder young ones she calls \"little friends\" and sends off to buy candied fruit, and they go gladly. She seems to take nothing seriously — and yet every night she stands alone at the bow, looking inland toward Sun's Origin." },
            { zh: "一晚她寻到我舱中，摊开一卷旧图，纸上画着社殿、鸟居、夹道而立的石狐。『大社在内战中被烧毁时，我正外出祭祀。』，她指尖点在图上，语气还是那样不紧不慢，『待我回来时，却发现废墟已经被兽人占领，除了躲入地下外别无他法』。", en: "One evening she came to my cabin and unrolled an old plan: the hall, the gates, the stone foxes lining the path. \"I was away at a rite when the shrine burned in the civil war,\" she said, tapping the paper, unhurried as ever. \"By the time I came back the ruin was held by beastmen. There was nothing to do but go underground.\"" },
            { zh: "『说好的修缮，可以动工了吗，将军』。", en: "\"About that restoration, general. May we begin?\"" }
          ],
          reward: { zh: "稻荷灵狐使者容量 +4（其中 1 队直接入池）", en: "+4 Inari Fox Emissary capacity, one straight into the pool" }
        },
        {
          short: { zh: "叁", en: "III" },
          n: { zh: "第叁章", en: "Chapter III" },
          title: { zh: "神兽宫", en: "The Sanctum of the Divine Beast" },
          bond: { zh: "托付", en: "Sworn" },
          goal: { zh: "在天照神宫建成「神兽宫」", en: "Build the Sanctum of the Divine Beast at the Amaterasu Shrine" },
          pic: "assets/eventpic/sayo_restored.png",
          story: [
            { zh: "社殿重立，香火渐旺，来参拜的乡人都唤她『巫女大人』，她一一应下，收供品收得心安理得。也是从乡人口中，我知道了那个名字：如今统治日升之地的大名，内战中发迹，以残暴闻名。不仅下令烧毁灵道大社，连天照神宫深处的神兽宫都被他夷为平地。", en: "The hall stands again, the incense is thick, and the country people who come to pray call her Lady Miko. She answers to all of it and accepts the offerings with a clear conscience. It was from them that I learned the name: the daimyo who rules Sun's Origin now, made in the civil war, known for cruelty. He ordered the Grand Vim-To Shrine burned — and levelled the Sanctum of the Divine Beast deep inside the Amaterasu Shrine as well." },
            { zh: "回舰后我提起此事，纱代正给灯笼换烛，闻言也不停手。『烧社的时候我没在场，平神兽宫的时候我也没在场』，她把旧烛掐灭，『但我知道是谁干的』。", en: "Back aboard I raised it. She was changing the candle in a lantern and did not stop. \"I was not there when the shrine burned, and I was not there when the sanctum came down,\" she said, pinching out the old wick. \"But I know who did it.\"" },
            { zh: "『将军如果愿意夺下天照神宫，神兽必定也会再次降临吧』。", en: "\"If the general is willing to take the Amaterasu Shrine, surely the divine beast will come down to us again.\"" }
          ],
          reward: { zh: "稻荷灵狐使者容量 +4（其中 1 队直接入池）；解锁麒麟", en: "+4 Inari Fox Emissary capacity, one straight into the pool; unlocks the Kirin" }
        },
        {
          short: { zh: "肆", en: "IV" },
          n: { zh: "第肆章", en: "Chapter IV" },
          title: { zh: "大社之下", en: "Beneath the Great Shrine" },
          bond: { zh: "生死之交", en: "Devoted" },
          goal: { zh: "完成预制任务战「封印之战」", en: "Win the scripted mission battle, The Battle of the Seal" },
          story: [
            { zh: "灵道大社香火重旺，麒麟回了灵苑，异象却再次出现。白光贴着地面游走的范围一天比一天大，社殿的地板下传出低沉的轰鸣，像有什么东西在磐座里翻身。乡人们说是神明显灵，纱代头一回没有顺着他们打趣。", en: "The incense is thick again, the Kirin is back in the grove — and the sign has returned. The white light travelling low across the ground reaches further every day, and under the floor of the hall there is a deep rumble, as though something were turning over inside the rock. The country people call it the god showing itself. For the first time, Sayo did not play along." },
            { zh: "那晚她把一切告诉了我，语气里再没有平日的一点玩笑。镜山一脉世代守护的，从来不只是社殿。初代巫女以阴阳之术，把远古的大魔镇封在大社底下的磐座之中，神社本身就是封印的一部分。社毁于内战的那一天起，封印就开始松动。她藏进地下，一半是避祸，一半是守着它。曾经在足川登陆的那个恐虐大魔恐怕也是受此影响。", en: "That night she told me all of it, without a trace of the usual joke. What the Kagamiyama line has guarded for generations was never only a hall. The first miko used the onmyo arts to seal an ancient greater daemon inside the rock beneath the shrine, and the shrine itself is part of the seal. From the day it burned in the civil war the seal has been loosening. She went underground half to survive and half to keep watch over it. The greater daemon of Khorne that once came ashore at Ashikawa was very likely drawn by the same thing." },
            { zh: "『师父把这个交到我手里的时候说，总有一天，要凭自己的手重铸封印』。她举起神乐铃，铃身上的镜山纹在白光里发亮。", en: "\"When my teacher put this in my hands she said that one day I would have to reforge the seal myself.\" She lifted the kagura bells, the Kagamiyama pattern bright on them in the white light." },
            { zh: "『封印撑不到明天了』。她把铃收进袖中，抬眼看我，『带兵回大社吧，将军。这一次我不躲』。", en: "\"It will not hold past tomorrow.\" She put the bells into her sleeve and looked up. \"Take the army back to the shrine, general. This time I am not hiding.\"" }
          ],
          reward: { zh: "稻荷灵狐使者容量 +3；麒麟容量 +3（其中 1 队直接入池）", en: "+3 Inari Fox Emissary capacity; +3 Kirin capacity, one straight into the pool" }
        }
      ]
    },
    {
      slug: "serena",
      rank: "legendary-hero",
      rankLabel: { zh: "传奇英雄 · 远征同伴", en: "Legendary Hero · Companion" },
      name: { zh: "瑟兰娜", en: "Serena" },
      epithet: { zh: "迷雾法师", en: "Mistweaver" },
      nameNote: {
        zh: "全名「望舒·瑟兰娜·顾」分两次揭开：第叁章借罗盘揭出「望舒」，第肆章决战之后「顾」与完整全名才整合起来。详情页只写「瑟兰娜」。",
        en: "The full name Wangshu Selana Gu is revealed in two steps: Wangshu comes out through the compass in chapter III, and Gu with the whole name only after the battle in chapter IV. This page uses Serena alone."
      },
      portrait: "assets/portrait/serena.png",
      porthole: "assets/porthole/serena.png",
      scene: "assets/scene/serena.png",
      desc: { zh: "法术向传奇英雄，外海归附的前高精迷雾法师（马瑟兰迷雾法系），补齐「玉海舰队 ↔ 外海势力」的叙事连接。", en: "A caster legendary hero: a former High Elf mistweaver of Saphery come over from the outer sea, closing the narrative link between the fleet and the powers beyond it." },
      identity: [
        kv("角色位阶", "Rank", { zh: "传奇英雄（远征同伴）", en: "Legendary Hero (Expedition Companion)" }),
        kv("定位", "Class", { zh: "法术向 · 马瑟兰迷雾法系", en: "Caster · Lore of Mist" }),
        kv("招募", "Recruitment", { zh: "序章「攻占龙舰海港」→ 第壹章「半张面具」", en: "Prologue \"Take Dragon Fleet Port\", then chapter I, \"Half a Mask\"" }),
        kv("坐骑", "Mounts", { zh: "披甲伊瑟拉玛银战马、伊瑟拉玛银战车、银月龙", en: "Barded Ithilmar Steed, Ithilmar Chariot, Moon Dragon" }),
        kv("默认不朽", "Immortal", { zh: "是（v1.0.1 补上）", en: "Yes — added in v1.0.1" })
      ],
      knot: {
        zh: "她被自己的同族两次抛弃，一次在黑方舟战役里失去舰队与导师，一次在月落之塔被当作弃子诱饵，却依然固执地相信下一次值得再信一次。她要在沈长风身边学会的不是不再信任，而是分清哪些信任值得给、哪些不必再给。",
        en: "Her own kin abandoned her twice — once in the Black Ark campaign, where she lost her fleet and her teacher, and once at the Tower of the Setting Moon, where she was spent as bait — and she still stubbornly believes the next time is worth trusting. What she has to learn beside Shen Changfeng is not to stop trusting, but to tell which trust is worth giving."
      },
      chapters: [
        {
          short: { zh: "壹", en: "I" },
          n: { zh: "第壹章", en: "Chapter I" },
          title: { zh: "半张面具", en: "Half a Mask" },
          bond: { zh: "结缘", en: "Bound" },
          goal: { zh: "招募瑟兰娜", en: "Recruit Serena" },
          pic: "assets/eventpic/serena.png",
          box: { zh: "龙舰港口深处，瑟兰娜险些被奸奇的符纹面具夺去心智。沈长风摘下面具，救下这位迷雾法师。她说，若还要追猎奸奇信徒，她愿意帮忙。", en: "Deep under Dragon Fleet Port, Serena nearly lost her mind to a Tzeentchian rune mask. Shen Changfeng pulled it off and freed the mistweaver, who offers her help if the hunt for Tzeentch's cultists continues." },
          story: [
            { zh: "港口的地牢的深处比想象中干净，这不正常，多半是关押的人还有利用价值。我打开最深处一间圆室的门，墙上布满了不断自行改写的符纹。凝视得久了，便会发现那些线条仿佛悄无声息地换了位置。一个精灵被锁在圆室的中央，脸上扣着一副铜面具，面具内侧刻着同样的符纹。", en: "The bottom of the port's gaol was cleaner than it should have been, which usually means the prisoner is still useful. I opened the door of the round cell at the very end. The walls were covered in runes that kept rewriting themselves — stare long enough and the lines had quietly changed places. An elf was chained at the centre with a bronze mask fixed over her face, the same runes cut into its inner side." },
            { zh: "我听说过这类面具是做什么用的：戴上它才会开始听见声音，看见逝去的亲人或是曾经珍视的事物，沉浸其中时便会变为奸奇信徒的一员。我扯下那个面具，她的眼中渐渐恢复了光彩，缓缓抬起头。『你不是奸奇』，她说。我笑了笑。『你也不是』。", en: "I know what those masks are for. You put it on and you begin to hear voices, to see the dead and the things you once held dear, and while you are inside it you become one of Tzeentch's own. I tore it off. The light came back into her eyes and she raised her head slowly. \"You are not Tzeentch,\" she said. I laughed. \"Neither are you.\"" }
          ],
          reward: { zh: "解锁洛瑟恩海卫（持盾）；获得特有魔法护符", en: "Unlocks Lothern Sea Guard (shielded); grants a unique magic talisman" },
          after: { zh: "我为精灵解开束缚后，她找回了自己的装备，只一瞬，地上的铜面具就已经消失在雾气中。『我叫瑟兰娜，是一名迷雾法师』，她转过头。『如果你仍在追踪奸奇信徒，或许我能帮上忙』。", en: "Once I had unbound her she recovered her gear, and in the space of a breath the bronze mask on the floor was gone into the mist. \"My name is Serena. I am a mistweaver,\" she said, turning. \"If you are still tracking Tzeentch's cultists, perhaps I can help.\"" }
        },
        {
          short: { zh: "贰", en: "II" },
          n: { zh: "第贰章", en: "Chapter II" },
          title: { zh: "輝山阴影", en: "The Shadow of Hikariya" },
          bond: { zh: "信任", en: "Trusted" },
          goal: { zh: "攻入輝山，救出被囚禁的洛瑟恩海卫俘虏", en: "Break into Hikariya and free the captive Lothern Sea Guard" },
          box: { zh: "瑟兰娜恳请沈长风救出被囚于輝山矿道下的旧部洛瑟恩海卫，救援成功，重新归入她麾下。", en: "Serena asks Shen Changfeng to free the Lothern Sea Guard held under the Hikariya mine workings. The rescue succeeds and they return to her command." },
          story: [
            { zh: "瑟兰娜话不多，但做事认真且坚持不懈。她似乎经历和目睹过许多可怕的事情，却鲜少在船上提起，只知道她曾在高等精灵海军上将艾斯林的手下担任过法师之职。她的航海术十分精湛，浓雾里总能替我们找到最稳的水路，这些天帮了舰队不少忙。", en: "Serena says little, and works carefully and without stopping. She has clearly seen terrible things and almost never mentions them aboard; all we know is that she served as a mage under the High Elf admiral Aislinn. Her seamanship is excellent — in heavy fog she always finds us the steadiest channel, and she has been a great help these last days." },
            { zh: "或许，她还有很多事情没有告诉我们，也许过一段时间她就会自愿告诉我们。不管怎样，昨天晚上她走进了我的舱室。『曾经追随我的海卫们现在被关押在輝山的矿山下』，她说，『我恳请你去救出他们』。", en: "There is a great deal she has not told us; perhaps in time she will. In any case, last night she came into my cabin. \"The sea guard who once followed me are held below the mines at Hikariya,\" she said. \"I ask you to get them out.\"" }
          ],
          reward: { zh: "洛瑟恩海卫（持盾）容量 +5（其中 2 队直接入池）；解锁纯水精魄", en: "+5 Lothern Sea Guard (shielded) capacity, two straight into the pool; unlocks Oceanids" },
          after: { zh: "矿道尽头比想象中更冷。海卫们看见瑟兰娜齐齐单膝跪地。瑟兰娜没有说太多，只让他们先随军歇息。", en: "The end of the workings was colder than expected. The sea guard went down on one knee together when they saw her. She did not say much — only told them to rest with the army for now." }
        },
        {
          short: { zh: "叁", en: "III" },
          n: { zh: "第叁章", en: "Chapter III" },
          title: { zh: "星象罗盘", en: "The Star Compass" },
          bond: { zh: "托付", en: "Sworn" },
          goal: { zh: "瑟兰娜升至 12 级", en: "Bring Serena to level 12" },
          box: { zh: "深夜船舷，沈长风认出瑟兰娜手中的罗盘是震旦星象罗盘。她谈起父亲：一位长期往来震旦与奥苏安、被戏称心向东方者的高等精灵。他留给她这面罗盘，和名字望舒。", en: "At the rail late at night, Shen Changfeng recognises the compass in Serena's hand as a Cathayan star compass. Serena speaks of her father — a High Elf who travelled long between Cathay and Ulthuan, teased as the east-facing one. He left her the compass, and the name Wangshu." },
          story: [
            { zh: "海卫们归队之后，瑟兰娜的话多了些。她是一名技术高超的法师，也是我见过的最好的航海士。我有时惊讯于她的知识之渊博，或许只有精灵通过年月积累才能达到如此地步吧。", en: "With the sea guard back she talks a little more. She is a highly skilled mage and the best navigator I have met. Sometimes the breadth of what she knows startles me; perhaps only an elf, given the years, gets there." },
            { zh: "一日深夜，瑟兰娜倚在船舷上，掌心里摊着那面罗盘。月光落下来的一瞬我第一次看清它的构造。那不是精灵的形制，磁针之外还刻着一环月相，是震旦的星象罗盘。我问她这罗盘的来历。她沉默了很久，说那是父亲留下的东西。高等精灵在上古时期就已经与东方帝国建立了联系。她的父亲便曾经长期在震旦与奥苏安两方来往，常被人戏称为『心向东方者』。", en: "Late one night she was leaning on the rail with the compass open in her palm. In the moment the moonlight fell on it I saw its make for the first time: not elven work — a ring of lunar phases cut outside the needle. A Cathayan star compass. I asked where it came from. She was quiet a long while, then said it was her father's. The High Elves made contact with the eastern empire in the deep past, and her father travelled long between Cathay and Ulthuan; they used to tease him as the one whose heart faced east." },
            { zh: "『他给我起了一个震旦的名字，叫望舒』，瑟兰娜说道，『他说含义是月神的引路者』。", en: "\"He gave me a Cathayan name — Wangshu,\" she said. \"He told me it means the one who leads the moon.\"" }
          ],
          reward: { zh: "洛瑟恩海卫（持盾）容量 +3；纯水精魄容量 +3（其中 1 队直接入池）；解锁海元素", en: "+3 Lothern Sea Guard capacity; +3 Oceanid capacity, one straight into the pool; unlocks Sea Elementals" },
          after: { zh: "迷雾里领航时她仍用那面罗盘，只是用完了会抬头看看月亮。我想，她开始愿意让人看见她从哪里来了。", en: "She still uses that compass to pilot us through fog — only now, when she is done, she looks up at the moon. I think she is beginning to let people see where she comes from." }
        },
        {
          short: { zh: "肆", en: "IV" },
          n: { zh: "第肆章", en: "Chapter IV" },
          title: { zh: "望舒·瑟兰娜·顾", en: "Wangshu Selana Gu" },
          bond: { zh: "生死之交", en: "Devoted" },
          goal: { zh: "击败「堕落之心」洛克西亚的军队", en: "Defeat the army of Lokhsia, the Fallen Heart" },
          box: { zh: "瑟兰娜道出黑方舟之战、失踪导师与月落之塔的往事。玉海舰队将与神佑恶党发起攻击。", en: "Serena tells of the Black Ark battle, her missing teacher and the Tower of the Setting Moon. The Jade Sea Fleet will move against the Blessed Dread." },
          story: [
            { zh: "瑟兰娜已经完全融入了舰队的将士们之中，甚至连潮汐禁卫们都开始向她学习掌控魔法之道。一日，我看着仍然留在卫东列省的旧友来信，黑暗精灵的海盗已经登陆了震旦东方，他请求我出兵支援。瑟兰娜看到信上船长的名字，先是惊愕，然后是愤怒。", en: "Serena has become part of the fleet entirely; even the Tide Guard have started learning the handling of magic from her. One day a letter came from an old friend still in the Eastern Provinces: Dark Elf raiders have landed in Cathay's east, and he asks me for troops. Serena read the captain's name on the letter — first shock, then anger." },
            { zh: "『黑方舟之战，堕落之心用诡计取得了胜利』，她说，『艾斯林长官的舰队沉没，我的导师也下落不明』。在黑色方舟之战，她失去了引以为傲的舰队与导师。此后她独自追踪堕落之心的黑方舟，直至远东。在远东殖民地，她为月落之塔的领主而战，寻找复仇的机会，却在与奸奇的战斗中被当作诱饵，之后被关押在龙舰港口。", en: "\"At the Black Ark the Fallen Heart won by a trick,\" she said. \"Admiral Aislinn's fleet went down and my teacher was never found.\" She lost the fleet she was proud of and her teacher in that battle, and afterwards tracked the Fallen Heart's ark alone as far as the far east. In the eastern colonies she fought for the lord of the Tower of the Setting Moon, looking for her chance at revenge, and was spent as bait in a fight against Tzeentch — then held in the gaol at Dragon Fleet Port." },
            { zh: "她单膝跪地，『虽然是私人的请求，但我也请您出兵』。我没有理由拒绝，本来守卫震旦东方的安宁就是我的职责，也是夙愿。", en: "She went down on one knee. \"This is a private request, but I ask you to send the fleet.\" I had no reason to refuse. Keeping Cathay's east quiet was my duty, and my wish, from the beginning." }
          ],
          reward: { zh: "洛瑟恩海卫（持盾）容量 +3；纯水精魄容量 +2；海元素容量 +2（其中 1 队直接入池）", en: "+3 Lothern Sea Guard capacity; +2 Oceanid capacity; +2 Sea Elemental capacity, one straight into the pool" },
          after: { zh: "战后清点俘获时，她只取走了一面敌军的将旗。返航那日，银月龙落在甲板上，我看见她露出了微笑，这次的微笑似是发自真心。", en: "Counting the spoils afterwards she took only one of the enemy's standards. On the day we sailed back the Moon Dragon came down on the deck, and I saw her smile — this time it looked like she meant it." }
        }
      ]
    },
    {
      slug: "samurai-taisho",
      rank: "lord",
      rankLabel: { zh: "通用领主", en: "Generic Lord" },
      name: { zh: "武士大将", en: "Samurai Taisho" },
      portrait: "assets/portrait/samurai_taisho.png",
      porthole: "assets/porthole/samurai_taisho.png",
      kamon: "assets/kamon/sakura.png",
      desc: { zh: "统领一军的武士大将是尼朋军队的指挥官，也是武士道的代表。", en: "A samurai taisho commands an army in the field: Nippon's officer, and the example of bushido." },
      story: {
        zh: "尼朋有一句古训：武士的刀，不应以刀鞘束缚，而应该以灵魂来约束。武士大将就是这条古训的典范。战鼓一响，旗组护印、铳组居前、枪组列阵、骑马为锋，一军的性命都悬在军配的起落之间。统领一军者，一举一动皆是全军之范。他若进，溃兵也能重结成阵；他若退，胜军也会散作流民。",
        en: "There is an old line in Nippon: a samurai's blade should be bound by the soul, not by the scabbard. The taisho is that line made flesh. When the drums start, the banner group guards the seal, the guns take the front, the spears form up and the horse take the point, and the whole army's life hangs on the rise and fall of one war fan. Everything the commander does is the army's model: if he advances, broken men re-form; if he withdraws, a winning army scatters into refugees."
      },
      identity: [
        kv("角色位阶", "Rank", { zh: "领主（泛用，可重复招募）", en: "Lord — generic, repeatable" }),
        kv("定位", "Class", { zh: "战士（Champion），近战决斗型将领，重破甲、善守", en: "Champion: a duelling melee general, armour-piercing and hard to move" })
      ],
      recruit: [
        kv("招募来源", "Source", { zh: "领主招募面板「武士大将」页签；红甲与黑甲两个甲色同页签，数值、技能与费用完全相同，仅披风与甲色不同", en: "The Samurai Taisho tab of the lord recruitment panel. Red and black armour share the tab with identical stats, skills and cost — only cloak and armour colour differ" }),
        kv("解锁条件", "Unlocked by", { zh: "玉海舰队、山陽氏与奥本氏开局即可招募；其余震旦派系需先攻占竜舰海港并完成「武士之道」任务", en: "Available from the start to the Jade Sea Fleet, the Sanyo and the Okumoto; other Cathay factions must take Dragon Fleet Port and finish the Way of the Samurai mission" }),
        kv("数量限制", "Cap", { zh: "无全局上限；招募池中红甲、黑甲候选各常驻 2 名，招一补一", en: "No global cap; the pool keeps two red and two black candidates, refilling one for each hired" }),
        kv("招募费 / 维持费", "Cost / upkeep", { zh: "1000／1100／1400 与 250／300／300（徒步／骑战马／骑麒麟）；多人对战 800／1000／1300", en: "1000 / 1100 / 1400 and 250 / 300 / 300 for foot / warhorse / Kirin; multiplayer 800 / 1000 / 1300" })
      ],
      formsNote: { zh: "徒步、骑战马与骑麒麟是三个独立形态，装备坐骑即整体切换形态，数值不叠加。", en: "On foot, on a warhorse and on a Kirin are three separate forms. Equipping a mount swaps the whole form; the numbers do not stack." },
      forms: [
        { zh: "徒步", en: "On foot" },
        { zh: "骑战马", en: "Warhorse" },
        { zh: "骑麒麟", en: "Kirin" }
      ],
      statRows: [
        { k: { zh: "护甲", en: "Armour" }, v: ["100", "110", "80"] },
        { k: { zh: "近战攻击", en: "Melee attack" }, v: ["58", "58", "58"] },
        { k: { zh: "近战防御", en: "Melee defence" }, v: ["43", "48", "48"] },
        { k: { zh: "武器威力（基础／破甲）", en: "Weapon damage (base / AP)" }, v: ["150 / 280", "160 / 300", "160 / 300"] },
        { k: { zh: "冲锋加成", en: "Charge bonus" }, v: ["30", "50", "70"] },
        { k: { zh: "生命值", en: "Health" }, v: ["4868", "5480", "6576"] },
        { k: { zh: "领导力", en: "Leadership" }, v: ["80", "80", "80"] },
        { k: { zh: "速度", en: "Speed" }, v: ["38", "78", "90"] }
      ],
      statNote: {
        zh: "特殊属性 —— 徒步与骑战马：魔法攻击；于森林中隐蔽。骑麒麟：魔法攻击；引发恐惧与惊骇。",
        en: "Special: on foot and on the warhorse — magical attacks, hides in forest. On the Kirin — magical attacks, causes fear and terror."
      },
      weapons: [
        { k: { zh: "打刀（徒步）", en: "Uchigatana (on foot)" }, v: { zh: "150／280，魔法攻击。", en: "150 / 280, magical." } },
        { k: { zh: "打刀（骑乘）", en: "Uchigatana (mounted)" }, v: { zh: "160／300，魔法攻击。", en: "160 / 300, magical." } }
      ],
      mounts: [
        { k: { zh: "战马", en: "Warhorse" }, v: { zh: "角色等级 4 自动获得。近战防御 +5、护甲 +10、冲锋 +20、生命值 +612，武器威力升至 160／300；速度升至 78", en: "Automatic at level 4. +5 melee defence, +10 armour, +20 charge, +612 health, weapon to 160 / 300, speed to 78" } },
        { k: { zh: "麒麟", en: "Kirin" }, v: { zh: "角色等级 15 自动获得。无翼地面坐骑：冲锋 +40、生命值 +1708、速度升至 90；护甲降至 80；引发恐惧与惊骇，不再能于森林中隐蔽；获得形态被动「天雷回响」与攻城能力", en: "Automatic at level 15. A wingless ground mount: +40 charge, +1708 health, speed to 90, armour down to 80; causes fear and terror, loses hide in forest; gains the form passive Thunder's Echo and siege attacker" } }
      ],
      traits: [
        kv("近战专家", "Melee expert", { zh: "全形态", en: "All forms" }),
        kv("破甲攻击", "Armour-piercing", { zh: "全形态", en: "All forms" }),
        kv("重甲", "Armoured", { zh: "全形态", en: "All forms" }),
        kv("引发惊骇", "Causes terror", { zh: "仅骑麒麟", en: "Kirin only" })
      ],
      passives: [
        { k: { zh: "武士道", en: "Bushido" }, form: { zh: "全部形态", en: "All forms" }, v: { zh: "生命值降至 50% 或以下时自动激活：基础与破甲武器杀伤 +15%、近战攻击 +10，持续 25 秒；期间「永不败逃」，生命值回升到 50% 以上即失效", en: "Triggers at 50% health or below: +15% base and AP weapon damage, +10 melee attack for 25 seconds, and unbreakable while it lasts; ends once health passes 50% again" } },
        { k: { zh: "人剑合一", en: "One with the blade" }, form: { zh: "全部形态", en: "All forms" }, v: { zh: "常驻：近战攻击 +10、近战防御 +10；生命值跌破 25% 时暂时失效", en: "Always on: +10 melee attack, +10 melee defence; suspended below 25% health" } },
        { k: { zh: "天雷回响", en: "Thunder's Echo" }, form: { zh: "仅骑麒麟", en: "Kirin only" }, v: { zh: "陷入近战后开始充能：15 秒后落下第一道，此后每 15 秒一次，整场最多 20 次；每次召下 2 道天雷轰击身旁敌军，每道 672 点纯破甲魔法伤害（落点小范围溅射 68 点破甲）；不消耗魔法之风，不误伤友军", en: "Charges in melee: the first bolt lands 15 seconds in, then every 15 seconds, up to 20 times a battle. Each strike calls two bolts on nearby enemies at 672 pure armour-piercing magical damage, with a small 68 AP splash. Costs no Winds of Magic and never hits allies" } }
      ],
      actives: [
        { k: { zh: "武器大师", en: "Master of Arms" }, form: { zh: "技能树起点解锁", en: "Unlocked by the starter node" }, v: { zh: "在终节点「向死而生」处换代", en: "Superseded at the capstone, To Live is to Die" } }
      ],
      attrs: [kv("激励友军", "Encouraging", { zh: "全形态；领导力光环", en: "All forms; leadership aura" })],
      gear: { zh: "无。", en: "None." },
      tree: {
        note: {
          zh: "样本只给了两个原创节点（起点主动技与终节点），其余分支原样复用通用领主链——节点名未从游戏 loc 核对，此处不列。",
          en: "The sample provides two original nodes — the starter active and the capstone. The remaining branches reuse the generic lord chains; their node names are not verified against the game's loc files and are not listed here."
        },
        branches: [
          {
            id: "unique",
            label: { zh: "个人专属线", en: "Unique line" },
            cols: [
              [node("wm", "武器大师", "Master of Arms", { tier: 0, unlock: { zh: "起点节点，解锁同名战场主动技", en: "Starter node; unlocks the battle ability of the same name" } })],
              [node("live", "向死而生", "To Live is to Die", { tier: 1, unlock: { zh: "终节点，「武器大师」在此换代", en: "Capstone; Master of Arms is superseded here" } })]
            ]
          },
          {
            id: "reuse",
            label: { zh: "复用链", en: "Reused chains" },
            sub: { zh: "战斗 / 军团 / 战役，原样复用通用领主链", en: "Combat / Army / Campaign, reused from the generic lord chains as-is" },
            reuse: true,
            pending: true,
            cols: []
          }
        ]
      }
    },
    {
      slug: "miko",
      rank: "hero",
      rankLabel: { zh: "通用英雄", en: "Generic Hero" },
      name: { zh: "巫女", en: "Miko" },
      portrait: "assets/portrait/miko.png",
      porthole: "assets/porthole/miko.png",
      desc: { zh: "山社乡里的神职之女，以神乐事神、以祓词退魔。铃响处，神使应召而至。", en: "A shrine maiden of the hill shrines: kagura for the gods, purification words against the unclean. Where the bells ring, the emissaries answer." },
      story: {
        zh: "在尼朋，巫女的存在比大名的家纹更古老：史传有以鬼道事神、凭神谕号令诸部的女王，圣日朝廷的祭祀里也有终身侍神的斋王。权柄归于武士领主之后，她们退出庙堂，退回山社乡里，守着一方鸟居与一枚神乐铃过活。神乐之舞起于天岩户前的踏桶之响——旋至极处，舞者之身即为依代，神明降于其上，这便是巫女最古老的本事。乱世来临，社殿焚毁，妖物与邪祟趁乱横行；她们或坚守神社寸土不让，或化作行游列国的游方巫女，一路禊祓、封魔、退治邪祟。",
        en: "In Nippon the miko are older than any daimyo's crest: the chronicles remember queens who served the gods and commanded the tribes by oracle, and the Holy Sun Court still keeps priestesses sworn to a god for life. Once power passed to the warrior lords they withdrew from the halls to the hill shrines, living on one gate and one set of kagura bells. The dance itself began with the drumming of a tub before the rock cave of heaven — spun to its limit, the dancer's body becomes the vessel and the god comes down into it. That is the oldest thing a miko knows how to do. When the wars came the halls burned and the unclean things came out with them; some hold their shrine and give up no ground, others take to the roads as wandering miko, purifying, sealing and putting down what they find."
      },
      identity: [
        kv("角色位阶", "Rank", { zh: "英雄（泛用，可重复招募）", en: "Hero — generic, repeatable" }),
        kv("定位", "Class", { zh: "法师（Wizard），巫女法系", en: "Wizard of the Miko lore" }),
        kv("法系", "Lore", { zh: "巫女法系（与纱代共用）", en: "Lore of the Miko, shared with Sayo" })
      ],
      recruit: [
        kv("招募来源", "Source", { zh: "招募英雄面板「巫女」页签，由神社建筑解锁", en: "The Miko tab of the hero recruitment panel, opened by a shrine building" }),
        kv("解锁条件", "Unlocked by", { zh: "玉海舰队、山陽氏与奥本氏开局即可招募；其余震旦派系需先攻占北星道的橙色神華大社并完成「尼朋的祭仪」任务。可招性由岸上「稻荷大社」（定居点 3 级）、旗舰「船上稻荷本社」或地标「灵道本殿」（定居点 2 级）任一提供", en: "The Jade Sea Fleet, the Sanyo and the Okumoto can recruit from the start; other Cathay factions must first take the Temple of the Orange Simca in Hokuseido and finish the Rites of Nippon mission. Availability comes from any one of the Inari Grand Shrine (settlement level 3), the flagship's Shipboard Inari Shrine, or the Vim-To Main Hall landmark (settlement level 2)" }),
        kv("数量限制", "Cap", { zh: "无全局上限；同时在役名额由建筑提供 —— 灵兽神宫 +2、旗舰麟栖神宫 +2、灵道本殿 +1", en: "No global cap; concurrent slots come from buildings — Divine Beast Sanctuary +2, the flagship's Kirin Roost +2, Vim-To Main Hall +1" }),
        kv("招募费 / 维持费", "Cost / upkeep", { zh: "1000 / 250", en: "1000 / 250" })
      ],
      formsNote: {
        zh: "唯一战斗形态：白衣绯袴，步行随军，没有坐骑。",
        en: "One combat form only: white robe and vermilion hakama, on foot with the army, no mount."
      },
      forms: [{ zh: "徒步", en: "On foot" }],
      statRows: [
        { k: { zh: "护甲", en: "Armour" }, v: ["25"] },
        { k: { zh: "近战攻击", en: "Melee attack" }, v: ["44"] },
        { k: { zh: "近战防御", en: "Melee defence" }, v: ["50"] },
        { k: { zh: "武器威力（基础／破甲）", en: "Weapon damage (base / AP)" }, v: ["180 / 160"] },
        { k: { zh: "冲锋加成", en: "Charge bonus" }, v: ["10"] },
        { k: { zh: "生命值", en: "Health" }, v: ["4208"] },
        { k: { zh: "领导力", en: "Leadership" }, v: ["70"] },
        { k: { zh: "速度", en: "Speed" }, v: ["45"] }
      ],
      statNote: {
        zh: "特殊属性 —— 魔法攻击；巫女法系施法。",
        en: "Special: magical attacks; casts from the Lore of the Miko."
      },
      weapons: [
        {
          k: { zh: "巫女法器", en: "The miko's implements" },
          v: {
            zh: "180／160，魔法攻击。",
            en: "180 / 160, magical."
          }
        }
      ],
      traits: [
        kv("法术吟唱者", "Spellcaster", { zh: "唯一形态", en: "Her only form" })
      ],
      passives: [
        { k: { zh: "神懸かり", en: "Kamigakari, the Possession" }, form: { zh: "随『依代』解锁", en: "Unlocked by Vessel" }, v: { zh: "常驻：自身魔法抗性 +15%、领导力 +10（仅本人）", en: "Always on: +15% magic resistance and +10 leadership, for herself only" } },
        { k: { zh: "神域", en: "Sacred Precinct" }, form: { zh: "随『注連縄』解锁", en: "Unlocked by Shimenawa" }, v: { zh: "常驻光环：40 米内友军领导力 +10、魔法抗性 +10%", en: "A standing aura: +10 leadership and +10% magic resistance to allies within 40m" } }
      ],
      actives: [],
      attrs: [
        kv("激励友军", "Encouraging", { zh: "领导力光环", en: "Leadership aura" }),
        kv("于森林中隐蔽", "Hide in Forest", { zh: "藏身森林时不易被敌军发现", en: "Harder to spot while in forest" }),
        kv("精气之风精通", "Winds of Qi mastery", { zh: "军中多支部队共有此属性时，法术威力提升", en: "Magic power rises when several units in the army share it" })
      ],
      gear: { zh: "无。", en: "None." },
      tree: {
        note: {
          zh: "巫女法系与「神社巫女」专属线各自独立推进。法术节点为三级：Lv1 解锁基础施法，Lv2 解锁增幅施法并降冷却，Lv3 再降冷却、减失误与魔风消耗；『破魔矢』基础版 1 级白送，节点直接从增幅起步。法师型角色不设战斗分支。",
          en: "The Miko lore and the Shrine Miko line advance independently. Spell nodes have three ranks: rank 1 unlocks the base cast, rank 2 the overcast and a shorter cooldown, rank 3 cuts cooldown, miscast and winds cost further. The base Demon-Breaking Arrow is granted free at level 1, so its node starts at the overcast. Caster characters get no combat branch."
        },
        branches: [
          {
            id: "magic",
            label: { zh: "巫女法系", en: "Lore of the Miko" },
            sub: { zh: "六个法术 ＋ 一个学派被动，完全原创；通用施法节点原版复用", en: "Six spells and a lore passive, wholly original; the generic casting nodes are vanilla" },
            cols: [
              [node("k_m0", "破魔矢", "Demon-Breaking Arrow", {
                tier: 0,
                unlock: { zh: "起点 · 两级 · 基础版 1 级白送", en: "Starter · two ranks · the base cast is free at level 1" },
                desc: { zh: "巫女虚挽神弓，以破魔矢之咒射出净光。", en: "She draws a bow that is not there, and the arrow of cleansing light goes out." },
                effects: [
                  { zh: "基础：直线贯穿的破魔圣光矢，沿路径贯穿多个敌方单位；伤害 150／350 破甲、射程 200 米、魔风 6、冷却 43 秒", en: "Base: a single fast shaft that punches through several enemy units along its path; 150 / 350 damage, 200m range, 6 winds, 43s cooldown" },
                  { zh: "Lv1（增幅）：伤害 300／700、魔风 10；两版冷却降到 30.1 秒", en: "Rank 1 (overcast): 300 / 700 damage, 10 winds; both versions drop to a 30.1s cooldown" },
                  { zh: "Lv2（精通）：冷却 21.5 秒；增幅失误 −15%；魔风 基础 5／增幅 8", en: "Rank 2 (mastery): 21.5s cooldown, −15% overcast miscast, winds 5 base / 8 overcast" }
                ]
              })],
              [
                node("k_m1", "退魔", "Exorcism", {
                  tier: 1,
                  unlock: { zh: "学派被动 · 单级 · 前置：破魔矢", en: "Lore passive · single rank · requires Demon-Breaking Arrow" },
                  desc: { zh: "神事既起，邪祟自退。", en: "Once the rite begins, the unclean give ground on their own." },
                  effects: [{ zh: "每当她施放本法系任一法术：周身 55 米内敌军领导力 −5、近战攻击 −8、移速 ×0.9，持续 15 秒", en: "Each time she casts any spell of this lore: enemies within 55m take −5 leadership, −8 melee attack and ×0.9 speed for 15 seconds" }]
                }),
                node("k_m2", "神使召来：灵狐", "Emissary Summons: Fox", {
                  tier: 1,
                  unlock: { zh: "三级 · 前置：破魔矢", en: "Three ranks · requires Demon-Breaking Arrow" },
                  desc: { zh: "狐群闻铃而至，替巫女扑向阵前。", en: "The foxes come to the bell and go in ahead of her." },
                  effects: [
                    { zh: "基础：神乐铃三振，召来一队满编 48 只稻荷灵狐神使；契约 120 秒后灵体归座溃散。每场 3 次、魔风 8、冷却 60 秒", en: "Base: three shakes of the bells call a full unit of 48 Inari Fox Emissaries; the contract runs 120 seconds and then they return. Three casts per battle, 8 winds, 60s cooldown" },
                    { zh: "Lv2（增幅）：每场 4 次、施法距离 150 米、魔风 11；两版冷却降到 42 秒", en: "Rank 2 (overcast): four casts per battle, 150m cast range, 11 winds; both drop to 42s" },
                    { zh: "Lv3（精通）：冷却 30 秒；增幅失误 −15%；魔风 基础 7／增幅 9", en: "Rank 3 (mastery): 30s cooldown, −15% overcast miscast, winds 7 / 9" }
                  ]
                }),
                node("k_m3", "千本樱", "Thousand Cherry Blossoms", {
                  tier: 1,
                  unlock: { zh: "三级 · 前置：破魔矢", en: "Three ranks · requires Demon-Breaking Arrow" },
                  desc: { zh: "千瓣落樱皆是刃，过处不留邪祟。", en: "A thousand falling petals, every one an edge; nothing unclean is left where they pass." },
                  effects: [
                    { zh: "基础：目标点半径 12 米的落樱之域，每跳 3／4 破甲、持续 10 秒。魔风 8、冷却 45 秒、施法距离 150 米", en: "Base: a 12m field of falling blossom at the target point, 3 / 4 damage a tick for 10 seconds. 8 winds, 45s cooldown, 150m range" },
                    { zh: "Lv2（增幅）：半径 15 米、每跳 5／6、持续 12 秒、魔风 13；两版冷却降到 31.5 秒", en: "Rank 2 (overcast): 15m radius, 5 / 6 a tick, 12 seconds, 13 winds; both drop to 31.5s" },
                    { zh: "Lv3（精通）：冷却 22.5 秒；增幅失误 −15%；魔风 基础 7／增幅 11", en: "Rank 3 (mastery): 22.5s cooldown, −15% overcast miscast, winds 7 / 11" }
                  ]
                }),
                node("k_m4", "封魔之札", "Ward Talisman", {
                  tier: 1,
                  unlock: { zh: "三级 · 前置：破魔矢", en: "Three ranks · requires Demon-Breaking Arrow" },
                  desc: { zh: "御札钉处，邪祟俯首——纵是千军之将，寸步难行。", en: "Where the talisman is pinned the unclean bow; even a general of a thousand men does not take a step." },
                  effects: [
                    { zh: "基础：单体禁锢 —— 一个敌方单位完全无法移动、近战攻击 −8，持续 16 秒。魔风 9、冷却 38 秒、施法距离 100 米", en: "Base: a single enemy unit is rooted outright, −8 melee attack, for 16 seconds. 9 winds, 38s cooldown, 100m range" },
                    { zh: "Lv2（增幅）：转为群体 —— 目标点半径 32 米内敌军全部无法移动、近战攻击 −10、近战防御 −10，持续仍 16 秒；魔风 18；两版冷却降到 26.6 秒", en: "Rank 2 (overcast): becomes an area effect — every enemy within 32m rooted, −10 melee attack and −10 melee defence, still 16 seconds; 18 winds; both drop to 26.6s" },
                    { zh: "Lv3（精通）：冷却 19 秒；增幅失误 −15%；魔风 基础 8／增幅 16", en: "Rank 3 (mastery): 19s cooldown, −15% overcast miscast, winds 8 / 16" }
                  ]
                })
              ],
              [node("k_m5", "闪避", "Evasion", { reuse: true, hub: "4/4", unlock: { zh: "复用节点 · 需前 4 个并行节点全部点出", en: "Reused node · requires all four parallel nodes" } })],
              [
                node("k_m6", "禊祓", "Purification Rite", {
                  tier: 6,
                  unlock: { zh: "三级 · 高级位 · 前置：闪避", en: "Three ranks · upper tier · requires Evasion" },
                  desc: { zh: "御币一振，月露般的清辉落在伤者之间。", en: "One sweep of the gohei, and a light like moon-dew settles over the wounded." },
                  effects: [
                    { zh: "基础：45 米内所有友军每秒治疗 +0.8%、每秒疲劳 −1%，持续 20 秒；可补充受损兵模并复苏阵亡兵模。魔风 12、冷却 45 秒", en: "Base: allies within 45m heal 0.8% and shed 1% fatigue a second for 20 seconds; it both repairs damaged models and brings back dead ones. 12 winds, 45s cooldown" },
                    { zh: "Lv2（增幅）：范围 55 米、持续 26 秒、魔风 18；两版冷却降到 31.5 秒", en: "Rank 2 (overcast): 55m, 26 seconds, 18 winds; both drop to 31.5s" },
                    { zh: "Lv3（精通）：冷却 22.5 秒；增幅失误 −15%；魔风 基础 11／增幅 16", en: "Rank 3 (mastery): 22.5s cooldown, −15% overcast miscast, winds 11 / 16" }
                  ]
                }),
                node("k_m7", "神隐", "Divine Concealment", {
                  tier: 7,
                  unlock: { zh: "三级 · 高级位 · 前置：闪避", en: "Three ranks · upper tier · requires Evasion" },
                  desc: { zh: "铃声一止，阵中便少了一个人；再一止，又少了一个。", en: "The bells stop and one man is gone from the line; they stop again and there is one fewer." },
                  effects: [
                    { zh: "基础：地上升起一圈结界，半径 35 米内每个敌方单位每秒消失一名兵模，持续 8 秒。魔风 17、冷却 54 秒", en: "Base: a boundary rises from the ground and every enemy unit within 35m loses one model a second for 8 seconds. 17 winds, 54s cooldown" },
                    { zh: "Lv2（增幅）：持续延长到 16 秒（半径仍 35 米）、魔风 26；两版冷却降到 37.8 秒", en: "Rank 2 (overcast): 16 seconds, radius still 35m, 26 winds; both drop to 37.8s" },
                    { zh: "Lv3（精通）：冷却 27 秒；增幅失误 −15%；魔风 基础 16／增幅 24", en: "Rank 3 (mastery): 27s cooldown, −15% overcast miscast, winds 16 / 24" }
                  ]
                }),
                node("k_m8", "缚风大地", "Earthing", { reuse: true, unlock: { zh: "复用节点 · 前置：闪避", en: "Reused node · requires Evasion" } }),
                node("k_m9", "魔力储备", "Power Drain", { reuse: true, unlock: { zh: "复用节点 · 前置：闪避", en: "Reused node · requires Evasion" } })
              ],
              [node("k_m10", "奥术导管", "Arcane Conduit", { reuse: true, hub: "4/4", unlock: { zh: "复用节点 · 需前 4 个并行节点全部点出", en: "Reused node · requires all four parallel nodes" } })]
            ]
          },
          {
            id: "unique",
            label: { zh: "神社巫女", en: "Shrine Miko" },
            sub: { zh: "完全原创；中段两格与纱代共用同一技能", en: "Wholly original; two of the middle nodes are the same skill Sayo takes" },
            cols: [
              [node("k_u0", "依代", "Vessel", {
                tier: 0,
                unlock: { zh: "8 级解锁 · 单级 · 本线起点", en: "Level 8 · single rank · start of the line" },
                desc: { zh: "巫女以身为依代，神明暂寄其中。", en: "The miko makes her own body the vessel, and the god lodges in it a while." },
                effects: [
                  { zh: "所属军队魔法之风 +3", en: "+3 Winds of Magic for her army" },
                  { zh: "解锁常驻被动『神懸かり』：自身魔法抗性 +15%、领导力 +10（仅本人）", en: "Unlocks the standing passive Kamigakari: +15% magic resistance and +10 leadership, for herself only" }
                ]
              })],
              [
                node("k_u1", "神楽奉納", "Kagura Offering", {
                  tier: 1,
                  unlock: { zh: "单级 · 前置：依代 · 与纱代共享同一技能", en: "Single rank · requires Vessel · the same skill Sayo takes" },
                  desc: { zh: "神乐一奏，土地与人心一同安定下来。", en: "The kagura is played, and the land settles along with the people on it." },
                  effects: [{ zh: "所在省份公共秩序 +4、腐败 −4、增长 +8", en: "+4 public order, −4 corruption and +8 growth in her province" }]
                }),
                node("k_u2", "御守授与", "Granting of Charms", {
                  tier: 2,
                  unlock: { zh: "单级 · 前置：依代 · 与纱代共享同一技能", en: "Single rank · requires Vessel · the same skill Sayo takes" },
                  desc: { zh: "出阵前，武士从巫女手里接过一枚御守。", en: "Before they march, each samurai takes a charm from her hand." },
                  effects: [{ zh: "所属军队的全部尼朋单位（武士三支＋灵狐＋麒麟）魔法抗性 +10%、物理抗性 +10%", en: "+10% magic resistance and +10% physical resistance for every Nippon unit in her army: the three samurai units, the foxes and the Kirin" }]
                }),
                node("k_u3", "卜占", "Divination", {
                  tier: 3,
                  unlock: { zh: "单级 · 前置：依代", en: "Single rank · requires Vessel" },
                  desc: { zh: "灼骨观兆，先知者不惊。", en: "Read the scorched bone: the one who knows first is not caught out." },
                  effects: [{ zh: "视野 +10、所在军队伏击防御 +30%、伏击成功率 +15%", en: "+10 vision, +30% ambush defence and +15% ambush success chance for her army" }]
                }),
                node("k_u4", "神饌", "Sacred Offerings", {
                  tier: 4,
                  unlock: { zh: "单级 · 前置：依代", en: "Single rank · requires Vessel" },
                  desc: { zh: "神饌既备，神使自来。", en: "Set out the offering and the emissaries come of their own accord." },
                  effects: [
                    { zh: "稻荷灵狐使者与麒麟招募等级 +1、维护费 −15%、武器强度 +6", en: "Inari Fox Emissaries and Kirin: +1 recruit rank, −15% upkeep, +6 weapon strength" },
                    { zh: "所在省份招募位 +1", en: "+1 recruitment slot in her province" }
                  ]
                })
              ],
              [node("k_u5", "注連縄", "Shimenawa", {
                tier: 5,
                hub: "4/4",
                unlock: { zh: "单级 · 需点满前 4 个并行节点", en: "Single rank · requires all four parallel nodes" },
                desc: { zh: "绳既张，界既立——自此内为神域，外为浊世。", en: "The rope is strung and the boundary stands: inside is sacred ground, outside is the fouled world." },
                effects: [
                  { zh: "解锁常驻光环『神域』：40 米内友军领导力 +10、魔法抗性 +10%", en: "Unlocks the standing aura Sacred Precinct: +10 leadership and +10% magic resistance to allies within 40m" },
                  { zh: "所在区域敌军领导力 −6、敌方英雄行动成功率 −15%", en: "−6 enemy leadership and −15% enemy hero action success in her region" }
                ]
              })]
            ]
          },
          {
            id: "attrline",
            label: { zh: "属性小线", en: "Attribute side-lines" },
            sub: { zh: "两条两级侧支，各自独立", en: "Two independent two-rank side branches" },
            cols: [[
              node("k_a0", "調息", "Measured Breath", {
                tier: 0,
                unlock: { zh: "两级 · 侧支", en: "Two ranks · side branch" },
                desc: { zh: "息定则咒定，神乐不乱其节。", en: "Steady the breath and the words hold; the kagura keeps its beat." },
                effects: [{ zh: "Lv1 施法精通 +8%；Lv2 总计 +16%", en: "Rank 1: +8% spell mastery. Rank 2: +16% in total" }]
              }),
              node("k_a1", "白衣", "White Robe", {
                tier: 0,
                unlock: { zh: "两级 · 侧支", en: "Two ranks · side branch" },
                desc: { zh: "白衣加身，浊气不侵。", en: "In the white robe, the foul air does not reach her." },
                effects: [{ zh: "Lv1 物理抗性 +8%；Lv2 总计 +16%", en: "Rank 1: +8% physical resistance. Rank 2: +16% in total" }]
              })
            ]]
          },
          {
            id: "generic",
            label: { zh: "通用", en: "Generic" },
            sub: { zh: "四个孤立格，全为原版技能", en: "Four isolated vanilla nodes" },
            reuse: true,
            cols: [[
              node("k_g0", "震旦通用 · 魔抗", "Cathay generic — magic resistance", { reuse: true }),
              node("k_g1", "震旦通用 · 弹抗", "Cathay generic — missile resistance", { reuse: true }),
              node("k_g2", "不朽", "Immortal", { reuse: true }),
              node("k_g3", "导师", "Mentor", { reuse: true })
            ]]
          },
          {
            id: "campaign",
            label: { zh: "战役", en: "Campaign" },
            sub: { zh: "原样复用施法型行动英雄的战役行动", en: "The caster-agent campaign actions, reused as-is" },
            reuse: true,
            cols: [[
              node("k_p0", "补员", "Replenish", { reuse: true }),
              node("k_p1", "妨碍补员", "Block Replenishment", { reuse: true }),
              node("k_p2", "破坏城墙", "Damage Walls", { reuse: true }),
              node("k_p3", "击伤人物", "Wound Character", { reuse: true }),
              node("k_p4", "腐化被动", "Corruption passive", { reuse: true }),
              node("k_p5", "行家里手", "Old Hand", { reuse: true })
            ]]
          }
        ]
      }
    }
  ];

  /* ─────────── 更新记录 ─────────── */
  S.releases = {
    main: [
      {
        version: "1.0.3",
        date: "2026-09-05",
        type: "content",
        tags: ["main", "wuh-compat"],
        groups: [
          {
            head: { zh: "新增", en: "Added" },
            items: [
              { zh: "新增舰队兵种「云霄禁卫（海龙马骑兵）」，带有独特的定时魔法技能「天河倾」。", en: "New fleet unit: the **Empyrean Guard (Sea Longma Riders)**, with a timed magic ability of their own, The Heavenly River Tips." },
              { zh: "新增舰队炮兵「沧溟巨炮」，可以切换两种魔法炮弹「奔流」与「骤雨」。", en: "New fleet artillery: the **Abyssal Grand Cannon**, which can switch between two magic shells, Torrent and Cloudburst." },
              { zh: "玉海舰队的旗舰新增建筑链「舰上马厩」：三级链，逐级招募役农马军、玉勇枪骑兵与巨龙马骑兵。", en: "The Jade Sea Fleet's flagship gains a **Shipboard Stables** chain: three levels, recruiting Peasant Horsemen, then Jade Lancers, then Great Longma Riders." },
              { zh: "玉海舰队的旗舰新增建筑链「舰上海灵祠」：瑟兰娜加入舰队后解锁，逐级招募洛瑟恩海卫、纯水精魂、海元素与海龙兽，并为全舰队提供特殊保护。", en: "The flagship also gains a **Shipboard Sea Spirit Shrine** chain, unlocked once Serena joins the fleet: it recruits Lothern Sea Guard, Oceanids, Sea Elementals and the Merwyrm in turn, and grants ward save to the whole fleet." },
              { zh: "沈长风的技能树新增技能「枪炮与魔法」：提升舰队铳手、潮汐禁卫与沧溟巨炮的远程威力与弹药，并增强她自己的法术强度。", en: "Shen Changfeng's skill tree gains **Powder and Sorcery**: more missile damage and ammunition for Fleet Gunners, Tide Guard and the Abyssal Grand Cannon, and more magic power for herself." },
              { zh: "新增可选子 mod「[兵戈天下](https://steamcommunity.com/sharedfiles/filedetails/?id=3297754796) 兵种兼容包」：玉海舰队可以在旗舰上招募卫东列省的特色兵种。", en: "New optional submod: the **[War under Heaven](https://steamcommunity.com/sharedfiles/filedetails/?id=3297754796) unit compatibility patch**, which lets the Jade Sea Fleet recruit the Eastern Provinces' special units aboard the flagship." }
            ]
          },
          {
            head: { zh: "调整", en: "Changed" },
            items: [
              { zh: "沈长风的开局部队换新：巨炮改为沧溟巨炮，巨龙马骑兵改为云霄禁卫。", en: "Shen Changfeng's starting army is re-equipped: Grand Cannons become Abyssal Grand Cannons, and Great Longma Riders become Empyrean Guard." },
              { zh: "雷刃旗本与立花直虎补上了紫电特效。", en: "Thunderblade Hatamoto and Tachibana Naotora now have their Shiden effects." },
              { zh: "同伴任务的弹窗改成一张关掉再放下一张。", en: "Companion quest pop-ups now wait for one card to be closed before the next appears." }
            ]
          },
          {
            head: { zh: "修复", en: "Fixed" },
            items: [
              { zh: "其他震旦势力合邦沈长风之后，现在也能继续使用云帆号跃迁了。", en: "Other Cathay factions that confederate Shen Changfeng can now keep using the Cloud Sails leap." },
              { zh: "修复巨炮、玉勇等原版震旦部队的兵牌上挂着一个闪烁的升级箭头的问题。", en: "Grand Cannons, Jade Warriors and other vanilla Cathay units no longer carry a flickering upgrade arrow on their unit card." },
              { zh: "修复舰队铳手武器模型错位的问题。", en: "The Fleet Gunners' weapon model is no longer misaligned." }
            ]
          }
        ]
      },
      {
        version: "1.0.2",
        date: "2026-08-30",
        type: "balance",
        tags: ["main"],
        groups: [
          {
            head: { zh: "热修（2026-08-30）", en: "Hotfix (2026-08-30)" },
            items: [
              { zh: "沈长风的「震旦航海术」加强：贸易货物收益由 +10% 提高到 +20%，并新增港口产值 +10%。", en: "Shen Changfeng's Cathayan Seamanship is stronger: trade goods income raised from +10% to +20%, plus a new +10% to port income." },
              { zh: "沈长风的「玉海剑圣」新增战场主动技能「玉海剑舞」。", en: "Her Jade Sea Swordmaster skill now grants the Jade Blade Dance battle ability." },
              { zh: "凌涛坐骑的战场技能「潮随刃动」加强：伤害由 20 提高到 33（33% 破甲），冷却由 25 秒缩短到 15 秒。", en: "Tide Follows the Blade, on the Tidestrider mount, hits harder: damage goes from 20 to 33 (33% armour-piercing) and its cooldown from 25 seconds to 15." }
            ]
          },
          {
            head: { zh: "新增", en: "Added" },
            items: [
              { zh: "尼朋的建筑与地标现在会提供驻军。", en: "Nippon's buildings and landmarks now provide garrison units." },
              { zh: "侍所链与武者屋形链各新增一级入门建筑，长枪武士现在在 2 级定居点就能招募。", en: "The Samurai Hall and Warrior's Manor chains each gain an entry-level building, so Yari Samurai can be recruited from a level 2 settlement." }
            ]
          },
          {
            head: { zh: "调整", en: "Changed" },
            items: [{ zh: "雷刃旗本与麒麟的招募回合数由 1 回合增加到 2 回合。", en: "Thunderblade Hatamoto and Kirin now take 2 turns to recruit, up from 1." }]
          }
        ]
      },
      {
        version: "1.0.1",
        date: "2026-08-29",
        type: "content",
        tags: ["main", "nrs-compat"],
        groups: [
          {
            head: { zh: "热修（2026-08-30）", en: "Hotfix (2026-08-30)" },
            items: [{ zh: "修复瑟兰娜的行动列表为空、无法编入军队的问题。不用新开档。", en: "Serena's action list was empty and she could not be added to an army. No new campaign needed." }]
          },
          {
            head: { zh: "新增", en: "Added" },
            items: [
              { zh: "玉海舰队现在可以通过任务解锁**长牙之路**。任务目标：占领黎山或玉江三角洲，或以军事同盟控制其中之一。", en: "The Jade Sea Fleet can now unlock **the Ivory Road** through a mission. Objective: take Mount Li or the Jade River Delta, or hold one of them through a military alliance." },
              { zh: "新增可选子 mod **「Nippon, Land of the Rising Sun 兼容包」**。与 [Nippon, Land of the Rising Sun](https://steamcommunity.com/sharedfiles/filedetails/?id=3770643554) 同时开启时，两个 mod 不再互相顶掉传奇领主。⚠️ 需要新开存档。", en: "New optional submod: **the Nippon, Land of the Rising Sun compatibility pack**. With [Nippon, Land of the Rising Sun](https://steamcommunity.com/sharedfiles/filedetails/?id=3770643554) enabled alongside it, the two mods no longer overwrite each other's legendary lord. ⚠️ Requires a new save." },
              { zh: "其他震旦势力占下尼朋的城之后，现在也能建造当地的地标。", en: "Other Grand Cathay factions can now build Nippon's landmarks in Nipponese settlements they have taken." },
              { zh: "其他震旦势力可以通过占领**竜舰海港**解锁侍所与武士大将的招募、占领**橙色神華大社**解锁神社与巫女的招募，开局会收到对应任务；解锁之后不再受地域限制。", en: "Other Grand Cathay factions can unlock the Samurai Hall and Samurai Taisho recruitment by taking **Dragon Fleet Port**, and the Shrine chain and Miko recruitment by taking the **Temple of the Orange Simca**; they receive the matching missions at campaign start, and neither stays region-locked once unlocked." },
              { zh: "由 AI 操作的玉海舰队，会在开局及此后的战役进程中陆续自动生成瑟兰娜、立花直虎、纱代三位传奇英雄。", en: "An AI-controlled Jade Sea Fleet now spawns its three Legendary Heroes — Serena, Tachibana Naotora and Sayo — at campaign start and over the course of the campaign." }
            ]
          },
          {
            head: { zh: "修复", en: "Fixed" },
            items: [
              { zh: "修复沈长风的军队没有魔法之风储量、每场战斗开局魔风极少的问题。", en: "Shen Changfeng's armies had no Winds of Magic reserve and started every battle with almost none." },
              { zh: "修复巫女与纱代技能树倒数第二排那两格属性技能，点满第二级后属性不再增长的问题。", en: "The two attribute skills on the second-to-last row of the Miko's and Sayo's skill trees stopped granting attributes past the second point." },
              { zh: "修复瑟兰娜骑银月龙时不会喷吐「银月龙吐息」的问题；并补上步行、披甲伊瑟拉玛银战马、伊瑟拉玛银战车三个形态缺失的高等精灵被动「尚武造诣」。", en: "Serena would not use Moon Dragon Breath while mounted on the Moon Dragon. Her on-foot, Barded Ithilmar Steed and Ithilmar Chariot forms were also missing the High Elf passive Martial Prowess." },
              { zh: "修复其他 mod 给震旦新增的建筑与地标在玉海舰队这里一个都不出现的问题。现在其他 mod 给震旦加的新建筑，玉海舰队也能照常建造。", en: "Buildings and landmarks added to Grand Cathay by other mods did not appear at all for the Jade Sea Fleet. New Cathay buildings from other mods are now buildable as normal." },
              { zh: "修复武者屋形与舰上稻荷社在同伴尚未入队时，锁定提示显示为空白的问题。", en: "The Warrior's Manor and the Shipboard Inari Shrine showed a blank lock tooltip while their companion had not yet joined." },
              { zh: "补上纱代与瑟兰娜缺失的默认不朽。", en: "Sayo and Serena were missing the immortality they are meant to have by default." }
            ]
          }
        ]
      },
      {
        version: "1.0.0",
        date: "2026-08-28",
        type: "release",
        tags: ["main", "stronger-ai"],
        lede: {
          zh: "首次上线创意工坊。沈长风率玉海舰队远征尼朋，在极东之海寻找立足之地。",
          en: "First Workshop release. Shen Changfeng leads the Jade Sea Fleet east to Nippon, looking for a foothold in the eastern sea."
        },
        groups: [
          {
            head: { zh: "新阵营与角色", en: "New faction and characters" },
            items: [
              { zh: "新增可玩震旦派系 **「玉海舰队」**", en: "New playable Grand Cathay faction: **the Jade Sea Fleet**" },
              { zh: "传奇领主 **『无冕提督』沈长风**：专属游牧系统，可使用深渊系与阳系法术，拥有『云帆号跃迁』", en: "Legendary Lord **Shen Changfeng, the Uncrowned Admiral** — a nomadic faction with its own mechanics, casting from the Lore of the Deep and the Lore of Yang, with the Cloud Sails leap" },
              { zh: "三位传奇英雄（经远征同伴系统招募）：**『战鬼』立花直虎**、**『阴阳之巫女』纱代**、**瑟兰娜**", en: "Three Legendary Heroes, recruited through the Expedition Companions system: **Tachibana Naotora, the Ghost**, **Sayo, the Onmyo Miko**, and **Serena**" },
              { zh: "通用领主 **武士大将**：为尼朋兵种提供独特加成，可骑乘麒麟", en: "Generic lord **Samurai Taisho** — grants unique bonuses to Nipponese units, mountable on a Kirin" },
              { zh: "通用英雄 **巫女**：使用全新的巫女系法术", en: "Generic hero **Miko** — a shrine maiden with an entirely new Miko spell lore" }
            ]
          },
          {
            head: { zh: "远征同伴系统", en: "Expedition Companions" },
            items: [
              { zh: "四档羁绊：结缘 → 信任 → 托付 → 生死之交，每档解锁对应部队与加成", en: "Four bond tiers — Bound → Trusted → Sworn → Devoted — each unlocking that companion's units and bonuses" },
              { zh: "名望：在面板中用名望购买已解锁的部队", en: "Renown: spend it in the panel to buy the units you have unlocked" },
              { zh: "三条独立章节任务链", en: "Three separate chapter quest chains" }
            ]
          },
          {
            head: { zh: "兵种与建筑", en: "Units and buildings" },
            items: [
              { zh: "新增 8 个兵种 —— 舰队：玉海潮勇、潮汐禁卫、舰队铳手；尼朋：长枪武士、铁炮武士、雷刃旗本、麒麟、稻荷灵狐使者", en: "8 new units — Fleet: Jade Sea Warriors, Tide Guard, Fleet Gunners; Nippon: Yari Samurai, Teppo Samurai, Thunderblade Hatamoto, Kirin, Inari Fox Emissary" },
              { zh: "**旗舰建筑树**：玉海舰队的旗舰本身即一条建筑树", en: "**Flagship building tree**: the Jade Sea Fleet's flagship is itself a building tree" },
              { zh: "**尼朋地标 5 处**：引雷之峰、輝山锻冶场、枪术道场、神兽宫、灵道社殿", en: "**Five Nippon landmarks**: Thunder-Drawing Peak, Hikariya Forge, Yari Dojo, Divine Beast Sanctum, Vim-To Shrine" },
              { zh: "**尼朋建筑树**：神社链（稻荷神社 → 稻荷大社 → 灵兽神宫）与侍所链（侍所 → 旗本番）", en: "**Nippon building chains**: the shrine chain (Inari Shrine → Inari Grand Shrine → Divine Beast Sanctuary) and the samurai chain (Samurai Hall → Hatamoto Guard)" }
            ]
          },
          {
            head: { zh: "地图重组与 AI 强化", en: "Map reshuffle and AI buffs" },
            items: [
              { zh: "自动搬家 7 名原版传奇领主到尼朋及周边，可在 MCT 中关闭", en: "Relocates 7 vanilla legendary lords to Nippon and the lands around it — switchable off in MCT" },
              { zh: "搬家领主与岛上氏族（奥本氏、山陽氏）的 AI 强度抬到原版头部传奇势力水平；两家首领改为武士大将并附带不朽，首府开局即 4 级主城自带旗本番", en: "The relocated lords and the island clans (Okumoto, Sanyo) are pushed up to top-tier vanilla legendary AI strength; both clan leaders become immortal Samurai Taisho, and their capitals start as tier-4 cities with a Hatamoto Guard already built" }
            ]
          }
        ]
      }
    ],
    submod: [
      {
        slug: "nrs-compat",
        title: { zh: "Nippon Rising Sun 兼容包", en: "Nippon Rising Sun Compatibility Patch" },
        url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3792001152",
        tags: ["nrs-compat"],
        lede: {
          zh: "这个 mod 只有同时订阅了 **[Nippon, Land of the Rising Sun](https://steamcommunity.com/sharedfiles/filedetails/?id=3770643554)** 的玩家才需要装。",
          en: "You only need this mod if you are also subscribed to **[Nippon, Land of the Rising Sun](https://steamcommunity.com/sharedfiles/filedetails/?id=3770643554)**."
        },
        changes: [
          {
            date: "2026-08-30",
            body: { zh: "**NRS 的尼朋兵种现在可以在岸上招募了**：足轻、武士、骑马武士、武僧、忍者、符咒巨人、火炮等，拥有独特的建筑树。", en: "**NRS's Nippon units can now be recruited on shore**: Ashigaru, samurai, mounted samurai, warrior monks, ninjas, fuju giants, artillery and more, with a dedicated building tree." },
            sub: [
              { zh: "这些兵种可以享受震旦领主技能与科技的加成。", en: "These units benefit from Cathay lord skills and technologies." },
              { zh: "玉海舰队与岛上的尼朋派系开局即可招募；其他震旦派系开局会收到任务，攻占对应定居点后解锁。", en: "The Jade Sea Fleet and the Nippon factions on the island can recruit them from the start; other Cathay factions receive a mission at campaign start and unlock them by capturing the corresponding settlement." },
              { zh: "NRS 的领主与英雄暂不开放招募——它们的战役技能线还不完备。", en: "NRS's lords and heroes are not available for recruitment yet — their campaign skill trees are not complete." }
            ]
          },
          {
            date: "2026-08-30",
            body: { zh: "修复定居点在战役地图上不显示建筑模型的问题。原版震旦的城市、地图上的特殊定居点、乃至 NRS 自己的尼朋城市都受影响。", en: "Fixed settlements showing no building models on the campaign map. Vanilla Cathay cities, the map's special settlements and even NRS's own Nippon cities were all affected." }
          },
          {
            date: "2026-08-30",
            body: { zh: "修复震旦系派系攻占城市后没有任何占领选项的问题。NRS 自己的尼朋选项原样保留，两边互不影响。", en: "Fixed Cathay factions having no occupation options after capturing a city. NRS's own Nippon options are kept as they are, and neither side affects the other." }
          },
          {
            date: "2026-08-29",
            body: { zh: "首次兼容：玉海舰队改用另一个阵营位，两个 mod 不再互相顶掉传奇领主，双方派系可以同时出现在战役里。", en: "First compatibility pass: the Jade Sea Fleet moves to a different faction slot, so the two mods no longer overwrite each other's legendary lord and both factions can appear in the same campaign." },
            sub: [{ zh: "⚠️ 装上本包之前存的玉海舰队存档会读不出来。不装本包的玩家不受影响。", en: "⚠️ Jade Sea Fleet saves made before installing this patch will no longer load. Players who do not install it are unaffected." }]
          }
        ]
      },
      {
        slug: "cathay-compat",
        title: { zh: "震旦机制兼容包", en: "Cathay Mechanics Compatibility Patch" },
        url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3792252212",
        tags: ["cathay-compat"],
        lede: {
          zh: "给原版震旦加机制的 mod 大多按阵营发放，名单里没有玉海舰队就用不上。这个 mod 负责把玉海舰队补进名单，之后会继续接入更多这类 mod。",
          en: "Mods that add mechanics to vanilla Grand Cathay usually grant them faction by faction, and the Jade Sea Fleet is not on those lists. This mod puts it there, and more such mods will be added over time."
        },
        changes: [
          {
            date: "2026-08-30",
            body: { zh: "接入 **[震旦机制扩展：南皋工坊](https://steamcommunity.com/sharedfiles/filedetails/?id=3723969862)**：玉海舰队可以使用南皋工坊面板。", en: "Now covers **[Cathay Mechanism Expansion: Nan-Gau Workshop](https://steamcommunity.com/sharedfiles/filedetails/?id=3723969862)**: the Jade Sea Fleet can use the Nan-Gau Workshop panel." },
            sub: [
              { zh: "月后花园是妙影专属，未包含。", en: "The Garden of the Moon Empress is Miao Ying only and is not included." },
              { zh: "没装南皋工坊那个 mod 的话，本包会自动把入口隐藏。", en: "Without the Nan-Gau Workshop mod installed, the patch hides the entry point automatically." }
            ]
          },
          {
            date: "2026-08-30",
            body: { zh: "上线，首个接入 **[五行罗盘大修](https://steamcommunity.com/sharedfiles/filedetails/?id=3727513610)**：玉海舰队也能用上那个 mod 的新罗盘。", en: "Released, first covering **[Cathay Compass Overhaul](https://steamcommunity.com/sharedfiles/filedetails/?id=3727513610)**: the Jade Sea Fleet can use that mod's new compass." },
            sub: [{ zh: "只开兼容包、没开那个 mod 的话，罗盘会显示成元伯的面板。只影响外观，功能照常。", en: "With the patch on but that mod off, the compass shows Yuan Bo's panel instead. Appearance only — the mechanic still works." }]
          }
        ]
      },
      {
        slug: "yinyin-compat",
        title: { zh: "溟龙胤隐兵种兼容包", en: "Yin-Yin Unit Compatibility Patch" },
        url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3792695478",
        tags: ["yinyin-compat"],
        lede: {
          zh: "这个 mod 只有同时订阅了 **[溟龙胤隐](https://steamcommunity.com/sharedfiles/filedetails/?id=2989226363)** 的玩家才需要装。",
          en: "You only need this mod if you are also subscribed to **[Roar of the Jade Sea: Yin-Yin, the Sea Dragon](https://steamcommunity.com/sharedfiles/filedetails/?id=2989226363)**."
        },
        changes: [
          {
            date: "2026-08-30",
            body: { zh: "上线。**震旦派系现在可以招募胤隐的兵种**：玉海海贼、玉海铁雹队、玉海浪人、影行者、龙舰陆战水兵、缴获火炮、捕鲸食人魔、溟龙旗本队。", en: "Released. **Cathay factions can now recruit Yin-Yin's units**: Jade Sea Pirates, Jade Sea Teppogumi, Jade Sea Ronin, Ansatsusha, Dragon Fleet Marines, Looted Cannons, Ogre Whalers and the Sea Dragon's Hatamoto." },
            sub: [
              { zh: "原版震旦港口的 1 级和 3 级各开放一批；胤隐自己的「巨龙舰队驻防序列」由东方省专属改为全震旦可建。", en: "The vanilla Cathay port opens a batch at tier 1 and another at tier 3; Yin-Yin's own Naval Garrison chain goes from Eastern-Provinces-only to buildable by any Cathay faction." },
              { zh: "玉海舰队的旗舰新增「海贼舱」建筑链，原有的舰炮系列也补上了龙舰陆战水兵与捕鲸食人魔。", en: "The Jade Sea Fleet's flagship gains a Corsair Berth chain, and its existing Naval Cannons chain now recruits Dragon Fleet Marines and Ogre Whalers as well." },
              { zh: "新增精英部队「朱鹮营」（龙舰陆战水兵），领主 18 级后出现在招募面板的「精英部队」页签，全战役限 1 支。", en: "New Regiment of Renown: the Zhuqiao Brigade (Dragon Fleet Marines), which appears in the Regiments of Renown tab once your lord reaches level 18, capped at one per campaign." },
              { zh: "金鹭全系、伊塔扎林行者、怪兽与恐龙，以及胤隐本人与玉海海主／海女督未包含。", en: "The Golden Heron and its variants, Yi Cha Jungle Fighters, the kaiju and the dinosaurs, and Yin-Yin herself along with the Jade Sea Pirate Lord and Pirate Queen are not included." }
            ]
          }
        ]
      },
      {
        slug: "wuh-compat",
        title: { zh: "兵戈天下兵种兼容包", en: "War under Heaven Unit Compatibility Patch" },
        url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3795596611",
        tags: ["wuh-compat"],
        lede: {
          zh: "这个 mod 只有同时订阅了 **[兵戈天下](https://steamcommunity.com/sharedfiles/filedetails/?id=3297754796)** 的玩家才需要装。",
          en: "You only need this mod if you are also subscribed to **[War under Heaven](https://steamcommunity.com/sharedfiles/filedetails/?id=3297754796)**."
        },
        changes: [
          {
            date: "2026-09-03",
            body: { zh: "上线。**玉海舰队可以招募卫东列省的特色兵种**，在旗舰上招，开局即可。", en: "Released. **The Jade Sea Fleet can recruit the Eastern Provinces' special units**, aboard the flagship, from the start of the campaign." }
          }
        ]
      }
    ],
    tagLabels: {
      main: { zh: "本体", en: "Main mod" },
      "stronger-ai": { zh: "AI 强化", en: "Stronger AI" },
      "nrs-compat": { zh: "NRS 兼容包", en: "NRS compat" },
      "cathay-compat": { zh: "震旦兼容包", en: "Cathay compat" },
      "yinyin-compat": { zh: "胤隐兼容包", en: "Yin-Yin compat" },
      "wuh-compat": { zh: "兵戈天下兼容包", en: "War under Heaven compat" }
    }
  };

  /* ─────────── FAQ ─────────── */
  S.faq = [
    {
      slug: "gameplay",
      title: { zh: "玩法", en: "Gameplay" },
      items: [
        {
          slug: "caravans",
          status: "updated",
          version: "1.0.1",
          q: { zh: "玉海舰队能用商队吗？", en: "Can the Jade Sea Fleet use caravans?" },
          a: [{ zh: "玉海舰队的商队开局不可使用，完成占领黎山或玉江三角洲的任务即可解锁。解锁后科技树里的商队节点一并生效。", en: "Caravans are locked at the start and unlocked by a mission: take Mount Li or the Jade River Delta. Once unlocked, the caravan technology nodes work as well." }]
        },
        {
          slug: "landmarks",
          status: "updated",
          version: "1.0.1",
          q: { zh: "其他震旦派系打下尼朋的城之后，能建当地的地标吗？", en: "Can other Cathay factions build the Nippon landmarks after taking a settlement there?" },
          a: [{ zh: "占领对应定居点即可建造。", en: "Capturing the settlement is enough." }]
        },
        {
          slug: "shrine-and-hall",
          status: "updated",
          version: "1.0.1",
          q: { zh: "其他震旦派系能建神社链和侍所链吗？", en: "Can other Cathay factions build the Shrine and Samurai Hall chains?" },
          a: [{ zh: "占领竜舰海港解锁侍所链，占领橙色神華大社解锁神社链，开局会收到对应任务。解锁后不再受地域限制。武士大将与巫女的招募随同解锁。", en: "Capture Dragon Fleet Port to unlock the Samurai Hall chain and the Temple of the Orange Simca to unlock the Shrine chain; a mission for each is issued at the start. Once unlocked they are no longer restricted by region. Samurai Taisho and Miko recruitment unlocks with them." }]
        },
        {
          slug: "confederation",
          q: { zh: "合邦了玉海舰队，就能建尼朋建筑、招募这些兵种了吗？", en: "If I confederate the Jade Sea Fleet, can I build the Nippon buildings and recruit those units?" },
          a: [{ zh: "不能。要自己占领对应城市并完成任务，合邦不传递这个资格。", en: "No. You have to own the settlement and complete the mission yourself; confederation does not carry the unlock over." }]
        },
        {
          slug: "ai-heroes",
          status: "updated",
          version: "1.0.1",
          q: { zh: "玩其他派系时，AI 沈长风会有那三位传奇英雄吗？合邦之后能拿到吗？", en: "When I play another faction, does the AI Shen Changfeng get her three legendary heroes, and do they come with a confederation?" },
          a: [{ zh: "AI 的玉海舰队会在第 2、3、4 回合自动获得三位传奇英雄，合邦时会随之一起过来。", en: "The AI Jade Sea Fleet is given all three legendary heroes on turns 2, 3 and 4, and they come across with the confederation." }]
        }
      ]
    },
    {
      slug: "compatibility",
      title: { zh: "兼容性", en: "Compatibility" },
      items: [
        {
          slug: "nrs",
          status: "updated",
          version: "1.0.1",
          q: { zh: "能和 Nippon, Land of the Rising Sun 一起玩吗？", en: "Can I run this alongside Nippon, Land of the Rising Sun?" },
          a: [{ zh: "装上兼容子 mod 即可，两者不再互相顶掉传奇领主。**需要开新存档。**", en: "Install the compatibility submod and the two mods no longer overwrite each other's legendary lord. **A new campaign is required.**" }],
          links: [
            { label: { zh: "Nippon, Land of the Rising Sun", en: "Nippon, Land of the Rising Sun" }, url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3770643554" },
            { label: { zh: "兼容子 mod", en: "Compatibility submod" }, url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3792001152" }
          ]
        },
        {
          slug: "yin-yin",
          q: { zh: "和胤隐的 mod 兼容吗？", en: "Is it compatible with Yin-Yin's mod?" },
          a: [{ zh: "可以同时游玩。装上兵种兼容子 mod 后，震旦的派系还可以招募胤隐 mod 中的兵种。", en: "The two can be played together. With the unit compatibility submod installed, Cathay factions can also recruit the units added by the Yin-Yin mod." }],
          links: [
            { label: { zh: "溟龙胤隐", en: "Roar of the Jade Sea: Yin-Yin" }, url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2989226363" },
            { label: { zh: "兵种兼容子 mod", en: "Unit compatibility submod" }, url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3792695478" }
          ]
        },
        {
          slug: "other-cathay-buildings",
          status: "fixed",
          version: "1.0.1",
          q: { zh: "别的 mod 给震旦加的建筑和地标，玉海舰队能造吗？", en: "Do Cathay buildings and landmarks added by other mods show up for the Jade Sea Fleet?" },
          a: [{ zh: "现在可以正常建造了。", en: "They can be built normally now." }]
        }
      ]
    },
    {
      slug: "plans",
      title: { zh: "设定与计划", en: "Design and plans" },
      items: [
        {
          slug: "island-clans",
          q: { zh: "奥本氏、山陽氏这些本土派系会做成盟友、或者直接占用他们的槽位吗？", en: "Will the Okumoto and Sanyo Clans be made into allies?" },
          a: [{ zh: "它们是有意做成可以打掉、也可以结盟的存在，默认已经给了一些强度加成。周边其他震旦小派系基本很快就会覆灭，所以没有改动。", en: "They are meant to be factions you can either destroy or ally with, and they already have some strength bonuses by default. The other small Cathay factions nearby tend to be wiped out early, so they have not been changed." }]
        },
        {
          slug: "more-content",
          q: { zh: "以后还会加兵种和传奇英雄吗？", en: "Will there be more units and legendary lords or heroes?" },
          a: [{ zh: "还会加入新的传奇英雄和兵种，传奇英雄计划最终做到 6 到 7 名。", en: "Yes — more legendary heroes and more units. The aim is 6 to 7 legendary heroes in the end." }]
        }
      ]
    }
  ];

  /* ─────────── 工坊数据（示例数值） ─────────── */
  S.workshop = {
    asOf: "2026-09-06 04:12 UTC",
    items: [
      { key: "main-zh", id: "3790908242", name: { zh: "本体（中文）", en: "Main mod (Chinese)" }, subs: 41682, fav: 6134, views: 312450, rating: 96.4, d: 812 },
      { key: "main-en", id: "3790908523", name: { zh: "English Translation", en: "English Translation" }, subs: 18937, fav: 2401, views: 141220, rating: 95.1, d: 466 },
      { key: "ai", id: "3790907897", name: { zh: "AI 强化", en: "Stronger AI" }, subs: 12508, fav: 1188, views: 74310, rating: 93.8, d: 231 },
      { key: "nrs", id: "3792001152", name: { zh: "NRS 兼容包", en: "NRS Compatibility Patch" }, subs: 9764, fav: 1042, views: 58120, rating: 94.7, d: 187 },
      { key: "cathay", id: "3792252212", name: { zh: "震旦兼容包", en: "Cathay Compatibility Patch" }, subs: 8321, fav: 903, views: 46980, rating: 97.2, d: 154 },
      { key: "yinyin", id: "3792695478", name: { zh: "胤隐兼容包", en: "Yin-Yin Compatibility Patch" }, subs: 6890, fav: 741, views: 39440, rating: 95.9, d: 128 },
      { key: "wuh", id: "3795596611", name: { zh: "兵戈天下兼容包", en: "War under Heaven Compatibility Patch" }, subs: 2143, fav: 214, views: 12870, rating: 92.5, d: 143 }
    ]
  };

  /* ─────────── 兼容性（拓扑图数据；代称条目待实装时替换） ─────────── */
  S.compat = {
    lede: {
      zh: "玉海舰队与其他 mod 的关系分三种：完全兼容、无冲突、有冲突。需要兼容包的会在连线中间挂上那个包 —— 订阅它，两边才对得上。",
      en: "Three kinds of relationship: fully compatible, no conflict, conflicting. Where a compatibility patch is needed it sits on the line — subscribe to it and the two sides line up."
    },
    hub: { zh: "玉海舰队", en: "The Jade Sea Fleet" },
    hubSub: { zh: "远征尼朋 · 本体", en: "Nippon Expedition · core" },
    note: {
      zh: "标注「代称」的是占位条目，实装后替换为真实 mod 名与工坊链接。",
      en: "Entries marked “placeholder” are stand-ins; real mod names and Workshop links go in once implemented."
    },
    groups: [
      { key: "full", label: { zh: "完全兼容", en: "Fully compatible" }, desc: { zh: "可以一起游玩，玉海舰队可以使用他们的功能。", en: "Playable together, and the Jade Sea Fleet can use their mechanics." } },
      { key: "ok", label: { zh: "无冲突", en: "No conflict" }, desc: { zh: "可以一起游玩，但玉海舰队用不到他们的功能。", en: "Playable together, but the Jade Sea Fleet cannot use their mechanics." } },
      { key: "conflict", label: { zh: "有冲突", en: "Conflicts" }, desc: { zh: "一起游玩时会出现问题。", en: "Running both at once causes problems." } },
      { key: "required", label: { zh: "前置依赖", en: "Prerequisite" }, desc: { zh: "必须订阅，否则本体不工作。", en: "Must be subscribed or the mod will not work." } },
      { key: "lang", label: { zh: "语言包", en: "Language packs" }, desc: { zh: "软前置：按你的游戏语言选装，不装也能进游戏。", en: "Soft prerequisite: pick the one matching your game language; the mod still loads without it." } }
    ],
    nodes: [
      {
        key: "nrs", group: "full",
        short: { zh: "NRS", en: "NRS" },
        name: { zh: "Nippon, Land of the Rising Sun（NRS）", en: "Nippon, Land of the Rising Sun (NRS)" },
        url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3770643554",
        via: { short: { zh: "NRS", en: "NRS" }, label: { zh: "NRS 兼容包", en: "NRS patch" }, url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3792001152" },
        note: { zh: "装上 NRS 兼容包后两者可以同时开；注意装上兼容包后旧存档会失效。", en: "With the NRS patch both run together; note that installing it invalidates old saves." }
      },
      {
        key: "yinyin", group: "full",
        short: { zh: "胤隐", en: "Yin-Yin" },
        name: { zh: "Roar of the Jade Sea: Yin-Yin（胤隐）", en: "Roar of the Jade Sea: Yin-Yin" },
        url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2989226363",
        via: { short: { zh: "胤隐", en: "Yin-Yin" }, label: { zh: "胤隐兼容包", en: "Yin-Yin patch" }, url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3792695478" },
        note: { zh: "装兵种兼容包后双方可以互相招募。", en: "With the unit patch the two share recruitment." }
      },
      {
        key: "wuh", group: "full",
        short: { zh: "兵戈天下", en: "War under\nHeaven" },
        name: { zh: "War under Heaven（兵戈天下）", en: "War under Heaven" },
        url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3297754796",
        via: { short: { zh: "兵戈", en: "WuH" }, label: { zh: "兵戈天下兼容包", en: "War under Heaven patch" }, url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3795596611" },
        note: { zh: "装兵戈天下兼容包后玉海舰队接入其机制。", en: "The War under Heaven patch wires the fleet into its mechanics." }
      },
      {
        key: "compass", group: "full",
        short: { zh: "罗针大修", en: "Compass\nOverhaul" },
        name: { zh: "Cathay Compass Overhaul（罗针大修）", en: "Cathay Compass Overhaul" },
        url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3727513610",
        via: { short: { zh: "震旦机制", en: "Cathay" }, label: { zh: "震旦机制兼容包", en: "Cathay mechanics patch" }, url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3792252212" },
        note: { zh: "玉海舰队可以使用罗针盘面。", en: "The fleet can use the compass panel." }
      },
      {
        key: "nangau", group: "full",
        short: { zh: "南皋工坊", en: "Nan-Gau\nWorkshop" },
        name: { zh: "震旦机制扩展：南皋工坊", en: "Cathay Mechanism Expansion: Nan-Gau Workshop" },
        url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3723969862",
        via: { short: { zh: "震旦机制", en: "Cathay" }, label: { zh: "震旦机制兼容包", en: "Cathay mechanics patch" }, url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3792252212" },
        note: { zh: "玉海舰队可以使用南皋工坊面板；月后花园是妙影专属，未包含。", en: "The fleet can use the Nan-Gau Workshop panel; the Garden of the Moon Empress is Miao Ying only and not included." }
      },
      {
        key: "deer24", group: "full",
        short: { zh: "与龙同行", en: "Walking with\nDragons" },
        name: { zh: "Walking with Dragons（DEER24 震旦）", en: "Walking with Dragons (DEER24 Cathay)" },
        url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2789903784",
        via: { short: { zh: "震旦机制", en: "Cathay" }, label: { zh: "震旦机制兼容包", en: "Cathay mechanics patch" }, url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3792252212" },
        note: { zh: "可同时游玩，机制接入走震旦机制兼容包。", en: "Playable together; mechanics coverage comes through the Cathay patch." }
      },
      {
        key: "mct", group: "full",
        short: { zh: "MCT", en: "MCT" },
        name: { zh: "Mod Configuration Tool（MCT）", en: "Mod Configuration Tool (MCT)" },
        url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2927955021",
        note: { zh: "可选。装了就能在 MCT 里关掉搬家领主。", en: "Optional. With it installed you can switch lord relocation off from MCT." }
      },
      {
        key: "court", group: "ok", tbd: true,
        short: { zh: "震旦天廷", en: "Cathay Court" },
        name: { zh: "震旦天廷（代称）", en: "Cathay Court (placeholder)" },
        note: { zh: "不符合玉海舰队的派系背景，暂不接入；可以一起进游戏。", en: "Does not fit the fleet's faction background, so it is not wired in; the two still load together." }
      },
      {
        key: "techtree", group: "ok", tbd: true, planned: true,
        short: { zh: "科技树 mod", en: "Tech-tree mod" },
        name: { zh: "科技树类 mod（代称）", en: "Tech-tree mods (placeholder)" },
        note: { zh: "可以一起游玩。玉海舰队接入科技树在未来更新计划中。", en: "Playable together. Wiring the fleet into the tech tree is on the update roadmap." }
      },
      {
        key: "wanshi", group: "ok",
        short: { zh: "万世天朝", en: "Wanshi Tianchao" },
        name: { zh: "万世天朝", en: "Wanshi Tianchao" },
        url: "https://steamcommunity.com/workshop/filedetails/?id=3442971928",
        note: { zh: "可以一起游玩，机制未接入。", en: "Playable together; mechanics not wired in." }
      },
      {
        key: "jinhua", group: "conflict", tbd: true,
        short: { zh: "金花英雄\n扩展", en: "Golden Flower\nheroes" },
        name: { zh: "金花英雄扩展（代称）", en: "Golden Flower hero expansion (placeholder)" },
        note: { zh: "与本体占用同一个震旦英雄 type，同时开启会互相顶掉。", en: "Occupies the same Cathay hero type as the core mod; running both overwrites one another." }
      },
      {
        key: "mixerslot", group: "conflict",
        short: { zh: "同槽位\nMIXER", en: "Same MIXER slot" },
        name: { zh: "其他占用同一 MIXER 槽位的 mod", en: "Other mods on the same MIXER slot" },
        note: { zh: "本体借用 mixer_nip_nipponese_expedition 槽位，二者只能开一个。", en: "The core mod borrows the mixer_nip_nipponese_expedition slot — run only one of them." }
      },
      {
        key: "ownership", group: "conflict",
        short: { zh: "改尼朋地权", en: "Nippon\nownership" },
        name: { zh: "改动尼朋地权或派系的 mod", en: "Mods changing Nippon ownership or factions" },
        note: { zh: "可能冲突，尤其是同样搬家领主的。", en: "Likely to conflict, especially those that also relocate lords." }
      },
      {
        key: "iee", group: "required",
        short: { zh: "IEE", en: "IEE" },
        name: { zh: "Immortal Empires Expanded（IEE）", en: "Immortal Empires Expanded (IEE)" },
        url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3007996493",
        note: { zh: "前置，必须订阅。", en: "Prerequisite — must be subscribed." }
      },
      {
        key: "mixer", group: "required",
        short: { zh: "MIXER", en: "MIXER" },
        name: { zh: "Mixu's Unlocker（MIXER）", en: "Mixu's Unlocker (MIXER)" },
        url: "https://steamcommunity.com/sharedfiles/filedetails/?id=2859968660",
        note: { zh: "前置；本体借用 mixer_nip_nipponese_expedition 槽位。", en: "Prerequisite; the mod borrows the mixer_nip_nipponese_expedition slot." }
      }
    ],
    langs: [
      {
        key: "iee-zh", of: "iee", only: "zh",
        short: { zh: "IEE 汉化", en: "IEE Chinese" },
        name: { zh: "Immortal Empires Expanded 汉化", en: "Immortal Empires Expanded — Chinese localisation" },
        url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3008451029",
        note: { zh: "IEE 的中文本地化。中文玩家建议一起订阅；不装只是界面显示英文，不影响兼容性。", en: "Chinese localisation for IEE. Recommended for players on Chinese; skipping it only leaves IEE's text in English." }
      },
      {
        key: "main-en", of: "hub", only: "en",
        short: { zh: "本体英文化", en: "English Translation" },
        name: { zh: "远征尼朋 English Translation", en: "Nippon Expedition — English Translation" },
        url: "https://steamcommunity.com/sharedfiles/filedetails/?id=3790908523",
        note: { zh: "本体的英文文本。英文玩家需要订阅；中文玩家不用装。", en: "English text for the core mod. Subscribe if you play in English; players on Chinese do not need it." }
      }
    ]
  };

  /* ─────────── 私有页（示例数据） ─────────── */
  S.admin = {
    inbox: {
      filters: [
        { key: "all", label: { zh: "全部", en: "All" } },
        { key: "bug", label: { zh: "Bug", en: "Bug" } },
        { key: "question", label: { zh: "提问", en: "Question" } },
        { key: "compat", label: { zh: "兼容需求", en: "Compatibility" } },
        { key: "praise", label: { zh: "好评", en: "Praise" } },
        { key: "complaint", label: { zh: "不满", en: "Complaint" } }
      ],
      statuses: [
        { key: "new", label: { zh: "新", en: "New" } },
        { key: "wip", label: { zh: "处理中", en: "In progress" } },
        { key: "replied", label: { zh: "已回复", en: "Replied" } },
        { key: "fixed", label: { zh: "已修复", en: "Fixed" } }
      ],
      items: [
        { id: "c-8841", author: "Tsuchigumo", at: "2026-09-06 02:41", src: "main-zh", kind: "bug", status: "new", text: { zh: "云霄禁卫的「天河倾」在攻城战里放完之后动画卡住，部队一直悬空不落地。", en: "The Empyrean Guard's Heavenly River Tips leaves the animation stuck in a siege — the unit hangs in the air and never lands." } },
        { id: "c-8840", author: "海风不问", at: "2026-09-06 01:58", src: "main-zh", kind: "compat", status: "new", text: { zh: "求个和「万世天朝」的兼容，两个一起开的时候震旦科技面板会串。", en: "Please look at compatibility with Wanshi Tianchao — running both scrambles the Cathay technology panel." } },
        { id: "c-8838", author: "Grimwald", at: "2026-09-05 23:12", src: "main-en", kind: "question", status: "replied", text: { zh: "沧溟巨炮的两种炮弹要怎么切？我在部队卡上找不到按钮。", en: "How do I switch the Abyssal Grand Cannon's two shells? I cannot find the button on the unit card." } },
        { id: "c-8835", author: "Sanyo_Fan", at: "2026-09-05 21:44", src: "main-zh", kind: "praise", status: "new", text: { zh: "纱代第肆章的封印之战演出太顶了，玩到这里起了一身鸡皮疙瘩。", en: "Sayo's chapter IV, the Battle of the Seal — the staging is outstanding. Genuine goosebumps." } },
        { id: "c-8831", author: "kappa_ronin", at: "2026-09-05 19:03", src: "nrs", kind: "bug", status: "wip", text: { zh: "装了 NRS 兼容包以后，足轻的招募建筑在 3 级城里消失了，2 级城还在。", en: "With the NRS patch installed, the Ashigaru recruitment building disappears at settlement tier 3 but is still there at tier 2." } },
        { id: "c-8829", author: "白鹭洲", at: "2026-09-05 17:20", src: "main-zh", kind: "complaint", status: "new", text: { zh: "雷刃旗本改成 2 回合招募之后，前期节奏明显慢了一截，能不能给个折中。", en: "Since Thunderblade Hatamoto went to two turns the early pacing is noticeably slower. Could there be a middle ground?" } },
        { id: "c-8824", author: "Aislinn_", at: "2026-09-05 14:55", src: "main-en", kind: "question", status: "replied", text: { zh: "瑟兰娜的银月龙要到几级才能骑？技能树上没看到节点。", en: "What level does Serena need for the Moon Dragon? I do not see a node for it on the tree." } },
        { id: "c-8820", author: "苍梧", at: "2026-09-05 11:31", src: "cathay", kind: "compat", status: "fixed", text: { zh: "五行罗盘大修装上之后罗盘是元伯的面板，是不是漏了什么。", en: "With Cathay Compass Overhaul on, the compass shows Yuan Bo's panel. Is something missing?" } },
        { id: "c-8817", author: "Okumoto_Rei", at: "2026-09-05 09:07", src: "main-zh", kind: "bug", status: "fixed", text: { zh: "合邦沈长风之后云帆号跃迁的按钮是灰的。", en: "After confederating Shen Changfeng the Cloud Sails leap button is greyed out." } },
        { id: "c-8812", author: "yumi_no_kaze", at: "2026-09-04 22:48", src: "main-zh", kind: "question", status: "new", text: { zh: "长牙之路的任务是二选一还是都要打？描述里看不太清。", en: "Is the Ivory Road mission either-or, or do I need both objectives? The description is not clear." } }
      ]
    },
    trends: {
      note: { zh: "订阅总量与本体好评率，叠加版本发布点。示例数据。", en: "Total subscriptions and the main mod's positive rate, with release markers. Sample data." },
      days: [
        { d: "08-28", subs: 3120, rating: 91.0 },
        { d: "08-29", subs: 9840, rating: 92.4 },
        { d: "08-30", subs: 21460, rating: 93.9 },
        { d: "08-31", subs: 33780, rating: 94.6 },
        { d: "09-01", subs: 45210, rating: 95.0 },
        { d: "09-02", subs: 55980, rating: 95.3 },
        { d: "09-03", subs: 68340, rating: 95.1 },
        { d: "09-04", subs: 79120, rating: 95.6 },
        { d: "09-05", subs: 91470, rating: 96.0 },
        { d: "09-06", subs: 100235, rating: 96.4 }
      ],
      markers: [
        { d: "08-28", v: "1.0.0" },
        { d: "08-29", v: "1.0.1" },
        { d: "08-30", v: "1.0.2" },
        { d: "09-05", v: "1.0.3" }
      ]
    },
    report: {
      at: "2026-09-06 03:00 UTC",
      window: { zh: "近 48 小时 · 412 条新评论", en: "Last 48 hours · 412 new comments" },
      model: "claude-sonnet",
      clusters: [
        {
          kind: "bug",
          title: { zh: "新出现：云霄禁卫「天河倾」的动画残留", en: "New: Heavenly River Tips leaves an animation residue" },
          n: 23,
          trend: "up",
          body: { zh: "全部来自 v1.0.3 之后，集中在攻城战。多条描述一致：技能结束后单位悬空、不落地，重选部队可缓解。与 v1.0.2 之前的报告无重叠，判为新引入。", en: "All reports post-date v1.0.3 and cluster in sieges. Descriptions agree: the unit hangs in the air after the ability ends and does not come down; re-selecting the unit eases it. No overlap with pre-1.0.2 reports, so this reads as newly introduced." },
          refs: ["c-8841"]
        },
        {
          kind: "request",
          title: { zh: "反复提到：万世天朝兼容", en: "Repeatedly raised: Wanshi Tianchao compatibility" },
          n: 31,
          trend: "up",
          body: { zh: "自 8-31 起持续出现，最近两天占兼容类评论的 46%。多数指向震旦科技面板串位，而非阵营槽位冲突——大概率可以由震旦机制兼容包吸收。", en: "Present since 31 August and now 46% of compatibility comments over the last two days. Most point at the Cathay technology panel mis-slotting rather than a faction-slot clash, so this can most likely be absorbed by the Cathay mechanics patch." },
          refs: ["c-8840"]
        },
        {
          kind: "balance",
          title: { zh: "分歧：雷刃旗本 2 回合招募", en: "Split opinion: two-turn Hatamoto recruitment" },
          n: 18,
          trend: "flat",
          body: { zh: "反对与支持大致 2:1。反对方集中在前期节奏，支持方提到精锐感更足。没有出现「无法游玩」级别的措辞，判为口味分歧而非平衡缺陷。", en: "Roughly two to one against. The objections are about early pacing; supporters say it makes the unit feel elite. No unplayable-grade wording appears, so this reads as taste rather than a balance defect." },
          refs: ["c-8829"]
        },
        {
          kind: "docs",
          title: { zh: "重复提问：可以由文档消化的三个问题", en: "Repeat questions three docs entries would absorb" },
          n: 47,
          trend: "flat",
          body: { zh: "炮弹切换按钮在哪、银月龙的解锁等级、长牙之路是否二选一。三者各占 12–19 条，均已在常见问题或更新记录里有答案但玩家没找到——建议在兵种页与人物页直接写明。", en: "Where the shell-switch button is, what level unlocks the Moon Dragon, and whether the Ivory Road is either-or. Twelve to nineteen comments each; all three are already answered in the FAQ or changelog but players are not finding them. Worth stating directly on the unit and character pages." },
          refs: ["c-8838", "c-8824", "c-8812"]
        }
      ],
      kindLabels: {
        bug: { zh: "新 Bug", en: "New bug" },
        request: { zh: "需求", en: "Request" },
        balance: { zh: "平衡", en: "Balance" },
        docs: { zh: "文档", en: "Docs" }
      }
    },
    jobs: {
      note: { zh: "采集与分析任务的最近一次运行。示例数据。", en: "Most recent run of each collection and analysis job. Sample data." },
      items: [
        { name: { zh: "工坊指标抓取", en: "Workshop metrics scrape" }, cron: "*/15 * * * *", last: "2026-09-06 04:12", dur: "8.4s", state: "ok", note: { zh: "7 个条目全部成功", en: "All 7 items succeeded" } },
        { name: { zh: "评论抓取", en: "Comment scrape" }, cron: "0 * * * *", last: "2026-09-06 04:00", dur: "42.1s", state: "ok", note: { zh: "新增 19 条，去重后 17 条入库", en: "19 new, 17 stored after dedupe" } },
        { name: { zh: "评论分类", en: "Comment classification" }, cron: "10 * * * *", last: "2026-09-06 04:10", dur: "26.7s", state: "ok", note: { zh: "17 条已分类，置信度中位 0.91", en: "17 classified, median confidence 0.91" } },
        { name: { zh: "兼容性抽取", en: "Compatibility extraction" }, cron: "30 */6 * * *", last: "2026-09-06 00:30", dur: "1m 12s", state: "warn", note: { zh: "2 条 mod 名未能归并，已进待复核队列", en: "2 mod names could not be merged; queued for review" } },
        { name: { zh: "AI 聚类报告", en: "AI clustering report" }, cron: "0 3 * * *", last: "2026-09-06 03:00", dur: "3m 48s", state: "ok", note: { zh: "4 个聚类，覆盖 412 条", en: "4 clusters over 412 comments" } },
        { name: { zh: "静态站点部署", en: "Static site deploy" }, cron: "on push", last: "2026-09-05 20:14", dur: "1m 05s", state: "ok", note: { zh: "v1.0.3 更新记录上线", en: "v1.0.3 changelog published" } }
      ],
      stateLabels: {
        ok: { zh: "正常", en: "OK" },
        warn: { zh: "有告警", en: "Warning" },
        fail: { zh: "失败", en: "Failed" }
      }
    }
  };
})();
