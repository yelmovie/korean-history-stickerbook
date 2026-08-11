# 다이어리 꾸미기용 추가 에셋 프롬프트 (2026-08-11)

교사 요청: "스티커 보관함에 스티커만 놓지 말고 선사시대 배경 놓고, 진짜 다이어리 느낌이 나게 시대 배경이 들어있는 그림으로. 선사시대 관련 아이콘도 더 넣고. 다른 시대들도 지금은 너무 재미없어."

기존 `docs/ASSET-PROMPTS.md`는 **유물 스티커**(i001~i145, `docs/asset-catalog.md` 참고)를 다뤘다.
이 문서는 유물이 아니라 **다이어리 화면을 꾸미는 배경·장식**만 다룬다. 이미 있는 유물 아이콘·실물 사진(39종, `public/assets/CREDITS.md`)은 다시 만들지 않는다.

총 **35종** — 다이어리 페이지 배경 5 + 보관함 배경 5 + 장식 스티커 20 + 비밀 스티커 5.

시대 키는 코드와 같다: `prehistoric` / `threekingdoms` / `goryeo` / `joseon` / `modern`
(코드 `PeriodId`는 `threeKingdoms` 카멜케이스지만, 파일명은 전부 소문자로 통일한다.)

---

## 공통 규칙 (모든 프롬프트 공통)

> `docs/ASSET-PROMPTS.md`의 **"공통 규칙 (2026-08-11 개정)"** 도 함께 적용된다.
> 특히 4번(**생성 결과는 아이콘/일러스트이며 유물 실물 사진이 아니다** — CREDITS.md 분리 표기)은 이 문서의 35종에도 그대로 해당된다.
> 배경류(`diarybg_*`·`traybg_*`·`cert_bg`)는 공통 문구에서 `transparent background`만 빼고 나머지(`no text, no letters, no watermark, no collage, no grid, no asset sheet, no drop shadow`)를 적용한다.

- **한 이미지 = 에셋 1개.** 콜라주·에셋시트·그리드·여러 변형 나열 절대 금지.
- 화면 톤: navy / gold / teal / warm-wood 팔레트, 초등 5~6학년용 프리미엄 교육앱, 유치하지 않게.
- 글자 금지 (한글·한자·영문·워터마크 전부).
- 투명 배경이 **진짜 알파 채널**인지 확인할 것 (체커보드 무늬가 픽셀로 구워진 가짜 투명 주의 — 1차 원본 148장이 그랬다).

### 공통 접미 프롬프트 A — 배경류 (1·2묶음)

> soft muted low-saturation watercolor-and-paper texture, **the center area must stay bright, clean and empty because stickers will be placed on top**, all motifs pushed to the edges and corners as faint watermark-like decoration, no strong contrast in the middle, no focal object, no people's faces, no text, no watermark, no collage, no asset sheet, no grid, one single continuous background image.

### 공통 접미 프롬프트 B — 장식 스티커 (3묶음)

> A single small decorative sticker for a Korean history diary app for upper elementary students. **single object centered, plain transparent background, no glow, no outline, no text**, flat-ish illustration with soft warm lighting and gentle paper texture, cute but not babyish, navy/gold/teal/warm-wood palette. No collage, no asset sheet, no grid, no watermark, one object per image. Square 1:1, 512px+.

### 공통 접미 프롬프트 C — 비밀 스티커 (4묶음)

> A single special "secret reward" sticker for a Korean history diary app for upper elementary students. One object only, centered, plain transparent background, **thin ornate gold rim around the sticker shape and a few small sparkle accents to look rarer than normal stickers**, no text, no watermark, no collage, no asset sheet, no grid, one object per image. Square 1:1, 512px+.

---

## 1. 시대별 다이어리 페이지 배경 5종

학생이 스티커를 붙이는 종이면에 깔린다. **가운데는 반드시 밝고 비어 있어야 한다**(스티커가 위에 얹힘).
규격: 가로형 4:3, **1600×1200 이상**, PNG(불투명해도 됨).
프롬프트 = 아래 본문 + **공통 접미 A**

