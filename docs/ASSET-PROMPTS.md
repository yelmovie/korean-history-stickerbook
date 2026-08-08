# 추가 생성 필요 에셋 프롬프트 (2026-08-08)

> 2026-08-08 저녁 기준: 29종 중 26종 생성·적용 완료 (i117~i142).
> **남은 3종 재생성 프롬프트는 맨 아래 "재생성 3종" 섹션** — 무령왕 관식(금관으로 잘못 나옴), 대동여지도·달항아리(미생성).

현재 아이콘이 없어 이름 칩으로 표시되는 스티커 29종 + 배포용 이미지 1종.
생성 후 `source-assets/icons-numbered/`에 117.png부터 번호를 이어 넣고 `scripts/optimize_assets.py`를 다시 돌린 뒤, `src/data/stickers.ts`의 `icon` 필드만 채우면 된다.

## 공통 프롬프트 (모든 유물 스티커 앞에 붙일 것)

> A single sticker-style illustration of [유물], for a premium Korean history educational app for upper elementary students. One object only, centered, clean transparent background, soft warm lighting, subtle gold outline sticker border, navy/gold/teal/warm-wood palette, friendly but not childish, detailed and respectful to the real artifact's shape. **No collage, no asset sheet, no grid, no text, no watermark, one object per image.** Square 1:1.

투명 배경이 진짜 알파 채널로 나오는지 꼭 확인할 것 (체커보드 무늬가 픽셀로 구워진 가짜 투명 주의 — 이번 원본 148장이 그랬다).

## 유물 스티커 29종

| # | 스티커 id | 프롬프트에 넣을 [유물] 설명 |
|---|---|---|
| 선사 1 | sumbe-point | a Korean Paleolithic tanged stone point (seombe-jjireugae), chipped stone spear tip with a tang for hafting |
| 선사 2 | spindle-whorl | a Neolithic Korean spindle whorl (garakbakwi), small round flat stone/clay disc with a center hole and wooden spindle stick |
| 선사 3 | bone-needle | a Neolithic bone needle (ppyeobaneul) with thread eye, next to nothing else, pale ivory color |
| 선사 4 | polished-stone | a Korean Neolithic polished stone axe (ganseokgi), smooth ground stone blade with wooden handle |
| 선사 5 | plain-pottery | a Korean Bronze Age plain coarse pottery jar (mumun togi), reddish-brown undecorated flat-bottomed pot |
| 선사 6 | half-moon-knife | a Korean Bronze Age half-moon shaped stone knife (bandal dolkal) with two holes and a cord |
| 선사 7 | bipa-dagger | a Korean Bronze Age mandolin-shaped bronze dagger (bipahyeong donggeom), lute-shaped blade |
| 삼국 1 | gwanggaeto-stele | the Gwanggaeto Stele, a tall rough natural rectangular stone monument with faint inscribed Chinese characters |
| 삼국 2 | muryeong-ornament | the gold crown ornament of King Muryeong of Baekje, flame-and-flower openwork thin gold plate |
| 삼국 3 | cheomseongdae | Cheomseongdae observatory of Silla, bottle-shaped grey stone tower with a square window |
| 삼국 4 | bulguksa | Bulguksa temple main hall with its stone stairway bridges (Cheongungyo), traditional Korean temple architecture |
| 삼국 5 | dabotap | Dabotap pagoda, the ornate multi-tiered stone pagoda of Bulguksa with railings and unique octagonal top |
| 삼국 6 | seokgatap | Seokgatap pagoda, the simple elegant three-story stone pagoda of Bulguksa |
| 고려 1 | celadon-melon | a Goryeo celadon melon-shaped bottle (cheongja chamoe-moyang byeong), jade-green ribbed gourd body with flared mouth |
| 고려 2 | jikji | Jikji, an old Goryeo printed book with worn hanji paper cover and metal-type printed pages slightly open |
| 고려 3 | goryeo-painting | a Goryeo Buddhist painting scroll (bulhwa), elegant hanging scroll with gold-line bodhisattva silhouette, respectful and soft |
| 고려 4 | bronze-hyangwan | a Goryeo bronze incense burner with silver inlay (eunipsa hyangwan), goblet-shaped with fine silver wire patterns |
| 고려 5 | manwoldae | Manwoldae palace site in Gaeseong, stone terraced foundation ruins with grand stairway, gentle grass |
| 조선 1 | sillok | the Annals of the Joseon Dynasty (Joseon wangjo sillok), a neat stack of traditional Korean bound books with title slips |
| 조선 2 | donguibogam | Donguibogam medical encyclopedia, an open traditional Korean medical book with herbs beside it |
| 조선 3 | daedongyeojido | Daedongyeojido, a folded old Korean woodblock-printed map showing the Korean peninsula with mountain ranges |
| 조선 4 | moon-jar | a Joseon white porcelain moon jar (dalhangari), large round milky-white jar with soft glow |
| 근현대 1 | independent-news | The Independent newspaper (Dongnip Sinmun), an old Korean hangul newspaper front page, sepia paper — masthead area stylized, no readable fake text |
| 근현대 2 | ahn-calligraphy | a vertical Korean calligraphy scroll with bold brush strokes and a red seal stamp, respectful, no readable full sentence |
| 근현대 3 | yu-record | an archival record card with a black-and-white style portrait silhouette of a young Korean girl in hanbok, taegeuk ribbon, respectful memorial tone |
| 근현대 4 | gwangbok-record | a 1945 liberation commemoration: waving taegeukgi flags over an old document and laurel, hopeful bright tone, no crowd |
| 근현대 5 | war-record | a Korean War archive box with old photographs and a dove of peace on top, muted colors, no violence |
| 근현대 6 | donghak-flag | the Donghak Peasant Movement banner, an aged fabric flag with the Korean characters 보국안민 style calligraphy on a bamboo pole |
| 근현대 7 | daehan-doc | an official Korean Empire document with the imperial plum blossom emblem and red seal, aged paper |

