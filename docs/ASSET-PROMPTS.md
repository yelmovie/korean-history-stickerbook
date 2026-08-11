# 추가 생성 필요 에셋 프롬프트 (2026-08-08)

> 2026-08-08 저녁 기준: 29종 중 26종 생성·적용 완료 (i117~i142).
> **남은 3종 재생성 프롬프트는 맨 아래 "재생성 3종" 섹션** — 무령왕 관식(금관으로 잘못 나옴), 대동여지도·달항아리(미생성).

> **2026-08-11 추가**: 신규 7종(그물추·금속활자·마스코트 5종)은 맨 아래 **"2026-08-11 추가 생성 7종"** 섹션.
> 신규분에는 아래 **"공통 규칙 (2026-08-11 개정)"** 이 적용된다. 그 위 기존 표의 규칙(금테 스티커 테두리 등)과 다르니 섞지 말 것.

---

## 공통 규칙 (2026-08-11 개정) — 이 날짜 이후 만드는 모든 프롬프트에 적용

1. **한 이미지 = 완성된 오브젝트 1개.** 모든 프롬프트 끝에 아래 문구를 그대로 붙인다.

   ```
   one single complete object, transparent background, no text, no letters, no watermark, no collage, no grid, no asset sheet, no drop shadow
   ```

   단, **배경 이미지**(diarybg / traybg / cert_bg)는 `transparent background` 만 빼고 나머지를 적용한다.
2. **초등 5~6학년 대상 친근한 일러스트.** 유치하지 않게. **과장된 스티커 테두리 금지** — 기존 i001~i145에 붙어 있던 두꺼운 금테·후광은 신규분에 쓰지 않는다.
3. **실물 유물의 형태·비례를 지킨다.** 귀엽게 만든다고 비례를 무너뜨리지 않는다. 실물과 크게 다르면 사용 보류 (CONTENT-REVIEW 원칙).
4. **⚠️ 크레딧 주의 — 여기서 생성한 이미지는 전부 "생성형 AI로 만든 아이콘/일러스트"이며 `유물 실물 사진`이 아니다.** 실물 사진(`public/assets/photo/*.webp`, 국가유산청·e뮤지엄 공공누리)과 절대 섞어 쓰지 말고, `public/assets/CREDITS.md`에 "생성형 AI 제작 이미지, 실물 유물 사진 아님"으로 분리 표기한다. 앱 화면에서 "실물 사진 보기" 자리에 이 이미지를 넣으면 안 된다.
5. 투명 배경은 **진짜 알파 채널**인지 확인 (`Image.open(f).mode == 'RGBA'`). 체커보드가 픽셀로 구워진 가짜 투명 주의.

---

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

## 실물 자료 파이프라인 (2026-08-09, AI 유물 이미지 대체 방침)

### 사진 (적용됨)
`국가유산청 OpenAPI` 검색→이미지 목록→다운로드→1024px webp. 절차는 이 세션의 커밋 참고. 남은 유물(빗살무늬 토기, 주먹도끼 등 비지정·박물관 소장품)은 **e뮤지엄(emuseum.go.kr)** 에서 공공누리 1유형 사진을 수동 확인 후 `source-assets/photos-original/{stickerId}.jpg`로 넣고 아래 명령으로 변환:
`python -c "from PIL import Image; im=Image.open('source-assets/photos-original/ID.jpg'); im.thumbnail((1024,1024)); im.save('public/assets/photo/ID.webp','WEBP',quality=82)"`
그 뒤 `src/data/assets.ts`의 REAL_PHOTOS에 id 추가 + CREDITS.md 표에 한 줄 추가.

### 3D (준비됨, 모델 대기)
- 출처: digital.khs.go.kr 3D 에셋(Sketchfab/Unity/Unreal 마켓 배포) 또는 박물관 3D 스캔. 다운로드 시 공공누리 유형 확인.
- 변환: `npx @gltf-transform/cli optimize in.glb out.glb --compress draco --texture-size 1024`
- 배치: `public/assets/3d/{stickerId}.glb` → 문제 화면 "3D로 보기" 버튼에서만 lazy load (model-viewer)
- 원칙: 태블릿 성능 — 폴리곤 ≤30k, 텍스처 ≤1024px, 첫 로딩에 포함 금지

---

