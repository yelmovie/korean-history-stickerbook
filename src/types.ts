export type Screen =
  | 'main'
  | 'stageSelect'
  | 'stage1'
  | 'stage2'
  | 'stage3'
  | 'stage4'
  | 'stage5'
  | 'diaryEdit'
  | 'diaryShow'
  | 'completion'

export type StageId = 'stage1' | 'stage2' | 'stage3' | 'stage4' | 'stage5'

export type PeriodId = 'prehistoric' | 'threeKingdoms' | 'goryeo' | 'joseon' | 'modern'

export interface Sticker {
  id: string
  period: PeriodId
  name: string
  /** assets.ts의 아이콘 id. 미확정이면 null → 이름 칩으로 표시 */
  icon: string | null
  /** 다이어리 한 줄 설명의 기본 제안 문장 */
  hintLine: string
  contentReviewNeeded?: boolean
  sourceNote?: string
}

interface QuestionBase {
  id: string
  stageId: StageId
  prompt: string
  explanation: string
  rewardStickerId: string
  contentReviewNeeded?: boolean
  sourceNote?: string
}

/** 관찰 근거형·기능 추론형·비교형·자료 해석형·짧은 서술형(선택 완성) */
export interface ChoiceQuestion extends QuestionBase {
  type: 'choice'
  /** 중앙에 크게 보여줄 유물 아이콘 id */
  artifactIcon?: string | null
  artifactName?: string
  /** 관찰 포인트: 클릭하면 힌트 카드가 열린다 */
  observePoints?: { label: string; text: string }[]
  choices: string[]
  answerIndex: number
  /** 오답 시 보여줄 힌트형 피드백 */
  wrongHint?: string
}

/** 시대·지역 배치형: 유물을 슬롯에 놓고 근거를 고른다 */
export interface PlacementQuestion extends QuestionBase {
  type: 'placement'
  artifactIcon?: string | null
  artifactName: string
  slots: { id: string; label: string }[]
  correctSlotId: string
  reasonPrompt: string
  reasonChoices: string[]
  reasonAnswerIndex: number
  wrongHint?: string
}

/** 선잇기: 왼쪽-오른쪽 짝 연결 */
export interface MatchQuestion extends QuestionBase {
  type: 'match'
  left: { id: string; label: string; icon?: string | null }[]
  right: { id: string; label: string }[]
  /** leftId → rightId */
  pairs: Record<string, string>
}

/** 순서 배열형 */
export interface OrderingQuestion extends QuestionBase {
  type: 'ordering'
  items: { id: string; label: string; icon?: string | null }[]
  correctOrder: string[]
}

/** 퍼즐 복원형 (고려청자) */
export interface PuzzleQuestion extends QuestionBase {
  type: 'puzzle'
  artifactIcon: string | null
  artifactName: string
  pieceCount: number
  /** 복원 후 이어지는 근거 선택 */
  reasonPrompt: string
  reasonChoices: string[]
  reasonAnswerIndex: number
}

export type Question =
  | ChoiceQuestion
  | PlacementQuestion
  | MatchQuestion
  | OrderingQuestion
  | PuzzleQuestion

export interface DiaryPlacedSticker {
  stickerId: string
  /** 0~1 비율 좌표 (화면 크기 무관) */
  x: number
  y: number
  scale: number
  rotation: number
  z: number
}

export interface DiaryPage {
  stickers: DiaryPlacedSticker[]
  note: string
}

export interface SaveData {
  version: 1
  completedStages: StageId[]
  earnedStickers: string[]
  /** questionId → 정답 여부 (첫 시도 기준) */
  questionResults: Record<string, boolean>
  diary: Record<PeriodId, DiaryPage>
  settings: { muted: boolean }
  lastSavedAt: string
}
