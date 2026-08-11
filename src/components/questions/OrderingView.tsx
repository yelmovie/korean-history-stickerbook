import { useRef, useState } from 'react'
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

  /* ---- 카드를 끌어서 칸에 놓기 ---- */
  const dragRef = useRef<{ id: string; x: number; y: number } | null>(null)
  const [drag, setDrag] = useState<{ id: string; x: number; y: number } | null>(null)
  const cellRefs = useRef(new Map<number, HTMLButtonElement>())
  const startPos = useRef({ x: 0, y: 0 })

  const placeAt = (itemId: string, index: number) => {
    audio.playSfx('snap')
    const next = [...slots]
    // 이미 다른 칸에 있으면 빼고 옮긴다
    const prev = next.indexOf(itemId)
    if (prev !== -1) next[prev] = null
    next[index] = itemId
    setSlots(next)
    setWrongFlash([])
  }

  const onCardDown = (id: string) => (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    startPos.current = { x: e.clientX, y: e.clientY }
    dragRef.current = { id, x: 0, y: 0 }
    setDrag({ id, x: 0, y: 0 })
  }

  const onCardMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return
    const d = { id: dragRef.current.id, x: e.clientX - startPos.current.x, y: e.clientY - startPos.current.y }
    dragRef.current = d
    setDrag(d)
  }

  const onCardUp = (e: React.PointerEvent) => {
    const d = dragRef.current
    if (!d) return
    dragRef.current = null
    setDrag(null)
    // 짧게 눌렀으면 다음 빈 칸에 넣는다 (기존 방식 유지)
    if (Math.hypot(d.x, d.y) <= 12) {
      placeNext(d.id)
      return
    }
    // 놓은 지점에서 가장 가까운 칸을 찾는다 (손가락이 빗나가도 들어가게)
    let best: { index: number; dist: number } | null = null
    for (const [index, el] of cellRefs.current) {
      const r = el.getBoundingClientRect()
      const dist = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2))
      if (dist <= Math.max(r.width, r.height) * 1.1 && (!best || dist < best.dist)) best = { index, dist }
    }
    if (best) placeAt(d.id, best.index)
  }

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
              ref={(el) => {
                if (el) cellRefs.current.set(i, el)
                else cellRefs.current.delete(i)
              }}
              className={`timeline-cell ${s ? 'timeline-cell--filled' : ''} ${wrongFlash[i] ? 'timeline-cell--wrong' : ''} ${drag ? 'timeline-cell--target' : ''}`}
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
          <button
            key={item.id}
            type="button"
            className="event-card"
            style={drag?.id === item.id ? { transform: `translate(${drag.x}px, ${drag.y}px)`, zIndex: 30 } : undefined}
            onPointerDown={onCardDown(item.id)}
            onPointerMove={onCardMove}
            onPointerUp={onCardUp}
            onPointerCancel={() => {
              dragRef.current = null
              setDrag(null)
            }}
          >
            {item.icon && (
              <AssetImage src={iconSrc(item.icon)} alt="" className="event-card__icon" fallbackLabel={item.label} />
            )}
            <span>{item.label}</span>
          </button>
        ))}
        {trayItems.length === 0 && <AppButton onClick={check}>순서 확인하기</AppButton>}
      </div>
      {!full && <p className="placement-guide">카드를 끌어서 칸에 놓아 보세요 (눌러서 차례로 채워도 돼요)</p>}
      <HintBubble msg={hintMsg} />
    </div>
  )
}