# 2026-08-11 추가 생성 7종

위 **"공통 규칙 (2026-08-11 개정)"** 이 전부 적용된다. 프롬프트 본문에도 이미 반영해 두었으니 아래 코드블록을 **그대로 복붙**하면 된다.

**원본 파일을 덮어쓰지 말 것.** 기존 `source-assets/icons-numbered/NNN.png`는 그대로 두고 새 번호(146~152)로 저장한 뒤, `src/data/assets.ts` / `src/data/stickers.ts`의 id만 새 번호로 바꾼다. 마음에 안 들면 id만 되돌리면 원상복구된다.

| # | 원본 파일명 | 앱 경로 | 용도 | 권장 해상도 | 교체 대상 |
|---|---|---|---|---|---|
| 1 | `source-assets/icons-numbered/146.png` | `/assets/opt/icons/i146.webp` | 그물추 스티커 아이콘 (`net-sinker`, 현재 `icon: null`) | 1024×1024 (1:1) | 신규 |
| 2 | `source-assets/icons-numbered/147.png` | `/assets/opt/icons/i147.webp` | 금속활자 스티커 아이콘 (`metal-type`) | 1024×1024 (1:1) | `i063` 대체 |
| 3 | `source-assets/icons-numbered/148.png` | `/assets/opt/icons/i148.webp` | 선사 마스코트 — 탐사 두더지 | 1024×1024 (1:1) | `i041` 대체 |
| 4 | `source-assets/icons-numbered/149.png` | `/assets/opt/icons/i149.webp` | 삼국 마스코트 — 수호 해치 사자 | 1024×1024 (1:1) | `i051` 대체 |
| 5 | `source-assets/icons-numbered/150.png` | `/assets/opt/icons/i150.webp` | 고려 마스코트 — 청자 용거북 | 1024×1024 (1:1) | `i060` 대체 |
| 6 | `source-assets/icons-numbered/151.png` | `/assets/opt/icons/i151.webp` | 조선 마스코트 — 학자 토끼 | 1024×1024 (1:1) | `i068` 대체 |
| 7 | `source-assets/icons-numbered/152.png` | `/assets/opt/icons/i152.webp` | 근현대 마스코트 — 사서 너구리 | 1024×1024 (1:1) | `i085` 대체 |

---

## 1. 그물추 (net sinker) — `146.png`

신석기 어로 도구. 현재 e뮤지엄 실물 사진(`/assets/photo/net-sinker.webp`)만 있고 아이콘이 없어 이름 칩으로 표시된다.
형태 근거: 국립중앙박물관 출토품 — **납작한 타원형 강자갈의 좌우 양옆을 쪼아 홈(notch)을 낸 것**. 구멍을 뚫은 형태가 아니다. 어망추·어망편이라고도 한다.

```
A single Korean Neolithic stone net sinker (eomangchu) used to weigh down a fishing net, drawn as a clean friendly illustration icon for a Korean history educational app for upper elementary students. Shape reference from excavated National Museum of Korea examples: ONE flat oval river pebble, roughly egg-shaped and slightly wider than it is tall, dull grey-brown granite with a naturally smooth waterworn surface and faint speckles. The key feature: a shallow chipped notch pecked into the LEFT edge and a matching notch on the RIGHT edge, so a cord could be tied around the waist of the pebble — the notches must be clearly visible as small rough chipped-out dents, NOT drilled holes. Show a short length of thin twisted plant-fiber cord seated in the two notches and knotted, with two short loose cord ends. Three-quarter front view, gently lit from the upper left, soft warm lighting, muted earthy palette of grey, clay-brown and warm rope-beige, matching a navy/gold/teal/warm-wood app theme. Friendly but not babyish, realistic proportions faithful to the real artifact, no exaggerated sticker rim, no gold outline. one single complete object, transparent background, no text, no letters, no watermark, no collage, no grid, no asset sheet, no drop shadow. Square 1:1.
```

- 연결: `src/data/stickers.ts` → `{ id: 'net-sinker', ... icon: 'i146' }`
- ⚠️ 실물 사진 아님. `PHOTO_CREDITS['net-sinker']`(e뮤지엄 사진)와 별개 자산이다.

---

## 2. 금속활자 (metal movable type) — `147.png`

