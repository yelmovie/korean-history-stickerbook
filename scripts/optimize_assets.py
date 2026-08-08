# -*- coding: utf-8 -*-
"""원본 PNG를 webp로 최적화하고, 원본은 public/ 밖 source-assets/로 이동한다.
재실행해도 안전(이미 처리된 항목은 건너뜀). 삭제는 하지 않는다 — 이동만 한다."""
import json
import shutil
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PUB = ROOT / "public"
SRC_ASSETS = ROOT / "source-assets"
OPT_ICONS = PUB / "assets" / "opt" / "icons"
OPT_BG = PUB / "assets" / "opt" / "bg"
SOUND_DST = PUB / "assets" / "sound"
DOCS = ROOT / "docs"

ICON_MAX = 512
BG_MAX_W = 1600

asset_map = {"icons": {}, "backgrounds": {}}

for d in [SRC_ASSETS / "icons-numbered", SRC_ASSETS / "icons-originalimg",
          SRC_ASSETS / "samplepages", OPT_ICONS, OPT_BG, SOUND_DST, DOCS]:
    d.mkdir(parents=True, exist_ok=True)

icons_dir = PUB / "icons"
numbered = sorted(icons_dir.glob("[0-9]*.png"), key=lambda p: int(p.stem)) if icons_dir.exists() else []
chatgpt = sorted(icons_dir.glob("ChatGPT*.png")) if icons_dir.exists() else []

# 1) 번호 아이콘 → i###.webp (알파 유지)
for p in numbered:
    n = int(p.stem)
    out = OPT_ICONS / f"i{n:03d}.webp"
    if not out.exists():
        im = Image.open(p).convert("RGBA")
        im.thumbnail((ICON_MAX, ICON_MAX), Image.LANCZOS)
        im.save(out, "WEBP", quality=85, method=6)
    asset_map["icons"][f"i{n:03d}"] = {"opt": f"/assets/opt/icons/i{n:03d}.webp", "original": p.name}
    shutil.move(str(p), SRC_ASSETS / "icons-numbered" / p.name)

# 2) ChatGPT 원본 중 16:9(1672x941) → bg##.webp, 나머지는 이동만
bg_idx = 0
for p in chatgpt:
    with Image.open(p) as im:
        is_bg = im.size == (1672, 941)
        if is_bg:
            bg_idx += 1
            out = OPT_BG / f"bg{bg_idx:02d}.webp"
            if not out.exists():
                w, h = im.size
                if w > BG_MAX_W:
                    im = im.resize((BG_MAX_W, int(h * BG_MAX_W / w)), Image.LANCZOS)
                im.convert("RGB").save(out, "WEBP", quality=80, method=6)
            asset_map["backgrounds"][f"bg{bg_idx:02d}"] = {"opt": f"/assets/opt/bg/bg{bg_idx:02d}.webp", "original": p.name}
    shutil.move(str(p), SRC_ASSETS / "icons-originalimg" / p.name)

# 3) 샘플 화면 → source-assets (디자인 참고용, 앱 미사용)
sp = PUB / "samplepages"
if sp.exists():
    for p in sp.glob("*.png"):
        shutil.move(str(p), SRC_ASSETS / "samplepages" / p.name)
    sp.rmdir()

# 4) 사운드 이동, 설계 JSON → docs, 빈 폴더 정리
snd = PUB / "sound"
if snd.exists():
    for p in snd.glob("*.mp3"):
        shutil.move(str(p), SOUND_DST / p.name)
    if (snd / "bgx").exists():
        (snd / "bgx").rmdir()
    snd.rmdir()
data_dir = PUB / "data"
if data_dir.exists():
    for p in data_dir.glob("*.json"):
        shutil.move(str(p), DOCS / p.name)
    data_dir.rmdir()
bg_dir = PUB / "background"
if bg_dir.exists() and not any(bg_dir.iterdir()):
    bg_dir.rmdir()
if icons_dir.exists() and not any(icons_dir.iterdir()):
    icons_dir.rmdir()

(DOCS / "asset-map.json").write_text(json.dumps(asset_map, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"icons: {len(asset_map['icons'])}, backgrounds: {len(asset_map['backgrounds'])}")
