/** 에셋 경로는 이 파일에서만 관리한다.
 *  아이콘 원본: source-assets/icons-numbered/N.png ↔ 앱: /assets/opt/icons/iNNN.webp
 *  전체 목록은 docs/asset-catalog.md 참고 */

export function iconSrc(id: string | null | undefined): string | null {
  return id ? `/assets/opt/icons/${id}.webp` : null
}

export function bgSrc(id: string): string {
  return `/assets/opt/bg/${id}.webp`
}

/** 실물 사진 출처 (상세 소장처는 CREDITS.md). KHS = 국가유산청 국가유산포털 OpenAPI, EMU = e뮤지엄(공공누리 제1유형 필터 확인) */
const KHS = '사진 ⓒ 국가유산청 국가유산포털'
const EMU = '사진 ⓒ 국립박물관 e뮤지엄'

export const PHOTO_CREDITS: Record<string, string> = {
  cheugugi: KHS, 'silla-crown': KHS, 'baekje-incense-burner': KHS, 'celadon-maebyeong': KHS,
  angbuilgu: KHS, cheomseongdae: KHS, dabotap: KHS, seokgatap: KHS, tripitaka: KHS, jagyeongnu: KHS,
  'muryeong-ornament': KHS, 'moon-jar': KHS, daedongyeojido: KHS, donguibogam: KHS, sillok: KHS,
  dolmen: KHS, 'celadon-melon': KHS, seokguram: KHS, 'goryeo-celadon': KHS,
  // 내림(공공누리 제4유형 = 변경 금지): honcheonui, hunminjeongeum, janggyeong-panjeon, bulguksa
  // 리사이즈·재인코딩이 조건 위반이라 사진을 빼고 스티커 아이콘으로 되돌렸다. docs/KOGL-AUDIT.md 참조
  'comb-pottery': EMU, 'hand-axe': EMU, 'plain-pottery': EMU, 'half-moon-knife': EMU,
  'bipa-dagger': EMU, 'spindle-whorl': EMU, 'bone-needle': EMU, 'sumbe-point': EMU,
  'polished-stone': EMU, 'goguryeo-mural': EMU, 'gwanggaeto-stele': EMU, 'metal-type': EMU,
  'goryeo-painting': EMU, 'independent-news': EMU, taegeukgi: EMU, declaration: EMU,
}

/** 스티커가 아닌 '자료용 사진'의 이름·설명 (PhotoViewer가 스티커에서 못 찾을 때 사용) */
export const PHOTO_ONLY_INFO: Record<string, { name: string; desc: string }> = {}

export function photoSrc(stickerId: string | null | undefined): string | null {
  return stickerId && stickerId in PHOTO_CREDITS ? `/assets/photo/${stickerId}.webp` : null
}

export function photoCredit(stickerId: string | null | undefined): string {
  return (stickerId && PHOTO_CREDITS[stickerId]) || KHS
}

/** 자주 쓰는 에셋의 의미 있는 별칭 */
export const A = {
  logo: 'i001',
  subtitleBanner: 'i002',
  boyExplorer: 'i023',
  girlGuide: 'i031',
  magpie: 'i032',
  tiger: 'i025',
  portal: 'i029',
  compass: 'i027',
  treasureChest: 'i030',
  stickerBox: 'i095',
  diaryCover: 'i096',
  // 스테이지 선택 배지
  badgePrehistoric: 'i010',
  badgeThreeKingdoms: 'i011',
  badgeGoryeo: 'i012',
  badgeJoseon: 'i039',
  badgeModern: 'i016',
  // 스테이지별 캐릭터·마스코트·소품
  s1Girl: 'i040',
  s1Mole: 'i148',
  s1Hearth: 'i048',
  s2Boy: 'i050',
  s2Haechi: 'i149',
  s2MapDesk: 'i056',
  s3Boy: 'i058',
  s3Turtle: 'i150',
  s3Workbench: 'i064',
  s4Boy: 'i075',
  s4Rabbit: 'i151',
  s4StarChart: 'i077',
  s5Girl: 'i083',
  s5Raccoon: 'i152',
  s5Archive: 'i086',
  // 다이어리·수료
  diaryGirl: 'i092',
  diaryHaechi: 'i097',
  showcaseStand: 'i099',
  showcaseSign: 'i102',
  medalGirl: 'i101',
  medal: 'i104',
  wreath: 'i107',
  stamp: 'i106',
  curatorLogo: 'i116',
  certificate: 'i100',
  lanternBouquet: 'i112',
} as const

/** 화면 → 배경 매핑 (docs/asset-catalog.md 근거) */
export const SCREEN_BG = {
  main: 'bg03',
  stageSelect: 'bg01',
  stage1: 'bg05',
  stage2: 'bg06',
  stage3: 'bg07',
  stage4: 'bg08',
  stage5: 'bg09',
  diaryEdit: 'bg10',
  diaryShow: 'bg11',
  completion: 'bg12',
} as const