현재 `i063`은 활자면의 글자가 한자도 한글도 아닌 형태라 교체한다.

### 새길 한자: **直** (곧을 직)

**고른 이유 한 줄**: 이 스티커가 가리키는 유물이 『**直**指심체요절』이라 화면의 "직지" 스티커와 글자가 그대로 이어지고, 直은 세로획이 왼쪽에 몰리고 아래 가로획이 왼쪽으로만 삐져나오는 **좌우 비대칭**이라 거울상으로 새겼을 때 뒤집혔다는 게 한눈에 보인다.

(획이 더 단순한 게 필요하면 대체 후보 **力**. `天`·`心`은 좌우가 거의 대칭이라 거울상이 티가 안 나므로 쓰지 말 것.)

```
A single piece of Korean metal movable type (geumsok hwalja) from the Goryeo-to-Joseon printing tradition, drawn as a clean friendly illustration icon for a Korean history educational app for upper elementary students. ONE separate type sort only, not a tray, not a set. Form: a small solid cast-bronze rectangular block, taller than it is wide, standing upright in three-quarter view slightly from above so both the printing face on top and one side wall are visible; warm dark bronze with soft aged patina, tiny casting texture, slightly worn rounded edges, and a shallow concave hollow scooped out of the back/underside as on real Korean type. THE PRINTING FACE IS THE FOCUS: on the flat top face sits exactly ONE Chinese character carved in RELIEF — the character 直 in formal upright regular script (kaishu / 정자체 haeseoche), rendered as a MIRROR IMAGE, horizontally flipped left-to-right, exactly as it must be on a real printing type so it prints correctly. The raised strokes stand crisply proud of the face with clean vertical shoulders and a flat polished top, catching the light; the recessed background between strokes is darker. Strokes must be even-width, straight and confident, a real legible Chinese character — absolutely NOT invented glyphs, NOT random squiggles, NOT hangul, NOT Latin letters, NOT decorative marks. A faint trace of dark ink sits on the raised strokes only. Soft warm lighting from the upper left, bronze/navy/warm-wood palette, realistic proportions faithful to the real artifact, friendly but not babyish, no exaggerated sticker rim, no gold outline. one single complete object, transparent background, no watermark, no collage, no grid, no asset sheet, no drop shadow. Square 1:1.
```

> 위 프롬프트에는 활자면에 새길 글자 **直** 하나만 허용된다. 공통 규칙의 "no text, no letters"는 *활자면 밖의* 글자·워터마크를 금지하는 뜻이고, 활자면의 直은 유물의 형태 그 자체이므로 예외다. 그래서 마지막 줄에서 `no text, no letters`를 일부러 뺐다.

**검수 포인트 (셋 다 통과해야 채택)**
1. 글자가 진짜 `直` 인가 (획이 지어낸 모양이 아닌가)
2. 좌우가 **뒤집혀** 있는가 (정방향으로 나오면 실패 — 실물 활자는 반드시 거울상)
3. 글자가 파인 게 아니라 **도드라져(양각)** 있는가

- 연결: `src/data/stickers.ts` → `{ id: 'metal-type', ... icon: 'i147' }`, `src/data/questions.ts` `q-s3-05`의 `artifactIcon: 'i147'`
- `i063`(활자 배지)은 지우지 말고 그대로 둔다. 참조가 사라지면 `source-assets/unused-webp/`로 옮기면 된다.

---

## 3. 동물 마스코트 5종 재생성 — `148.png ~ 152.png`

기존 마스코트보다 **더 귀엽고 친근하게**. 공통 방향:

- **눈을 더 크게** (얼굴 폭 대비 확실히 키우고, 큰 흰 하이라이트 2개 + 부드러운 아래 눈꺼풀 곡선)
- **표정을 부드럽게** — 이 사이 벌린 큰 웃음 대신 살짝 다문 입꼬리, 편안한 눈썹
- 기존 이미지와 **비례·색조가 이어지도록**: 2.5~3등신, 큰 머리 + 작고 동그란 몸, 짧은 팔다리, navy/gold/teal/warm-wood 팔레트 유지
- 정면 또는 살짝 3/4 각도, 전신 1개체, 투명 배경
- **소품은 딱 하나만** 들리고 몸에서 떨어지지 않게 (별도 오브젝트로 분리되면 안 됨)

