#!/usr/bin/env python3
"""
build_art.py — 从 mod 仓库的美术母版生成站点用的图。

    pip install pillow
    python3 scripts/build_art.py [--mod <nippon_expedition 目录>]

--mod 默认是 ../nippon_expedition（本仓库在 mod 工作区里时的相对位置）。
mod 那边重画了兵牌 / 立绘之后重跑一次，产物入库。

产物（全部是生成物，别手改）：
    assets/units/<slug>.webp            兵牌 240×520，撕边
    assets/units/full/<slug>.webp       兵种页大图 640 宽，不撕边
    assets/chars/<key>.webp             人物卡 240×520，撕边
    assets/chars/full/<key>.webp        人物页大图 640 宽，12:26，不撕边（同兵种页）
    assets/scenes/<slug>.jpg            同伴横幅 800×450
    assets/site/poster-1800.webp        背景故事页头图

撕边遮罩全站共用一张：取 design/source 快照里 tide_guard_full_torn_edge.png 的 alpha，
按目标尺寸缩放——和 mod 仓库 tools/build_torn_edge.py 是同一张遮罩。mod 那边重画后
只更新了 `_full.png` 与游戏内的 120×260，不再有大尺寸撕边版，所以撕边在这里现做。

RGB 与 alpha 分开缩放：母版是不透明的，撕边只是盖上去的遮罩，先合成再缩会把边缘外的
颜色带进半透明像素里。
"""
from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
MASK_SRC = ROOT / "design/source/nippon_expedition/art_source/concepts/tide_guard/tide_guard_full_torn_edge.png"

CARD = (240, 520)
FULL_W = 640
SCENE = (800, 450)

# 站点 slug -> art_source/concepts 下的 `_full.png`
UNITS = {
    "jade-sea-warriors": "jade_sea_sailors/jade_sea_sailors_full.png",
    "tide-guard": "tide_guard/tide_guard_full.png",
    "fleet-gunners": "jade_sea_fleet_gunner/jade_sea_fleet_gunner_full.png",
    "empyrean-guard": "empyrean_guard/empyrean_guard_full.png",
    "abyssal-grand-cannon": "abyssal_grand_cannon/abyssal_grand_cannon_full.png",
    "yari-samurai": "yari_samurai/yari_samurai_full.png",
    "teppo-samurai": "teppo_samurai/teppo_samurai_full.png",
    "thunderblade-hatamoto": "hatamoto/thunderblade_hatamoto_full.png",
    "kirin": "kirin/kirin_full.png",
    "inari-fox": "shrine_messenger/shrine_messenger_full.png",
    "akatsuki-shu-katana": "akatsuki_shu_katana/akatsuki_shu_katana_full.png",
    "akatsuki-shu-bow": "akatsuki_shu_bow/akatsuki_shu_bow_full.png",
    "kunikuzushi-oni": "kunikuzushi_oni/kunikuzushi_oni_full.png",
    "yari-ashigaru": "yari_ashigaru/yari_ashigaru_full.png",
    "matchlock-ashigaru": "matchlock_ashigaru/matchlock_ashigaru_full.png",
    "bow-ashigaru": "bow_ashigaru/bow_ashigaru_full.png",
    "misaki-crow": "misaki_crow/misaki_crow_full.png",
}

# 人物：key -> `_full.png`（12:26 高清兵牌），和兵种一样同一张出人物卡与人物页大图。
# 2026-10-12 起七张原本只有 159–257 宽的（沈长风、直虎、纱代、瑟兰娜、伊吹两形、巫女）
# 已在 mod 那边高清化到约 709×1536（mod 提交 9b6fddc4），和武士大将、水师提督同一规格。
CHARS = {
    "shen-changfeng": "shen_changfeng/shen_changfeng_full.png",
    "naotora": "tachibana_naotora/tachibana_naotora_full.png",
    "sayo": "sayo/sayo_full.png",
    "serena": "serena/serena_full.png",
    "ibuki": "ibuki/ibuki_full.png",
    "ibuki-yokai": "ibuki/ibuki_yokai_full.png",
    "samurai-taisho-01": "samurai_daisho/samurai_taisho_01_full.png",
    "samurai-taisho-02": "samurai_daisho/samurai_taisho_02_full.png",
    "samurai-taisho-03": "samurai_daisho/samurai_taisho_03_full.png",
    "miko": "miko/miko_head1_full.png",
    "fleet-admiral-01": "admiral/admiral_01_full.png",
    "fleet-admiral-02": "admiral/admiral_02_full.png",
    "fleet-admiral-03": "admiral/admiral_03_full.png",
}

