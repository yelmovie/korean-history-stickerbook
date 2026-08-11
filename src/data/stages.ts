import type { PeriodId, StageId } from '../types'
import { A } from './assets'

export interface StageMeta {
  id: StageId
  order: number
  title: string
  subtitle: string
  period: PeriodId
  periodLabel: string
  badge: string
  character: string
  mascot: string
  prop: string
  /** 배경 구도상 캐릭터를 오른쪽에 두는 스테이지 */
  swapSides?: boolean
}

export const STAGES: StageMeta[] = [
  {
    id: 'stage1', order: 1, title: '선사 박물관', subtitle: '유물을 관찰하고 생활 모습을 추리해요',
    period: 'prehistoric', periodLabel: '선사 시대',
    badge: A.badgePrehistoric, character: A.s1Girl, mascot: A.s1Mole, prop: A.s1Hearth,
  },
  {
    id: 'stage2', order: 2, title: '삼국 문화유산 탐험', subtitle: '문화유산을 나라와 지역에 연결해요',
    period: 'threeKingdoms', periodLabel: '삼국·통일신라',
    badge: A.badgeThreeKingdoms, character: A.s2Boy, mascot: A.s2Haechi, prop: A.s2MapDesk,
  },
  {
    id: 'stage3', order: 3, title: '고려 보물 복원소', subtitle: '고려의 기술과 문화를 복원해요',
    period: 'goryeo', periodLabel: '고려 시대',
    badge: A.badgeGoryeo, character: A.s3Boy, mascot: A.s3Turtle, prop: A.s3Workbench, swapSides: true,
  },
  {
    id: 'stage4', order: 4, title: '조선 발명 연구소', subtitle: '발명품의 쓰임을 백성의 생활과 연결해요',
    period: 'joseon', periodLabel: '조선 시대',
    badge: A.badgeJoseon, character: A.s4Boy, mascot: A.s4Rabbit, prop: A.s4StarChart,
  },
  {
    id: 'stage5', order: 5, title: '근현대 역사 기록실', subtitle: '사건의 순서와 의미를 기록으로 살펴요',
    period: 'modern', periodLabel: '근현대',
    badge: A.badgeModern, character: A.s5Girl, mascot: A.s5Raccoon, prop: A.s5Archive,
  },
]

export const stageById = new Map(STAGES.map((s) => [s.id, s]))

export const PERIOD_LABELS: Record<PeriodId, string> = {
  prehistoric: '선사 시대',
  threeKingdoms: '삼국·통일신라',
  goryeo: '고려 시대',
  joseon: '조선 시대',
  modern: '근현대',
}