### 공통 접미 프롬프트 M (아래 5개 본문 뒤에 이미 붙여 두었다)

> full body, one single character standing/floating on nothing, front-facing three-quarter view, 2.5-head chibi proportions with a big round head and a small rounded body, VERY LARGE round friendly eyes with two soft white highlights each and gentle lower eyelid curves, soft closed-mouth smile, relaxed eyebrows, small rounded paws, clean flat-shaded illustration with soft warm lighting and gentle cel shading, navy/gold/teal/warm-wood Korean palette, cute and warm for upper elementary students but not babyish and not a toddler mascot costume, no exaggerated sticker rim, no gold outline, no glow, no halo. one single complete object, transparent background, no text, no letters, no watermark, no collage, no grid, no asset sheet, no drop shadow. Square 1:1.

### 3-1. 선사 — 탐사 두더지 (`148.png`, `i041` 대체)

```
A cute explorer mole mascot for the prehistory chapter of a Korean history educational app. A small round mole with soft velvety grey-brown fur, a little pink nose, tiny round ears, and squinty-happy but LARGE round eyes; wearing a warm ochre explorer cap and a tiny canvas tool belt. It holds ONE small excavation trowel in its right paw, held close against its body, and a soft brush is tucked in the belt; a few crumbs of clay-brown soil cling to its paws. full body, one single character standing on nothing, front-facing three-quarter view, 2.5-head chibi proportions with a big round head and a small rounded body, VERY LARGE round friendly eyes with two soft white highlights each and gentle lower eyelid curves, soft closed-mouth smile, relaxed eyebrows, small rounded paws, clean flat-shaded illustration with soft warm lighting and gentle cel shading, navy/gold/teal/warm-wood Korean palette, cute and warm for upper elementary students but not babyish and not a toddler mascot costume, no exaggerated sticker rim, no gold outline, no glow, no halo. one single complete object, transparent background, no text, no letters, no watermark, no collage, no grid, no asset sheet, no drop shadow. Square 1:1.
```

### 3-2. 삼국·통일신라 — 수호 사자(해치풍) (`149.png`, `i051` 대체)

```
A cute guardian lion mascot in the style of a Korean haetae (haechi), the mythical justice beast that guards Korean palaces, for the Three Kingdoms chapter of a Korean history educational app. A small round lion-like creature with a curly teal-and-gold mane, a single tiny blunt horn on its forehead, small rounded scale plates along its back, a stubby curled tail, and a small round bell on a red cord at its neck. Friendly guardian, absolutely not fierce: no bared fangs, no snarl, no angry eyebrows. It sits upright on its haunches with both front paws neatly together. full body, one single character sitting on nothing, front-facing three-quarter view, 2.5-head chibi proportions with a big round head and a small rounded body, VERY LARGE round friendly eyes with two soft white highlights each and gentle lower eyelid curves, soft closed-mouth smile, relaxed eyebrows, small rounded paws, clean flat-shaded illustration with soft warm lighting and gentle cel shading, navy/gold/teal/warm-wood Korean palette, cute and warm for upper elementary students but not babyish and not a toddler mascot costume, no exaggerated sticker rim, no gold outline, no glow, no halo. one single complete object, transparent background, no text, no letters, no watermark, no collage, no grid, no asset sheet, no drop shadow. Square 1:1.
```

### 3-3. 고려 — 청자 용거북 (`150.png`, `i060` 대체)

```
A cute dragon-turtle mascot for the Goryeo dynasty chapter of a Korean history educational app: a small round turtle whose head is a gentle baby dragon head with two tiny soft antler nubs and a pair of short whiskers, carrying a domed shell glazed like Goryeo celadon — jade-green with a fine crackle texture and a few white inlaid cloud-and-crane motifs on the shell. Short stubby legs, a small curled tail. The dragon face is friendly and calm, never scary: no fangs, no fire, no snarl. full body, one single character standing on nothing, front-facing three-quarter view, 2.5-head chibi proportions with a big round head and a small rounded body, VERY LARGE round friendly eyes with two soft white highlights each and gentle lower eyelid curves, soft closed-mouth smile, relaxed eyebrows, small rounded paws, clean flat-shaded illustration with soft warm lighting and gentle cel shading, navy/gold/teal/warm-wood Korean palette, cute and warm for upper elementary students but not babyish and not a toddler mascot costume, no exaggerated sticker rim, no gold outline, no glow, no halo. one single complete object, transparent background, no text, no letters, no watermark, no collage, no grid, no asset sheet, no drop shadow. Square 1:1.
```