주의: 근현대 자료는 폭력·피해 장면 금지. 인물은 실존 인물 얼굴을 정밀 재현하지 말고 존중하는 단순화 스타일로.

## 배포용 이미지 1종

| 용도 | 프롬프트 |
|---|---|
| OG·카카오톡 썸네일 (1200×630 1장) | 16:9-ish social preview banner for "한국사 스티커북: 시간여행 다이어리". The existing main title logo style: warm traditional Korean study room, glowing open history diary, navy/gold palette, large clear title area. One complete image, no collage. 실제 로고 텍스트는 기존 i001 로고를 합성해도 됨 |

## 생성 후 할 일 체크리스트

1. 진짜 알파 채널인지 확인 (PIL: `Image.open(f).mode == 'RGBA'`)
2. `source-assets/icons-numbered/117.png ~` 로 저장
3. `python scripts/optimize_assets.py` 재실행 (재실행 안전함)
4. `src/data/stickers.ts` 해당 스티커의 `icon: 'i117'` 식으로 연결
5. `docs/asset-catalog.md`에 한 줄 추가
6. 유물 형태가 실물과 크게 다르면 사용 보류하고 이름 칩 유지 (CONTENT-REVIEW 원칙)

## 재생성 3종 (복붙용 완결 프롬프트)

### 1. 무령왕 금제관식 — ※ 금관 전체를 그리면 안 됨. 얇은 금판 장식 1점

A single sticker-style illustration of the gold crown ornament (geumje gwansik) excavated from the tomb of King Muryeong of Baekje, Korea. IMPORTANT: this is NOT a full crown — depict ONE thin, flat, openwork hammered-gold plate shaped like a rising flame, with palmette and honeysuckle scroll cut-out patterns and tiny dangling gold spangles, standing upright. For a premium Korean history educational app for upper elementary students. One object only, centered, clean transparent background, soft warm lighting, subtle gold outline sticker border, navy/gold/teal palette, detailed and respectful to the real artifact's shape. No collage, no asset sheet, no grid, no text, no watermark, one object per image. Square 1:1.

### 2. 대동여지도

A single sticker-style illustration of Daedongyeojido, the great 19th-century woodblock-printed map of Korea by Kim Jeong-ho. Depict a partially unfolded accordion-fold book-map on aged hanji paper, showing the Korean peninsula drawn with black woodblock-printed mountain ridgelines and river networks, folded panels visible at the sides. For a premium Korean history educational app for upper elementary students. One object only, centered, clean transparent background, soft warm lighting, subtle gold outline sticker border, navy/gold/teal/warm-wood palette, detailed and respectful to the real artifact. No collage, no asset sheet, no grid, no readable modern text, no watermark, one object per image. Square 1:1.

### 3. 백자 달항아리

A single sticker-style illustration of a Joseon dynasty white porcelain moon jar (dalhangari). One large, softly asymmetrical round jar with a short neck, milky warm-white glaze with a very subtle bluish tint and gentle glow, quiet and elegant. For a premium Korean history educational app for upper elementary students. One object only, centered, clean transparent background, soft warm lighting, subtle gold outline sticker border, detailed and respectful to the real artifact's shape. No collage, no asset sheet, no grid, no text, no watermark, one object per image. Square 1:1.

## 3D 변환용 초기 이미지 프롬프트 (Meshy AI 이미지→3D)

파일 규칙: 레퍼런스 이미지 `ref3d_NN_이름.png` → Meshy 결과 GLB `public/assets/3d/aNN_이름.glb`
공통 원칙: 오브젝트 1개, 민무늬 밝은 회색 배경, 3/4 시점, 그림자·글로우·스티커 테두리 금지 (기존 아이콘은 후광·테두리 때문에 3D 변환용으로 부적합).

공통 접미 프롬프트 (모든 항목 뒤에 붙임):
> single object centered, 3/4 view slightly from above, plain light gray studio background, soft even lighting, no cast shadows, no glow, no outline, no text, realistic detailed surface texture, museum replica quality, suitable for image-to-3D conversion. Square 1:1.

| # | 파일명 | 대상 | 용도 |
|---|---|---|---|
| 1 | ref3d_01_hand_axe | 주먹도끼 | 선사 관찰 문제 3D 돌려보기 |
| 2 | ref3d_02_dolmen | 고인돌 | 선사 배치 문제 |
| 3 | ref3d_03_cheomseongdae | 첨성대 | 삼국 관찰 |
| 4 | ref3d_04_celadon | 청자 상감운학문 매병 | 고려 복원·관찰 |
| 5 | ref3d_05_cheugugi | 측우기 | 조선 기능 추론 |
| 6 | ref3d_06_moon_jar | 백자 달항아리 | 다이어리·전시 보너스 |
