#!/usr/bin/env python3
"""
subset_fonts.py — 把 LXGW WenKai GB 裁到这个站实际渲染的那些字。

改编自旧站 ../nippon-expedition-site/scripts/subset_fonts.py，两处不同：

1. **不再生成 fonts.css。** 字体由 next/font/local 加载（ROADMAP 决定 12），
   @font-face 是它写的——写重量区间 "100 500" / "600 900" 的地方在 app/fonts.ts。
   文件名也不用自己哈希，Next 会哈希。
2. **取字的口径和 scripts/check-font-coverage.mjs 完全一致**：只扫 content/，
   JSON 里跳过 `_comment`。两边不一致的话，覆盖表要么白白变大，要么漏字。
   ⚠️ 不扫 app/ 和 components/：那些文件里的中文全是注释，扫进来会让子集凭空大一圈。
   组件里唯一的中文字面量是语言开关的「中文」，在 EXTRA 里兜着。

为什么要 GB 版、为什么 Medium 声明成 700：LXGW WenKai 默认版沿用 Klee One，
中日共用字保留日文字形（者 骨 真 直 海 每）；GB 版归一成大陆标准字形。
代价是它最重只到 Medium，没有 Bold——所以把 Medium 映射到 700。
Regular→Medium 是两级跳，看得出是粗体；旧的 PingFang 栈只能 Medium→Semibold，
所以强调根本看不出来。

    pip install fonttools brotli
    python3 scripts/subset_fonts.py

产物（都要入库，CI 不装 fonttools）：
    assets/fonts/lxgw-wenkai-gb-{regular,medium}.woff2
    assets/fonts/coverage.txt
"""
from __future__ import annotations

import json
import shutil
import subprocess
import tempfile
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FONTS_DIR = ROOT / "assets" / "fonts"
COVERAGE = FONTS_DIR / "coverage.txt"

FONT_VERSION = "v1.522"
RELEASE_URL = "https://github.com/lxgw/LxgwWenkaiGB/releases/download/{ver}/{file}"

# (源字面, 输出名) —— 重量区间写在 app/fonts.ts 里
FACES = [
    ("LXGWWenKaiGB-Regular.ttf", "lxgw-wenkai-gb-regular"),
    ("LXGWWenKaiGB-Medium.ttf", "lxgw-wenkai-gb-medium"),
]

# 和 check-font-coverage.mjs 一样递归扫 content/（图鉴在 content/codex/ 底下好几层）
SOURCE_GLOBS = ["content/**/*.json", "content/**/*.md", "messages/*.json"]

# 模板和将来的条目可能用到、但当前没有哪个文件正好含有的标点与符号。带着很便宜。
# 「中文」是语言开关里唯一的中文字面量（组件里的，不在 content/）。
EXTRA = (
    "中文"
    "　、。〃〈〉《》「」『』【】〔〕・ー—…‥‧※"
    "！＂＃＄％＆＇（）＊＋，－．／：；＜＝＞？＠［＼］＾＿｀｛｜｝～"
    "±×÷≈≠≤≥←↑→↓↔√∞°′″¥€£§¶†‡•‰"
    "①②③④⑤⑥⑦⑧⑨⑩⚠✓✕→↗"
)


def strings_in(path: Path) -> list[str]:
    """和 check-font-coverage.mjs 同一口径：JSON 只取会渲染的字符串，跳过 _comment。"""
    raw = path.read_text(encoding="utf-8")
    if path.suffix != ".json":
        return [raw]
    out: list[str] = []

    def visit(v) -> None:
        if isinstance(v, str):
            out.append(v)
        elif isinstance(v, list):
            for x in v:
                visit(x)
        elif isinstance(v, dict):
            for k, x in v.items():
                if k != "_comment":
                    visit(x)

    visit(json.loads(raw))
    return out


def collect_chars() -> set[str]:
    chars: set[str] = set(EXTRA)
    for pattern in SOURCE_GLOBS:
        for path in sorted(ROOT.glob(pattern)):
            for s in strings_in(path):
                chars |= set(s)
    # ASCII 由 Sofia Sans 负责；控制字符和 emoji 变体选择符没有字形要带
    return {c for c in chars if ord(c) > 0x7F and not (0xFE00 <= ord(c) <= 0xFE0F)}


def fetch(file_name: str, cache: Path) -> Path:
    dest = cache / file_name
    if dest.exists() and dest.stat().st_size > 1_000_000:
        return dest
    url = RELEASE_URL.format(ver=FONT_VERSION, file=file_name)
    print(f"[fonts] 下载 {file_name}（{FONT_VERSION}）…")
    cache.mkdir(parents=True, exist_ok=True)
    with urllib.request.urlopen(url) as resp, dest.open("wb") as fh:
        shutil.copyfileobj(resp, fh)
    return dest


def main() -> None:
    if shutil.which("pyftsubset") is None:
        raise SystemExit("找不到 pyftsubset —— 先跑：pip install fonttools brotli")

    chars = collect_chars()
    print(f"[fonts] content/ 里有 {len(chars)} 个非 ASCII 字符")

    cache = Path(tempfile.gettempdir()) / "lxgw-wenkai-gb"
    FONTS_DIR.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory() as tmp:
        char_file = Path(tmp) / "chars.txt"
        char_file.write_text("".join(sorted(chars)), encoding="utf-8")

        for src_name, stem in FACES:
            src = fetch(src_name, cache)
            out = FONTS_DIR / f"{stem}.woff2"
            subprocess.run(
                [
                    "pyftsubset", str(src),
                    f"--text-file={char_file}",
                    "--flavor=woff2",
                    "--layout-features=*",
                    f"--output-file={out}",
                ],
                check=True,
            )
            print(f"[fonts] {out.relative_to(ROOT)}  {out.stat().st_size // 1024} KB")

    COVERAGE.write_text("".join(sorted(chars)), encoding="utf-8")
    print(f"[fonts] {COVERAGE.relative_to(ROOT)}  {len(chars)} 字")


if __name__ == "__main__":
    main()