### 3-4. 조선 — 학자 토끼 (`151.png`, `i068` 대체)

```
A cute scholar rabbit mascot for the Joseon dynasty chapter of a Korean history educational app. A small round rabbit with soft cream-white fur, long ears with one ear tipping slightly to the side, and a fluffy round tail; wearing a miniature indigo-navy scholar's robe (dopo) with a simple sash, and small round Joseon-style spectacles resting low on its nose. It holds ONE closed traditional bound book hugged against its chest with both paws, and a small writing brush is tucked behind its ear. Studious and gentle. full body, one single character standing on nothing, front-facing three-quarter view, 2.5-head chibi proportions with a big round head and a small rounded body, VERY LARGE round friendly eyes with two soft white highlights each and gentle lower eyelid curves, soft closed-mouth smile, relaxed eyebrows, small rounded paws, clean flat-shaded illustration with soft warm lighting and gentle cel shading, navy/gold/teal/warm-wood Korean palette, cute and warm for upper elementary students but not babyish and not a toddler mascot costume, no exaggerated sticker rim, no gold outline, no glow, no halo. one single complete object, transparent background, no text, no letters, no watermark, no collage, no grid, no asset sheet, no drop shadow. Square 1:1.
```

### 3-5. 근현대 — 사서 너구리 (`152.png`, `i085` 대체)

```
A cute librarian raccoon dog mascot for the modern-history chapter of a Korean history educational app. A small round Korean raccoon dog (neoguri) with warm grey-brown fur, soft dark patches around its eyes that read as friendly rather than masked, small rounded ears and a fluffy striped tail; wearing a small knitted vest in muted teal and a simple cloth sleeve-band, with a tiny brass key on a cord at its neck. It holds ONE rolled archival document tucked under its left arm, close to the body. Calm, tidy, helpful keeper-of-records mood. Nothing about war or conflict. full body, one single character standing on nothing, front-facing three-quarter view, 2.5-head chibi proportions with a big round head and a small rounded body, VERY LARGE round friendly eyes with two soft white highlights each and gentle lower eyelid curves, soft closed-mouth smile, relaxed eyebrows, small rounded paws, clean flat-shaded illustration with soft warm lighting and gentle cel shading, navy/gold/teal/warm-wood Korean palette, cute and warm for upper elementary students but not babyish and not a toddler mascot costume, no exaggerated sticker rim, no gold outline, no glow, no halo. one single complete object, transparent background, no text, no letters, no watermark, no collage, no grid, no asset sheet, no drop shadow. Square 1:1.
```

---

## 7종 생성 후 할 일

1. 알파 채널 확인 — `python -c "from PIL import Image; print(Image.open('source-assets/icons-numbered/146.png').mode)"` → `RGBA`
2. `source-assets/icons-numbered/146.png ~ 152.png` 로 저장 (**기존 번호 덮어쓰기 금지**)
3. `python scripts/optimize_assets.py` 재실행 → `public/assets/opt/icons/i146.webp ~ i152.webp`
4. id 연결 (총 7줄)
   - `src/data/stickers.ts`: `net-sinker` → `icon: 'i146'`, `metal-type` → `icon: 'i147'`
   - `src/data/questions.ts`: `q-s3-05`의 `artifactIcon: 'i063'` → `'i147'`
   - `src/data/assets.ts` `A`: `s1Mole: 'i148'`, `s2Haechi: 'i149'`, `s3Turtle: 'i150'`, `s4Rabbit: 'i151'`, `s5Raccoon: 'i152'`
5. `docs/asset-catalog.md` "생성 필요 목록" 체크리스트에 ☑ 표시
6. `public/assets/CREDITS.md`에 **"생성형 AI 제작 아이콘 — 유물 실물 사진 아님"** 항목으로 추가
7. 유물 2종(그물추·금속활자)은 CONTENT-REVIEW 대상. 형태가 실물과 크게 다르면 채택 보류하고 그물추는 이름 칩, 금속활자는 `i063` 유지
