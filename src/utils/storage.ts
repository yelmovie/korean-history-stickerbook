import type { PeriodId, SaveData } from '../types'

export const SAVE_KEY = 'kh_stickerbook_save_v1'

const PERIODS: PeriodId[] = ['prehistoric', 'threeKingdoms', 'goryeo', 'joseon', 'modern']

export function defaultSave(): SaveData {
  const diary = {} as SaveData['diary']
  for (const p of PERIODS) diary[p] = { stickers: [], note: '' }
  return {
    version: 1,
    completedStages: [],
    earnedStickers: [],
    questionResults: {},
    bestRuns: {},
    diary,
    settings: { muted: false, bgmMuted: false, sfxMuted: false, unlockAll: false },
    lastSavedAt: new Date().toISOString(),
  }
}

/** 저장 데이터가 있으면 불러오고, 깨졌으면 corrupted=true와 함께 기본값 반환 */
export function loadSave(): { data: SaveData; existed: boolean; corrupted: boolean } {
  let raw: string | null = null
  try {
    raw = localStorage.getItem(SAVE_KEY)
  } catch {
    return { data: defaultSave(), existed: false, corrupted: false }
  }
  if (raw === null) return { data: defaultSave(), existed: false, corrupted: false }
  try {
    const parsed = JSON.parse(raw) as Partial<SaveData>
    if (typeof parsed !== 'object' || parsed === null || parsed.version !== 1) {
      throw new Error('bad save')
    }
    // 필드 단위로 기본값 위에 얹어 누락·손상 필드를 복구한다
    const base = defaultSave()
    const data: SaveData = {
      ...base,
      completedStages: Array.isArray(parsed.completedStages)
        ? base.completedStages.concat(parsed.completedStages.filter((s): s is SaveData['completedStages'][number] => typeof s === 'string') as SaveData['completedStages'])
        : base.completedStages,
      earnedStickers: Array.isArray(parsed.earnedStickers)
        ? parsed.earnedStickers.filter((s): s is string => typeof s === 'string')
        : base.earnedStickers,
      questionResults:
        typeof parsed.questionResults === 'object' && parsed.questionResults !== null
          ? parsed.questionResults
          : base.questionResults,
      bestRuns: typeof parsed.bestRuns === 'object' && parsed.bestRuns !== null ? parsed.bestRuns : base.bestRuns,
      diary: { ...base.diary, ...(typeof parsed.diary === 'object' && parsed.diary !== null ? parsed.diary : {}) },
      settings: { ...base.settings, ...(typeof parsed.settings === 'object' ? parsed.settings : {}) },
      lastSavedAt: typeof parsed.lastSavedAt === 'string' ? parsed.lastSavedAt : base.lastSavedAt,
    }
    for (const p of PERIODS) {
      const page = data.diary[p]
      if (!page || !Array.isArray(page.stickers) || typeof page.note !== 'string') {
        data.diary[p] = { stickers: [], note: '' }
      }
    }
    return { data, existed: true, corrupted: false }
  } catch {
    return { data: defaultSave(), existed: false, corrupted: true }
  }
}

/** 저장. 실패하면 false (호출부에서 안내 표시) */
export function persistSave(data: SaveData): boolean {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ ...data, lastSavedAt: new Date().toISOString() }))
    return true
  } catch {
    return false
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY)
  } catch {
    // 무시: 읽기 전용 환경
  }
}