| # | 파일명 | 영어 프롬프트 본문 | 한국어 한 줄 설명 |
|---|---|---|---|
| 1 | `diarybg_prehistoric.png` | A diary page background evoking Korean prehistory: pale ochre and clay-brown earth tones on aged paper, faint cave-painting silhouettes of deer and hands along the left and bottom edges, a few soft chipped-stone and dolmen silhouettes in the far corners, a thin scattering of soil speckles | 선사 페이지 배경 — 흙빛 종이에 동굴벽화 실루엣이 가장자리에만 옅게 |
| 2 | `diarybg_threekingdoms.png` | A diary page background evoking Korea's Three Kingdoms and Unified Silla: warm ivory paper, faint tomb-mural style flowing cloud bands and a pale lotus roof-end tile pattern in the corners, a distant soft silhouette of a stone pagoda at the bottom right, muted gold and deep teal accents | 삼국·통일신라 페이지 배경 — 고분벽화 구름과 연꽃 와당 무늬가 모서리에만 |
| 3 | `diarybg_goryeo.png` | A diary page background evoking the Goryeo dynasty: very pale celadon jade-green wash on hanji paper, faint inlaid cloud-and-crane motifs drifting in from the top edge, a thin celadon crackle-glaze texture, soft white slip-inlay flower roundels in the corners | 고려 페이지 배경 — 청자빛에 구름·학 상감 문양이 위쪽에만 흐르게 |
| 4 | `diarybg_joseon.png` | A diary page background evoking the Joseon dynasty: warm off-white hanji paper with faint vertical ruled lines like an old manuscript, a pale ink-wash plum branch entering from the top left corner, a faint red seal mark and soft brush-stroke smudges near the bottom edge, restrained scholarly mood | 조선 페이지 배경 — 옛 원고지 괘선과 수묵 매화 가지가 옅게 |
| 5 | `diarybg_modern.png` | A diary page background evoking modern Korean history: soft sepia scrapbook paper, faint halftone newsprint texture along the edges, a pale taegeuk-pattern watermark in one corner, faint film-perforation strips running down the far left and right margins, hopeful bright tone, no crowds, no conflict imagery | 근현대 페이지 배경 — 세피아 스크랩북 종이에 신문 망점과 필름 구멍 |

---

## 2. 시대별 스티커 보관함 배경 5종

`DiaryEditorPage`의 오른쪽 보관함 패널 뒤에 깔린다. 스티커 칩이 그리드로 얹히므로 **가운데를 비워 둘 것**.
규격: 세로형 3:4, **1200×1600 이상**, PNG.
프롬프트 = 아래 본문 + **공통 접미 A**

| # | 파일명 | 영어 프롬프트 본문 | 한국어 한 줄 설명 |
|---|---|---|---|
| 6 | `traybg_prehistoric.png` | A sticker-tray panel background of an archaeological excavation tray: a shallow wooden sorting tray lined with soft cloth on packed earth, a brush and a small measuring scale resting at the very bottom edge, faint string grid marks, the whole tray interior left empty and evenly lit | 선사 보관함 배경 — 발굴 현장 정리 트레이(안쪽은 비워 둠) |
| 7 | `traybg_threekingdoms.png` | A sticker-tray panel background of a museum display case for Three Kingdoms relics: a dark teal fabric-lined vertical showcase with a thin gold frame, faint lotus roof-tile motif embossed on the fabric, small empty display risers at the very bottom, soft even museum lighting | 삼국 보관함 배경 — 금테 유물 진열장(선반은 비워 둠) |
| 8 | `traybg_goryeo.png` | A sticker-tray panel background of a Goryeo celadon workshop shelf: pale wooden shelving with a soft jade-green wash, a faint crane-and-cloud inlay pattern on the back panel, a small brush and a bowl of slip at the bottom corner, shelves left empty | 고려 보관함 배경 — 청자 공방 선반(칸은 비워 둠) |
| 9 | `traybg_joseon.png` | A sticker-tray panel background of a Joseon scholar's low writing desk (seoan) seen from above: warm wood surface with an inkstone, a brush rest and a small seal box pushed to the bottom edge, a folded sheet of hanji in the corner, the large center of the desk left clear | 조선 보관함 배경 — 서안과 문방구(가운데 종이면은 비움) |
| 10 | `traybg_modern.png` | A sticker-tray panel background of a modern archive drawer: a shallow cardboard document box lined with sepia paper, an index tab strip along the top, a paper clip and a small stamp at the bottom edge, the inside left empty, muted archival colors | 근현대 보관함 배경 — 기록 보관 상자 서랍(안쪽은 비워 둠) |

