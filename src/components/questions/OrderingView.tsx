import { useState } from 'react'
import { iconSrc } from '../../data/assets'
import type { OrderingQuestion } from '../../types'
import { audio } from '../../utils/audio'
import { AssetImage } from '../AssetImage'
import { AppButton, PaperCard } from '../common'
import { HintBubble } from './shared'

interface Props {
  question: OrderingQuestion
  onSolved: (firstTryCorrect: boolean) => void
}

/** 순서 배열: 카드를 눌러 연표 칸에 차례로 배치하고, 확인으로 검사한다 */
export function OrderingView({ question, onSolved }: Props) {
  const [slots, setSlots] = useState<(string | null)[]>(question.correctOrder.map(() => null))
  const [missed, setMissed] = useState(false)
  const [wrongFlash, setWrongFlash] = useState<boolean[]>([])
  const [hintMsg, setHintMsg] = useState<string | null>(null)

  const itemById = new Map(question.items.map((i) => [i.id, i]))
  const placedIds = slots.filter((s): s is string => s !== null)
  const trayItems = question.items.filter((i) => !placedIds.includes(i.id))
  const full = placedIds.length === slots.length

  const placeNext = (itemId: string) => {
    const idx = slots.indexOf(null)
    if (idx === -1) return
    audio.playSfx('snap')
    const next = [...slots]
    next[idx] = itemId
    setSlots(next)
    setWrongFlash([])
  }

  const removeAt = (idx: number) => {
    const next = [...slots]
    next[idx] = null
    setSlots(next)
    setWrongFlash([])
  }

  const check = () => {
    const flags = slots.map((s, i) => s !== question.correctOrder[i])
    if (flags.some(Boolean)) {
      audio.playSfx('wrong')
      setMissed(true)
      setWrongFlash(flags)
      setHintMsg('빨간 칸의 순서를 다시 살펴보세요. 카드를 누르면 빼낼 수 있어요.')
    } else {
      audio.playSfx('correct')
      onSolved(!missed)
    }
  }

  return (
    <div className="qv qv-ordering">
      <PaperCard className="qv__prompt-card">
        <p className="qv__prompt">{question.prompt}</p>
      </PaperCard>
      <div className="timeline-board">
        {slots.map((s, i) => (
          <div key={i} className="timeline-cell-wrap">
            <span className="timeline-cell__num">{i + 1}</span>
            <button
              type="button"
              className={`timeline-cell ${s ? 'timeline-cell--filled' : ''} ${wrongFlash[i] ? 'timeline-cell--wrong' : ''}`}
              onClick={() => s && removeAt(i)}
              aria-label={s ? `${itemById.get(s)?.label} — 눌러서 빼기` : `${i + 1}번째 칸 (비어 있음)`}
            >
              {s ? itemById.get(s)?.label : ''}
            </button>
            {i < slots.length - 1 && <span className="timeline-cell__arrow">→</span>}
          </div>
        ))}
      </div>
      <div className="ordering-tray">
        {trayItems.map((item) => (
          <button key={item.id} type="button" className="event-card" onClick={() => placeNext(item.id)}>
            {item.icon && (
              <AssetImage src={iconSrc(item.icon)} alt="" className="event-card__icon" fallbackLabel={item.label} />
            )}
            <span>{item.label}</span>
          </button>
        ))}
        {trayItems.length === 0 && <AppButton onClick={check}>순서 확인하기</AppButton>}
      </div>
      {!full && <p className="placement-guide">사건 카드를 눌러 먼저 일어난 순서대로 채워 보세요</p>}
      <HintBubble msg={hintMsg} />
    </div>
  )
}
