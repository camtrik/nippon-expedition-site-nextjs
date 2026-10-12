/* 兵种技能 / 特性 / 部队属性
   文案与图标出处：design-input/vanilla/（原版 = Creative Assembly / SEGA，随 TWW3 本体分发；npex = 本 mod 原创）
   desc 为游戏内实际描述，已剥离 [[img:...]] / [[col]] 富文本标记。
   effect 为本站补充的数值说明，非游戏原文。 */
(function () {
  var IC = "assets/vanilla/";

  var A = {
    harmony_yin: {
      icon: IC + "harmony_yin.png", source: "vanilla",
      name: { zh: "武道宁和：阴", en: "Battle Harmony: Yin" },
      desc: { zh: "万物皆应平衡，正所谓暗与明、月与阳、雄与雌一般。", en: "There must be balance in all things: dark and light, moon and sun, female and male." },
      effect: { zh: "阴阳宁和生效时：速度 +4%、领导力 +4、装填技能 +12", en: "While Harmony applies: +4% speed, +4 leadership, +12 reload skill" }
    },
    bushido: {
      icon: IC + "unit_passive_bushido.png", source: "npex",
      name: { zh: "武士道", en: "Bushido" },
      desc: { zh: "若无法守护应当守护之人，纵使苟活，武士亦与死人无异。", en: "A samurai who cannot protect those they are duty-bound to protect is no different from the dead, even if they cling to life." },
      effect: { zh: "生命值降至 50% 或以下时自动激活：基础／破甲武器杀伤 +15%、近战攻击 +10、永不败逃，持续 25 秒。与长枪武士共享", en: "Triggers at 50% health or below: +15% base and AP weapon damage, +10 melee attack, unbreakable, for 25 seconds. Shared with the Yari Samurai" }
    },
    blade_unison: {
      icon: IC + "unit_passive_blade_unison.png", source: "npex",
      name: { zh: "人剑合一", en: "Unity of Blade and Self" },
      desc: { zh: "能成为旗本的武士早已在剑术上登峰造极。", en: "A samurai who has risen to become a hatamoto has already mastered swordsmanship to its very peak." },
      effect: { zh: "生命值高于 25% 时常驻：近战攻击 +10、近战防御 +10；跌破 25% 自动失效", en: "Active above 25% health: +10 melee attack, +10 melee defence; lapses below 25%" }
    }
  };

  var B = {  /* up: true = 优点, false = 缺点 */
    anti_large: {
      up: true, icon: null, source: "vanilla",
      name: { zh: "反大型部队", en: "Anti-Large" },
      desc: { zh: "反大型部队可以有效应对体积至少等同马匹的目标。这一特性会有很多具体表现形式，如面对大型目标时的伤害加成，或者可以集聚到很小一片区域的强力攻击等等。", en: "Anti-large units have an advantage against targets that are at least as large as a horse. This advantage can be a damage bonus against large targets, or an attack that focuses on a very small area." },
      effect: { zh: "长柄刀近战对大型目标 +18", en: "+18 melee against large targets" }
    },
    armour_piercing: {
      up: true, icon: null, source: "vanilla",
      name: { zh: "破甲杀伤", en: "Armour-Piercing" },
      desc: { zh: "具有破甲属性的武器可在大多数情况下无视目标的护甲，这让他们成为了对抗重甲部队时的有效选择。但这些部队一般较为重型，且攻击频率不高，这也让他们在对抗轻装部队时显得有些吃力。", en: "The damage of armour-piercing weapons mostly ignores the armour of the target, making them the ideal choice against heavily-armoured enemies. They are often heavier and attack at a slower rate though, making them less efficient against poorly-armoured targets." }
    },
    armoured: {
      up: true, icon: null, source: "vanilla",
      name: { zh: "装备重甲", en: "Armoured" },
      desc: { zh: "重甲部队可以扣减除了破甲杀伤之外的所有种类的杀伤。", en: "Armoured units can block damage from any source apart from Armour-Piercing damage." }
    },
    hybrid: {
      up: true, icon: null, source: "vanilla",
      name: { zh: "混合武器部队", en: "Hybrid Unit" },
      desc: { zh: "这支部队的主要职责是近战部队，但也可以进行远程攻击。", en: "This unit is primarily a melee unit, but has missile capability too." }
    },
    deflect_shots: {
      up: true, icon: null, source: "vanilla",
      name: { zh: "斩箭术", en: "Deflect Shots" },
      desc: { zh: "使用巨剑斩开射来的箭矢，这是一项很难学习的技术：剑刃领主们并不鼓励这种训练，但真正的剑圣可不会让谨慎占了荣誉的上风。", en: "The art of deflecting arrows with a greatsword is painful to learn; such training is discouraged by Bladelord officers, but no true Swordmaster will let caution best his pride." },
      effect: { zh: "30% 远程格挡——以剑技拨落箭矢，非盾牌格挡，故双手大太刀仍可挡箭", en: "30% missile block — arrows knocked down by swordsmanship rather than a shield, so a two-handed blade still blocks" }
    },
    yin: {
      up: true, icon: null, source: "vanilla",
      name: { zh: "阴", en: "Yin" },
      desc: { zh: "此部队的武道宁和为阴。", en: "This unit counts as a Yin unit for the purpose of Battle Harmony proximity." }
    }
  };

  var T = {
    charge_defense_vs_large: {
      icon: IC + "charge_defense_vs_large.png", source: "vanilla",
      name: { zh: "抵御冲锋（大型部队）", en: "Charge Defence vs. Large" },
      desc: { zh: "当阵列齐整时，这支部队在对抗大型部队冲锋时会无视其所有的冲锋加成。", en: "When bracing, this unit negates the charge bonus of any large attacker." }
    },
    charge_reflection: {
      icon: IC + "charge_reflection.png", source: "vanilla",
      name: { zh: "冲锋反制", en: "Charge Reflection" },
      desc: { zh: "当阵列齐整时，这支部队可以对冲锋而来的敌军造成额外伤害。", en: "When bracing, this unit causes additional damage when attacking charging enemies." }
    },
    fatigue_immune: {
      icon: IC + "fatigue_immune.png", source: "vanilla",
      name: { zh: "体力充沛", en: "Perfect Vigour" },
      desc: { zh: "纵使执行的是最令人筋疲力尽的行动，这支部队也永远不会损失体力。", en: "Even when performing the most fatiguing actions, this unit never loses vigour." }
    },
    hide_forest: {
      icon: IC + "hide_forest.png", source: "vanilla",
      name: { zh: "于森林中隐蔽", en: "Hide (forest)" },
      desc: { zh: "这支部队可以隐蔽在森林里，除非敌人走到近前，否则他们不会被发现。", en: "This unit can hide in forests until enemy units get too close." }
    },
    immune_to_psychology: {
      icon: IC + "immune_to_psychology.png", source: "vanilla",
      name: { zh: "心理免疫", en: "Immune to Psychology" },
      desc: { zh: "这支部队免疫心理攻击（恐惧与惊骇）。", en: "The unit is immune to psychological attacks (Fear & Terror)." }
    },
    causes_fear: {
      icon: IC + "causes_fear.png", source: "vanilla",
      name: { zh: "引发恐惧", en: "Causes Fear" },
      desc: { zh: "这支部队可以对所有敌军部队引发恐惧，令附近敌军遭受领导力惩罚。同时这支部队自身也对恐惧效果免疫。恐惧惩罚不能叠加。", en: "This unit frightens all enemy units, reducing their leadership when nearby. It is also immune to fear. Fear penalties do not stack." }
    }
  };

  window.UNIT_SKILLS = {
    "tide-guard": {
      abilities: [A.harmony_yin],
      bullets: [B.anti_large, B.armour_piercing, B.hybrid, B.armoured, B.yin],
      attrs: [T.charge_defense_vs_large, T.charge_reflection, T.hide_forest, T.immune_to_psychology, T.fatigue_immune]
    },
    "thunderblade-hatamoto": {
      abilities: [A.bushido, A.blade_unison],
      bullets: [B.armoured, B.armour_piercing, B.deflect_shots],
      attrs: [T.causes_fear, T.hide_forest, T.immune_to_psychology, T.fatigue_immune]
    }
  };
})();