# 同伴横幅：任务弹窗插画的 16:9 母版（游戏里的 ui/eventpics 是它的 800×450 缩图）
SCENES = {
    "sayo": "sayo/sayo_background_landscape_16x9.png",
    "serena": "serena/serena_background.png",
    "naotora": "tachibana_naotora/tachibana_naotora_16x9.png",
    "ibuki": "ibuki/ibuki_event_16x9.png",
}

POSTER = "loading_posters/npex_loading_poster_v4_rain_backview_1920x1080.png"


def fit(im: Image.Image, size: tuple[int, int]) -> Image.Image:
    """等比缩放后居中裁到目标比例。"""
    tw, th = size
    scale = max(tw / im.width, th / im.height)
    w, h = round(im.width * scale), round(im.height * scale)
    im = im.resize((w, h), Image.LANCZOS)
    left, top = (w - tw) // 2, (h - th) // 2
    return im.crop((left, top, left + tw, top + th))


def to_width(im: Image.Image, w: int) -> Image.Image:
    return im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)


def torn_card(src: Path, mask: Image.Image) -> Image.Image:
    rgb = fit(Image.open(src).convert("RGB"), CARD)
    rgb.putalpha(mask.resize(CARD, Image.LANCZOS))
    return rgb


def save_webp(im: Image.Image, dst: Path, quality: int) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    im.save(dst, "WEBP", quality=quality, method=6)
    print(f"  {dst.relative_to(ROOT)}  {im.width}×{im.height}  {dst.stat().st_size // 1024} KB")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--mod", type=Path, default=ROOT.parent / "nippon_expedition")
    args = ap.parse_args()
    concepts = args.mod / "art_source" / "concepts"
    if not concepts.is_dir():
        raise SystemExit(f"找不到 {concepts}，用 --mod 指到 mod 仓库的 nippon_expedition 目录")

    mask = Image.open(MASK_SRC).convert("RGBA").getchannel("A")

    print("兵牌")
    for slug, rel in UNITS.items():
        src = concepts / rel
        save_webp(torn_card(src, mask), ROOT / "assets/units" / f"{slug}.webp", 90)
        save_webp(to_width(Image.open(src).convert("RGB"), FULL_W), ROOT / "assets/units/full" / f"{slug}.webp", 85)

    print("人物")
    for key, rel in CHARS.items():
        src = concepts / rel
        save_webp(torn_card(src, mask), ROOT / "assets/chars" / f"{key}.webp", 90)
        save_webp(to_width(Image.open(src).convert("RGB"), FULL_W), ROOT / "assets/chars/full" / f"{key}.webp", 85)

    print("同伴横幅")
    for slug, rel in SCENES.items():
        dst = ROOT / "assets/scenes" / f"{slug}.jpg"
        fit(Image.open(concepts / rel).convert("RGB"), SCENE).save(dst, "JPEG", quality=86, optimize=True, progressive=True)
        print(f"  {dst.relative_to(ROOT)}  {dst.stat().st_size // 1024} KB")

    print("头图")
    poster = Image.open(concepts / POSTER).convert("RGB")
    save_webp(poster.resize((1800, round(poster.height * 1800 / poster.width)), Image.LANCZOS),
              ROOT / "assets/site/poster-1800.webp", 82)


if __name__ == "__main__":
    main()
