# 공공누리(KOGL) 유형 감사 — 실물 유물 사진

작성일: 2026-08-11
대상: `public/assets/photo/*.webp` 40장 (원본 `source-assets/photos-original/*.jpg`)
방법: 아래 "확인 방법" 참조. **추측 없이 기관이 기계적으로 고지한 값만 기록**

---

## 요약

### 유형별 집계 (국가유산청 경로 23장)

| 유형 | 장수 | 스티커 id |
|---|---|---|
| **제1유형** (출처표시) | **18** | cheugugi, silla-crown, baekje-incense-burner, celadon-maebyeong, goryeo-celadon, angbuilgu, cheomseongdae, dabotap, seokgatap, tripitaka, jagyeongnu, muryeong-ornament, daedongyeojido, donguibogam, sillok, dolmen, celadon-melon, seokguram |
| 제2유형 (비상업) | 0 | — |
| 제3유형 (변경금지) | 0 | — |
| **제4유형** (비상업 + **변경금지**) | **5** | moon-jar, honcheonui, hunminjeongeum, janggyeong-panjeon, bulguksa |
| 미확인 | 0 | — |

e뮤지엄 경로 16장은 수집 시 `publicType=1`(제1유형) 필터를 적용해 받았으므로 제1유형.
`net-sinker` 1장은 **출처 기록 자체가 없어 미확인** (아래 "미확인 항목" 참조).

전체 40장 기준: 제1유형 34장 / 제4유형 5장 / 미확인 1장.

### 당장 교체하거나 내려야 하는 사진

제4유형은 **"2차적저작물 작성 등 변경하여 이용하는 것은 금지"** 다. 우리는 전부 리사이즈·크롭했거나 JPEG→WebP로 재인코딩했으므로 5장 모두 **현재 상태로는 조건 위반**이다.

| 순위 | 스티커 id | 유물 | 우리가 한 변형 | 대체 가능 여부 |
|---|---|---|---|---|
| 1 | `honcheonui` | 혼천의 및 혼천시계 | **크롭 + 리사이즈** (1920×1200 → 557×576) | ❌ 국가유산청 보유 4장 전부 제4유형 → **교체 불가, 내려야 함** |
| 2 | `moon-jar` | 백자 달항아리(2007-2) | **리사이즈** (1920×1200 → 1024×640) | ✅ 「백자 달항아리(2005-1)」 보물·국립중앙박물관 사진이 제1유형 → 교체로 해결 |
| 3 | `hunminjeongeum` | 훈민정음 | WebP 재인코딩 (626×710 유지) | ❌ 국가유산청 보유 9장 전부 제4유형(간송미술관) → **교체 불가, 내려야 함** |
| 4 | `janggyeong-panjeon` | 합천 해인사 장경판전 | WebP 재인코딩 (900×714 유지) | ✅ 같은 유산 28장 중 16장이 제1유형 → 다른 사진으로 교체 |
| 5 | `bulguksa` | 경주 불국사(사적) | WebP 재인코딩 (750×661 유지) | ✅ 같은 유산 42장 중 다수가 제1유형 → 다른 사진으로 교체 |

> 크기를 그대로 둔 3·4·5번도 안전하지 않다. JPEG→WebP 변환은 "변경"으로 해석될 여지가 있고, 앱 안에서 액자·확대창 UI에 얹혀 보이는 것도 마찬가지다. 보수적으로 처리할 것.

> 제4유형은 **상업적 이용도 금지**다. 본 앱은 무료 교육용이라 현재는 문제가 없지만, 유료 연수 자료·상품에 포함시키는 순간 별도 위반이 된다.

---

## 확인 방법 (근거)

국가유산청은 **사진별로** 공공누리 유형을 다르게 부여하며, 그 값을 이미지 OpenAPI 응답의 `imageNuri` 필드로 기계적으로 고지한다.

