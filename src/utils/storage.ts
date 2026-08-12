import type { PeriodId, SaveData, StageId } from '../types'

export const SAVE_KEY = 'kh_stickerbook_save_v1'

const PERIODS: PeriodId[] = ['prehistoric', 'threeKingdoms', 'goryeo', 'joseon', 'modern']
const STAGES: StageId[] = ['stage1', 'stage2', 'stage3', 'stage4', 'stage5']

export function defaultSave(): SaveData {
  const diary = {} as SaveData['diary']
  for (const p of PERIODS) diary[p] = { stickers: [], note: '' }
  return {
    version: 1,
    completedStages: [],
    earnedStickers: [],
    questionResults: {},
    bestRuns: {},
    stageProgress: {},
    diary,
    settings: { muted: false, bgmMuted: false, sfxMuted: false, unlockAll: false },
    lastSavedAt: new Date().toISOString(),
  }
}

/** 이어하기 지점은 숫자 두 개뿐이라 값이 이상하면 그 스테이지만 버린다(전체 저장본은 살린다) */
function sanitizeStageProgress(raw: unknown): SaveData['stageProgress'] {
  const out: SaveData['stageProgress'] = {}
  if (typeof raw !== 'object' || raw === null) return out
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!STAGES.includes(key as StageId)) continue
    if (typeof value !== 'object' || value === null) continue
    const { index, correct } = value as { index?: unknown; correct?: unknown }
    if (!Number.isInteger(index) || (index as number) <= 0) continue
    out[key as StageId] = {
      index: index as number,
      correct: Number.isInteger(correct) && (correct as number) >= 0 ? (correct as number) : 0,
    }
  }
  return out
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
      // stageProgress 는 나중에 생긴 필드 — 옛 저장본에는 없으므로 기본값 {} 로 시작한다
      stageProgress: sanitizeStageProgress(parsed.stageProgress),
      diary: { ...base.diary, ...(typeof parsed.diary === 'object' && parsed.diary !== null ? parsed.diary : {}) },
      settings: { ...base.settings, ...(typeof parsed.settings === 'object' ? parsed.settings : {}) },
      lastSavedAt: typeof parsed.lastSavedAt === 'string' ? parsed.lastSavedAt : base.lastSavedAt,
    }
    for (const p of PERIODS) {
      const page = data.diary[p]
      if (!page || !Array.isArray(page.stickers) || typeof page.note !== 'string') {
        data.diary[p] = { stickers: [], note: '' }
        continue
      }
      // uid가 없던 시절 저장본 보정 — 없으면 그 자리에서 하나 만들어 준다
      page.stickers = page.stickers.map((s, i) =>
        s && typeof s.uid === 'string' ? s : { ...s, uid: `${p}-${i}-legacy` },
      )
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
