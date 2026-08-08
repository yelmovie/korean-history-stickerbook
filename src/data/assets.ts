/** 에셋 경로는 이 파일에서만 관리한다.
 *  아이콘 원본: source-assets/icons-numbered/N.png ↔ 앱: /assets/opt/icons/iNNN.webp
 *  전체 목록은 docs/asset-catalog.md 참고 */

export function iconSrc(id: string | null | undefined): string | null {
  return id ? `/assets/opt/icons/${id}.webp` : null
}

export function bgSrc(id: string): string {
  return `/assets/opt/bg/${id}.webp`
}

/** 실물 사진이 확보된 스티커 id (국가유산청 국가유산포털 OpenAPI 제공, 출처는 CREDITS.md) */
export const REAL_PHOTOS = new Set([
  'cheugugi',
  'silla-crown',
  'baekje-incense-burner',
  'celadon-maebyeong',
  'angbuilgu',
  'cheomseongdae',
  'dabotap',
  'seokgatap',
  'tripitaka',
  'jagyeongnu',
])

export function photoSrc(stickerId: string | null | undefined): string | null {
  return stickerId && REAL_PHOTOS.has(stickerId) ? `/assets/photo/${stickerId}.webp` : null
}

export const PHOTO_CREDIT = '실물 사진 ⓒ 국가유산청 국가유산포털'

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
  s1Mole: 'i041',
  s1Hearth: 'i048',
  s2Boy: 'i050',
  s2Haechi: 'i051',
  s2MapDesk: 'i056',
  s3Boy: 'i058',
  s3Turtle: 'i060',
  s3Workbench: 'i064',
  s4Boy: 'i075',
  s4Rabbit: 'i068',
  s4StarChart: 'i077',
  s5Girl: 'i083',
  s5Raccoon: 'i085',
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