---

## 3. 시대별 꾸미기용 장식 스티커 20종 (시대당 4종)

유물이 아니라 **다이어리를 꾸미는 부재료**다. 투명 배경 PNG, 512px 이상.
프롬프트 = **공통 접미 B** + 아래 본문 (B가 앞머리를 이미 포함하므로 본문을 이어 붙이면 된다)

### 선사 (prehistoric)

| # | 파일명 | 영어 프롬프트 본문 | 한국어 한 줄 설명 |
|---|---|---|---|
| 11 | `deco_prehistoric_pebble.png` | a small neat stack of three smooth river pebbles in warm grey and clay tones | 조약돌 세 개를 쌓은 장식 |
| 12 | `deco_prehistoric_campfire.png` | a tiny friendly campfire: a few crossed twigs with a soft warm orange flame and two ring stones | 작은 모닥불 장식 |
| 13 | `deco_prehistoric_footprint.png` | a pair of bare human footprints pressed into soft brown earth, shown as a simple clay-colored mark | 흙에 찍힌 맨발 발자국 |
| 14 | `deco_prehistoric_leafstamp.png` | a leaf-shaped ink stamp mark, a single broad leaf printed in earthy ochre with visible vein lines and slightly rough stamped edges | 나뭇잎 도장 자국 |

### 삼국·통일신라 (threekingdoms)

| # | 파일명 | 영어 프롬프트 본문 | 한국어 한 줄 설명 |
|---|---|---|---|
| 15 | `deco_threekingdoms_wadang.png` | a single round Korean roof-end tile (suumakssae) with a lotus flower relief pattern, grey clay with soft highlights | 연꽃무늬 수막새 기와 한 장 |
| 16 | `deco_threekingdoms_gogok.png` | a single comma-shaped jade gogok bead with a small gold cap, translucent deep green | 곡옥 구슬 하나 |
| 17 | `deco_threekingdoms_spangle.png` | one small heart-shaped gold spangle dangling from a short twisted gold wire, thin hammered gold | 금관에 달리던 금빛 달개 장식 |
| 18 | `deco_threekingdoms_cloudband.png` | a short curling stylized cloud band in the style of Goguryeo tomb murals, teal and ochre brush lines | 고분벽화풍 구름무늬 조각 |

### 고려 (goryeo)

| # | 파일명 | 영어 프롬프트 본문 | 한국어 한 줄 설명 |
|---|---|---|---|
| 19 | `deco_goryeo_cloud.png` | a single stylized inlaid cloud motif in celadon jade-green and white slip, the shape used in Goryeo celadon inlay | 청자 상감 구름 문양 조각 |
| 20 | `deco_goryeo_crane.png` | one flying crane in Goryeo celadon inlay style, white body with a thin black outline and a red crown, wings spread, seen in profile | 상감 청자의 학 한 마리 |
| 21 | `deco_goryeo_lotus.png` | a single open lotus flower seen from above, pale jade-green petals with soft white slip lines | 활짝 핀 연꽃 한 송이 |
| 22 | `deco_goryeo_chrysanthemum.png` | a single small inlaid chrysanthemum roundel, white flower inside a thin circular border on jade-green ground | 상감 국화 문양 원형 조각 |

### 조선 (joseon)