> **원문 인용** — 국가유산청 「Open API 개방목록 > 국가유산정보 > 활용정보」
> `imageNuri  String  공공누리 타입  A : 제1유형, B : 제2유형, C : 제3유형, D : 제4유형, E : 제0유형, F : AI 유형 (복수타입)  AI유형 예) A/F (제1유형 + AI유형), B/F (제2유형 + AI유형)  공공누리 유형안내 - https://www.kogl.or.kr/info/license.do`
>
> 출처: <https://www.khs.go.kr/html/HtmlPage.do?pg=/publicinfo/pbinfo3_0202.jsp&mn=NS_04_04_03>

유형별 조건은 국가유산청 저작권정책이 그대로 고지한다.

> **원문 인용** — 국가유산청 「저작권정책」
> 제1유형: "공공저작물의 출처를 명시하고, 상업적 활용 여부에 관계없이 이용하며, 2차적저작물 작성 등 변경하여 이용할 수 있다."
> 제4유형: "공공저작물의 출처를 명시하여 이용할수 있으나, 상업적 목적으로 이용하거나 2차적저작물 작성 등 변경하여 이용하는 것은 금지된다."
>
> 출처: <https://www.khs.go.kr/html/HtmlPage.do?pg=/guide/copyright.jsp&mn=NS_08_03>

### 사진 식별 절차

`imageNuri` 는 유산 단위가 아니라 **사진 한 장 단위**라, "우리가 받은 그 사진"을 특정해야 유형을 말할 수 있다. 그래서:

1. 유산명으로 `SearchKindOpenapiList.do` → 후보 유산의 `ccbaKdcd`/`ccbaAsno`/`ccbaCtcd` 획득
2. 각 유산의 `SearchImageOpenapi.do` → `(imageNuri, imageUrl)` 쌍 전량 수집 (총 719장 다운로드)
3. `source-assets/photos-original/*.jpg` 와 **MD5 바이트 완전 일치**로 원본 사진 특정 (23/23 전부 일치)
4. 일치한 `imageUrl` 과 같은 `<item>` 안의 `imageNuri` 를 그 사진의 유형으로 확정

즉 아래 표의 유형은 추정이 아니라 **바이트 단위로 동일함이 확인된 그 사진에 국가유산청이 붙여둔 값**이다.

---

## 국가유산청 경로 23장 — 전수 결과

지정 상세 페이지 URL 형식:
`https://www.heritage.go.kr/heri/cul/culSelectDetail.do?pageNo=1_1_1_1&ccbaKdcd={종목}&ccbaAsno={관리번호}&ccbaCtcd={시도}`

