# 추가 생성 필요 에셋 프롬프트 (2026-08-08)

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