| # | 파일명 | 영어 프롬프트 본문 | 한국어 한 줄 설명 |
|---|---|---|---|
| 23 | `deco_joseon_brush.png` | a single traditional Korean writing brush lying at a slight angle, bamboo shaft and soft dark bristles with a tiny ink drop at the tip | 붓 한 자루 |
| 24 | `deco_joseon_ink.png` | a small rectangular ink stick resting on a dark stone inkstone with a shallow pool of ink | 먹과 벼루 |
| 25 | `deco_joseon_maedeup.png` | one traditional Korean decorative knot (maedeup) in deep red silk cord with a short tassel hanging below | 붉은 전통 매듭과 술 |
| 26 | `deco_joseon_seal.png` | a small stone seal stamp standing upright beside a single round red seal impression, no readable characters inside the impression | 낙관 도장과 붉은 인장 자국 |

### 근현대 (modern)

| # | 파일명 | 영어 프롬프트 본문 | 한국어 한 줄 설명 |
|---|---|---|---|
| 27 | `deco_modern_stamp.png` | a single vintage postage stamp with perforated edges and a blank sepia illustration area, no readable text or numbers | 톱니 가장자리의 옛 우표 한 장 |
| 28 | `deco_modern_film.png` | a short strip of old photographic film with sprocket holes and two empty sepia frames, slightly curled | 짧은 필름 조각 |
| 29 | `deco_modern_ribbon.png` | a simple folded ribbon banner in muted red and navy fabric with a small pin, empty surface | 리본 배너 조각 |
| 30 | `deco_modern_mugunghwa.png` | a single rose of Sharon (mugunghwa) blossom seen from the front, pale pink petals with a deep red center | 무궁화 꽃 한 송이 |

---

## 4. 비밀 스티커 5종 (시대별 1종)

학생이 한 줄 설명을 정확히 따라 쓰면 얻는 보너스 스티커. 일반 스티커보다 특별해 보여야 한다(금테·반짝임).
**기존 50종 스티커와 겹치지 않는 대상**으로 골랐다.
프롬프트 = **공통 접미 C** + 아래 본문

| # | 파일명 | 영어 프롬프트 본문 | 한국어 한 줄 설명 |
|---|---|---|---|
| 31 | `secret_prehistoric_petroglyph.png` | the Bangudae petroglyphs of Ulsan: a rounded rock face panel with engraved whale, deer and tiger figures carved in simple outlines, weathered grey stone | 반구대 암각화 — 선사 사람들이 바위에 새긴 그림 |
| 32 | `secret_threekingdoms_cheonmado.png` | the Cheonmado, the Silla painted white horse from Cheonmachong: a white winged horse galloping to the left with a flowing mane and trailing tail flames, painted on aged birch-bark, muted ivory and dark tones | 천마도 — 신라 무덤에서 나온 하늘을 달리는 말 그림 |
| 33 | `secret_goryeo_najeon.png` | a Goryeo mother-of-pearl lacquered sutra box (najeon chilgi gyeongham): a small black lacquer rectangular box with iridescent inlaid chrysanthemum scroll patterns and thin metal wire lines | 나전칠기 경함 — 자개로 무늬를 새긴 고려 상자 |
| 34 | `secret_joseon_geojunggi.png` | the geojunggi, the Joseon lifting crane designed by Jeong Yak-yong for building Hwaseong Fortress: a wooden pulley-and-frame hoist with ropes lifting one large cut stone block | 거중기 — 무거운 돌을 들어 올린 조선의 도르래 기계 |
| 35 | `secret_modern_dongnimmun.png` | Dongnimmun, the Independence Gate in Seoul: a single tall granite arch gate standing alone, pale grey stone, clear blue-tinted sky behind, no crowds, no readable inscription | 독립문 — 자주 독립의 뜻을 담아 세운 문 |

---

## 생성 후 할 일 체크리스트

1. **알파 채널 확인** (장식·비밀 스티커만): `python -c "from PIL import Image; print(Image.open('파일.png').mode)"` → `RGBA` 여야 한다. 가짜 투명(체커보드가 픽셀로 구워진 것) 주의.
2. **파일명 그대로** 저장 — 표의 파일명을 바꾸지 말 것. 코드가 파일명으로 찾는다.
3. **폴더에 넣기** (원본 보관)
   - 배경 2종: `source-assets/diary-bg/` (`diarybg_*.png`, `traybg_*.png`)
   - 스티커 2종: `source-assets/diary-deco/` (`deco_*.png`, `secret_*.png`)