| 스티커 id | 유물명 (API 등록명) | 출처 경로 | 공공누리 유형 | 확인한 URL | 변형(리사이즈·크롭) 가능 여부 | 조치 필요 |
|---|---|---|---|---|---|---|
| `cheugugi` | 공주 충청감영 측우기 (국보, 국립기상박물관) | 국가유산청 OpenAPI | **제1유형** (A) | [상세](https://www.heritage.go.kr/heri/cul/culSelectDetail.do?pageNo=1_1_1_1&ccbaKdcd=11&ccbaAsno=0003290000000&ccbaCtcd=11) · [원본](http://www.khs.go.kr/unisearch/images/national_treasure/2020022717235400.jpg) | ✅ 가능 | 없음 |
| `silla-crown` | 금관총 금관 및 금제 관식 (국보, 국립경주박물관) | 국가유산청 OpenAPI | **제1유형** (A) | [상세](https://www.heritage.go.kr/heri/cul/culSelectDetail.do?pageNo=1_1_1_1&ccbaKdcd=11&ccbaAsno=0000870000000&ccbaCtcd=37) · [원본](http://www.khs.go.kr/unisearch/images/national_treasure/1612812.jpg) | ✅ 가능 | 없음 |
| `baekje-incense-burner` | 백제 금동대향로 (국보, 국립부여박물관) | 국가유산청 OpenAPI | **제1유형** (A) | [상세](https://www.heritage.go.kr/heri/cul/culSelectDetail.do?pageNo=1_1_1_1&ccbaKdcd=11&ccbaAsno=0002870000000&ccbaCtcd=34) · [원본](http://www.khs.go.kr/unisearch/images/national_treasure/1612303.jpg) | ✅ 가능 | 없음 |
| `celadon-maebyeong` | 청자 상감운학문 매병 (보물, 국립중앙박물관) | 국가유산청 OpenAPI | **제1유형** (A) | [상세](https://www.heritage.go.kr/heri/cul/culSelectDetail.do?pageNo=1_1_1_1&ccbaKdcd=12&ccbaAsno=0018690000000&ccbaCtcd=11) · [원본](http://www.khs.go.kr/unisearch/images/treasure/2456495.jpg) | ✅ 가능 | 없음 |
| `goryeo-celadon` | (celadon-maebyeong 과 동일 파일) | 국가유산청 OpenAPI | **제1유형** (A) | 위와 동일 | ✅ 가능 | 없음 |
| `angbuilgu` | 앙부일구 (보물, 국립고궁박물관) | 국가유산청 OpenAPI | **제1유형** (A) | [상세](https://www.heritage.go.kr/heri/cul/culSelectDetail.do?pageNo=1_1_1_1&ccbaKdcd=12&ccbaAsno=0008450000000&ccbaCtcd=11) · [원본](http://www.khs.go.kr/unisearch/images/treasure/1614079.jpg) | ✅ 가능 | 없음 |
| `cheomseongdae` | 경주 첨성대 (국보, 경주시) | 국가유산청 OpenAPI | **제1유형** (A) | [상세](https://www.heritage.go.kr/heri/cul/culSelectDetail.do?pageNo=1_1_1_1&ccbaKdcd=11&ccbaAsno=0000310000000&ccbaCtcd=37) · [원본](http://www.khs.go.kr/unisearch/images/national_treasure/1612759.jpg) | ✅ 가능 | 없음 (같은 유산 12장 중 3장은 제4유형 — 다른 사진 추가 시 재확인) |
| `dabotap` | 경주 불국사 다보탑 (국보, 불국사) | 국가유산청 OpenAPI | **제1유형** (A) | [상세](https://www.heritage.go.kr/heri/cul/culSelectDetail.do?pageNo=1_1_1_1&ccbaKdcd=11&ccbaAsno=0000200000000&ccbaCtcd=37) · [원본](http://www.khs.go.kr/unisearch/images/national_treasure/1612673.jpg) | ✅ 가능 | 없음 |
| `seokgatap` | 경주 불국사 삼층석탑 (국보, 불국사) | 국가유산청 OpenAPI | **제1유형** (A) | [상세](https://www.heritage.go.kr/heri/cul/culSelectDetail.do?pageNo=1_1_1_1&ccbaKdcd=11&ccbaAsno=0000210000000&ccbaCtcd=37) · [원본](http://www.khs.go.kr/unisearch/images/national_treasure/1612683.jpg) | ✅ 가능 | 없음 (10장 중 1장은 제4유형) |
| `tripitaka` | 합천 해인사 대장경판 (국보, 해인사) | 국가유산청 OpenAPI | **제1유형** (A) | [상세](https://www.heritage.go.kr/heri/cul/culSelectDetail.do?pageNo=1_1_1_1&ccbaKdcd=11&ccbaAsno=0000320000000&ccbaCtcd=38) · [원본](http://www.khs.go.kr/unisearch/images/national_treasure/1612968.jpg) | ✅ 가능 | 없음 (42장 중 2장은 제4유형) |
| `jagyeongnu` | 창경궁 자격루 누기 (국보, 국립고궁박물관) | 국가유산청 OpenAPI | **제1유형** (A) | [상세](https://www.heritage.go.kr/heri/cul/culSelectDetail.do?pageNo=1_1_1_1&ccbaKdcd=11&ccbaAsno=0002290000000&ccbaCtcd=11) · [원본](http://www.khs.go.kr/unisearch/images/national_treasure/1611777.jpg) | ✅ 가능 | 없음 |
| `muryeong-ornament` | 무령왕 금제 관식 (국보, 국립공주박물관) | 국가유산청 OpenAPI | **제1유형** (A) | [상세](https://www.heritage.go.kr/heri/cul/culSelectDetail.do?pageNo=1_1_1_1&ccbaKdcd=11&ccbaAsno=0001540000000&ccbaCtcd=34) · [원본](http://www.khs.go.kr/unisearch/images/national_treasure/1612272.jpg) | ✅ 가능 | 없음 |
| `moon-jar` | 백자 달항아리(2007-2) (국보, 국립고궁박물관) | 국가유산청 OpenAPI | ⚠️ **제4유형** (D) | [상세](https://www.heritage.go.kr/heri/cul/culSelectDetail.do?pageNo=1_1_1_1&ccbaKdcd=11&ccbaAsno=0003100000000&ccbaCtcd=11) · [원본](http://www.khs.go.kr/unisearch/images/national_treasure/2279477.jpg) | ❌ **변경 금지** — 1920×1200 → 1024×640 리사이즈함 | **교체**: 「백자 달항아리(2005-1)」 보물·국립중앙박물관 사진이 제1유형 |
| `daedongyeojido` | 대동여지도(2008) (보물, 서울대학교 규장각) | 국가유산청 OpenAPI | **제1유형** (A) | [상세](https://www.heritage.go.kr/heri/cul/culSelectDetail.do?pageNo=1_1_1_1&ccbaKdcd=12&ccbaAsno=0008500000300&ccbaCtcd=11) · [원본](http://www.khs.go.kr/unisearch/images/treasure/1614099.jpg) | ✅ 가능 | 없음 (동명 유산 다수가 제4유형 — 반드시 이 관리번호본만 사용) |
| `donguibogam` | 동의보감(2015-1) (국보, 국립중앙도서관) | 국가유산청 OpenAPI | **제1유형** (A) | [상세](https://www.heritage.go.kr/heri/cul/culSelectDetail.do?pageNo=1_1_1_1&ccbaKdcd=11&ccbaAsno=0003190000100&ccbaCtcd=11) · [원본](http://www.khs.go.kr/unisearch/images/national_treasure/2549237.jpg) | ✅ 가능 | 없음 |
| `sillok` | 조선왕조실록 정족산사고본 (국보, 서울대학교규장각 한국학연구원) | 국가유산청 OpenAPI | **제1유형** (A) | [상세](https://www.heritage.go.kr/heri/cul/culSelectDetail.do?pageNo=1_1_1_1&ccbaKdcd=11&ccbaAsno=0001510000100&ccbaCtcd=11) · [원본](http://www.khs.go.kr/unisearch/images/national_treasure/2019062813442300.jpg) | ✅ 가능 | 없음 (5장 전부 제1유형) |
| `dolmen` | 고창 죽림리 지석묘군 (사적, 고창군) | 국가유산청 OpenAPI | **제1유형** (A) | [상세](https://www.heritage.go.kr/heri/cul/culSelectDetail.do?pageNo=1_1_1_1&ccbaKdcd=13&ccbaAsno=0003910000000&ccbaCtcd=35) · [원본](http://www.khs.go.kr/unisearch/images/history_site/1626943.jpg) | ✅ 가능 | 없음 (32장 중 7장은 제4유형) |
| `honcheonui` | 혼천의 및 혼천시계 (국보, 고려대학교박물관) | 국가유산청 OpenAPI | ⚠️ **제4유형** (D) | [상세](https://www.heritage.go.kr/heri/cul/culSelectDetail.do?pageNo=1_1_1_1&ccbaKdcd=11&ccbaAsno=0002300000000&ccbaCtcd=11) · [원본](http://www.khs.go.kr/unisearch/images/national_treasure/2279648.jpg) | ❌ **변경 금지** — 크롭 + 리사이즈함 (1920×1200 → 557×576) | **최우선 조치**. 이 유산의 사진 4장이 전부 제4유형이라 국가유산청 내 대체본 없음 → **삭제 후 일러스트로 되돌리거나 다른 기관 개방자료 확보** |
| `hunminjeongeum` | 훈민정음 (국보, 간송미술관) | 국가유산청 OpenAPI | ⚠️ **제4유형** (D) | [상세](https://www.heritage.go.kr/heri/cul/culSelectDetail.do?pageNo=1_1_1_1&ccbaKdcd=11&ccbaAsno=0000700000000&ccbaCtcd=11) · [원본](http://www.khs.go.kr/unisearch/images/national_treasure/1611468.jpg) | ❌ **변경 금지** — 크기는 유지(626×710)했으나 WebP 재인코딩 | 이 유산 9장 전부 제4유형 → **대체본 없음, 삭제 권장** |
| `celadon-melon` | 청자 참외모양 병 (국보, 국립중앙박물관) | 국가유산청 OpenAPI | **제1유형** (A) | [상세](https://www.heritage.go.kr/heri/cul/culSelectDetail.do?pageNo=1_1_1_1&ccbaKdcd=11&ccbaAsno=0000940000000&ccbaCtcd=11) · [원본](http://www.khs.go.kr/unisearch/images/national_treasure/1611512.jpg) | ✅ 가능 | 없음 |
| `seokguram` | 경주 석굴암 석굴 (국보, 불국사) | 국가유산청 OpenAPI | **제1유형** (A) | [상세](https://www.heritage.go.kr/heri/cul/culSelectDetail.do?pageNo=1_1_1_1&ccbaKdcd=11&ccbaAsno=0000240000000&ccbaCtcd=37) · [원본](http://www.khs.go.kr/unisearch/images/national_treasure/1612705.jpg) | ✅ 가능 | 없음 (89장 중 1장은 제4유형) |
| `janggyeong-panjeon` | 합천 해인사 장경판전 (국보, 해인사) | 국가유산청 OpenAPI | ⚠️ **제4유형** (D) | [상세](https://www.heritage.go.kr/heri/cul/culSelectDetail.do?pageNo=1_1_1_1&ccbaKdcd=11&ccbaAsno=0000520000000&ccbaCtcd=38) · [원본](http://www.khs.go.kr/unisearch/images/national_treasure/1613038.jpg) | ❌ **변경 금지** — 크기는 유지(900×714), WebP 재인코딩 | **교체**: 같은 유산 28장 중 16장이 제1유형 |
| `bulguksa` | 경주 불국사 (사적, 불국사) | 국가유산청 OpenAPI | ⚠️ **제4유형** (D) | [상세](https://www.heritage.go.kr/heri/cul/culSelectDetail.do?pageNo=1_1_1_1&ccbaKdcd=13&ccbaAsno=0005020000000&ccbaCtcd=37) · [원본](http://www.khs.go.kr/unisearch/images/history_site/1628056.jpg) | ❌ **변경 금지** — 크기는 유지(750×661), WebP 재인코딩 | **교체**: 같은 유산 42장 중 다수가 제1유형 |

---

## e뮤지엄 경로 16장

수집 시 e뮤지엄 상세검색에서 **공공누리 제1유형(출처표시) 필터**(`publicType=1`)를 적용했고 상세 페이지의 "공공누리 출처표시 조건" 문구를 확인함 (`docs/EMUSEUM-GUIDE.md`, `docs/emuseum-harvest.json` 에 수집 기록 있음).
→ **제1유형 16장. 리사이즈·크롭 모두 허용. 조치 없음.**

comb-pottery, hand-axe, plain-pottery, half-moon-knife, bipa-dagger, spindle-whorl, bone-needle, sumbe-point, polished-stone, goguryeo-mural, gwanggaeto-stele, metal-type, goryeo-painting, independent-news, taegeukgi, declaration

---

## 미확인 항목

| 스티커 id | 상태 | 왜 확인이 안 됐는지 |
|---|---|---|
| `net-sinker` (그물추) | **미확인** | `src/data/assets.ts` 의 `PHOTO_CREDITS` 에는 e뮤지엄(EMU)으로 기재돼 있으나, `docs/emuseum-harvest.json` 16건에 없고 `public/assets/CREDITS.md` 표에도 없다. **원본 소장품 번호(rid)가 기록되지 않아 어느 소장품 사진인지 특정할 수 없고, 따라서 공공누리 유형을 확인할 방법이 없다.** 수집 당시 제1유형 필터를 썼는지 확인 불가 → 재수집하여 rid·유형을 기록하거나 내릴 것 |

국가유산청 23장 중 미확인은 **없다**.

---

## 기관 전체 일괄 고지는 있었나? — **없다**

찾아본 곳과 결과:

| 확인처 | 결과 |
|---|---|
| [국가유산청 저작권정책](https://www.khs.go.kr/html/HtmlPage.do?pg=/guide/copyright.jsp&mn=NS_08_03) | 제1~4유형의 **조건 설명만** 있고, "국가유산청 제공 이미지는 전부 제N유형" 같은 일괄 고지 **없음** |
| [국가유산청 Open API 개방목록 > 활용정보](https://www.khs.go.kr/html/HtmlPage.do?pg=/publicinfo/pbinfo3_0202.jsp&mn=NS_04_04_03) | 일괄 고지 대신 **`imageNuri` 필드로 사진마다 유형을 개별 고지**한다고 명시 (위 원문 인용). 즉 국가유산청은 명시적으로 "사진별로 다르다"는 입장 |
| [국가유산청 Open API 개방목록](https://www.khs.go.kr/html/HtmlPage.do?pg=%2Fpublicinfo%2Fpbinfo3_0201.jsp&mn=NS_04_04_03) | 하단 공공누리 배너 링크만 있고 유형 고지 없음 |
| [국가유산 지식이음(국립문화유산연구원)](http://portal.nrich.go.kr/kor/apiView.do?menuIdx=665&idx=51) | "국립문화유산연구원이 개방한 Open API 개방목록 저작물은 공공누리 제 1유형 '출처표시' 조건에 따라 이용할 수 있습니다" — **일괄 제1유형 고지가 있으나, 이는 국립문화유산연구원(nrich) 자료 한정이고 우리가 쓴 `khs.go.kr` 이미지 API 경로에는 적용되지 않음** |

**결론: 일괄 고지로 23장을 한 번에 해결할 수는 없다.** 사진 한 장 단위로 `imageNuri` 를 확인하는 것이 국가유산청이 지정한 유일한 방법이고, 이 문서가 그 전수 결과다.

---

## 앞으로 사진을 추가할 때

1. `SearchImageOpenapi.do` 응답에서 **`imageNuri` 가 `A` 인 사진만** 받는다. (`A/F` 처럼 복수타입이면 AI 생성 여부도 함께 고지해야 함)
2. 받은 `imageUrl` 과 `imageNuri` 를 `CREDITS.md` 에 그대로 기록한다. 나중에 어느 사진인지 못 찾으면 이번처럼 719장을 다시 받아 대조해야 한다.
3. 같은 유물이라도 관리번호(`ccbaAsno`)가 다르면 유형이 다르다. 「백자 달항아리」는 8건 중 1건만, 「대동여지도」는 8건 중 3건만 제1유형이다.