4. **webp 변환** — 아이콘 번호 체계(i001~)와 섞이지 않게 **번호 없이 이름 그대로** 별도 폴더로 내보낸다. `scripts/optimize_assets.py`는 번호 매긴 아이콘용이므로 여기서는 쓰지 않는다.

   ```bash
   # 배경 (긴 변 1600px, 품질 80)
   python -c "import glob,os;from PIL import Image
   os.makedirs('public/assets/opt/diarybg',exist_ok=True)
   [ (lambda im,n: (im.thumbnail((1600,1600)), im.save(f'public/assets/opt/diarybg/{n}.webp','WEBP',quality=80)))(Image.open(f), os.path.splitext(os.path.basename(f))[0]) for f in glob.glob('source-assets/diary-bg/*.png') ]"

   # 장식·비밀 스티커 (512px, 알파 유지)
   python -c "import glob,os;from PIL import Image
   os.makedirs('public/assets/opt/deco',exist_ok=True)
   [ (lambda im,n: (im.thumbnail((512,512)), im.save(f'public/assets/opt/deco/{n}.webp','WEBP',quality=85)))(Image.open(f).convert('RGBA'), os.path.splitext(os.path.basename(f))[0]) for f in glob.glob('source-assets/diary-deco/*.png') ]"
   ```

5. **코드 연결** — 경로는 `src/data/assets.ts`에서만 관리한다는 기존 규칙을 지킨다. 헬퍼 2개만 추가하면 된다.

   ```ts
   export function diaryBgSrc(period: PeriodId): string   // → /assets/opt/diarybg/diarybg_{소문자 period}.webp
   export function trayBgSrc(period: PeriodId): string    // → /assets/opt/diarybg/traybg_{소문자 period}.webp
   export function decoSrc(name: string): string          // → /assets/opt/deco/{name}.webp
   ```
   `PeriodId`의 `threeKingdoms` → 파일명 `threekingdoms` 이므로 `period.toLowerCase()` 한 번이면 된다.
   사용처는 `src/pages/DiaryEditorPage.tsx` (페이지면 + 보관함 패널)와 `src/pages/DiaryShowcasePage.tsx` (전시 화면).

6. **문서 갱신**
   - `docs/asset-catalog.md`에 "다이어리 배경·장식" 절을 새로 만들어 35종 표 추가 (아이콘 iNNN 표에는 섞지 말 것)
   - `public/assets/CREDITS.md`에 "생성형 AI 제작 이미지, 실물 유물 사진 아님" 항목으로 한 줄 추가
7. **검수** — 비밀 스티커 5종은 유물 형태 고증 대상이다. 실물과 크게 다르면 사용 보류 (CONTENT-REVIEW 원칙). 근현대 자료는 폭력·피해 장면 금지.

---

## 추가: 수료증 배경 1종 (2026-08-09)

| 파일명 | 용도 |
|---|---|
| `cert_bg.png` | 수료 화면 수료증 패널 배경 (가로 4:3, 1600px 이상) |

```
A traditional Korean certificate (sujeungjeung) background for children, landscape 4:3. Aged ivory hanji paper texture with a wide ornate gold double border, subtle navy and gold Korean cloud and plum-blossom patterns only along the outer edges, a faint watermark of a Korean pavilion silhouette in the very center at low opacity. IMPORTANT: the entire center area must stay bright and almost empty because certificate text, a name line and record boxes will be placed on top. Elegant, formal but warm and friendly for upper elementary students. No text, no letters, no seal stamp, no collage, no grid, no asset sheet, one complete background image only.
```

- 적용: `public/assets/opt/cert/cert_bg.webp`로 변환 후 `.completion__cert`의 background-image로 사용
- 변환: `python -c "from PIL import Image; im=Image.open('cert_bg.png'); im.thumbnail((1600,1600)); im.save('public/assets/opt/cert/cert_bg.webp','WEBP',quality=82)"`
