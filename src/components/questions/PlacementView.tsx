import { useRef, useState } from 'react'
import { iconSrc } from '../../data/assets'
import type { PlacementQuestion } from '../../types'
import { audio } from '../../utils/audio'
import { AssetImage } from '../AssetImage'
import { PaperCard } from '../common'
import { ChoiceList, HintBubble } from './shared'

interface Props {
  question: PlacementQuestion
  onSolved: (firstTryCorrect: boolean) => void
}

/** 1단계: 유물을 알맞은 슬롯에 드래그(또는 선택 후 탭). 2단계: 근거 선택 */
export function PlacementView({ question, onSolved }: Props) {
  const [placed, setPlaced] = useState(false)
  const [missed, setMissed] = useState(false)
  const [wrongSlots, setWrongSlots] = useState<string[]>([])
  const [wrongReasons, setWrongReasons] = useState<number[]>([])
  const [hintMsg, setHintMsg] = useState<string | null>(null)
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null)
  const [armed, setArmed] = useState(false)
  const slotRefs = useRef(new Map<string, HTMLButtonElement>())
  const startPos = useRef({ x: 0, y: 0 })

  const trySlot = (slotId: string) => {
    if (slotId === question.correctSlotId) {
      audio.playSfx('snap')
      setPlaced(true)
      setHintMsg(null)
    } else if (!wrongSlots.includes(slotId)) {
      audio.playSfx('wrong')
      setWrongSlots([...wrongSlots, slotId])
      setMissed(true)
      setHintMsg(question.wrongHint ?? '다른 시대를 다시 생각해 보세요!')
    }
    setArmed(false)
  }

  const pickReason = (i: number) => {
    if (i === question.reasonAnswerIndex) {
      audio.playSfx('correct')
      onSolved(!missed && wrongReasons.length === 0)
    } else if (!wrongReasons.includes(i)) {
      audio.playSfx('wrong')
      setWrongReasons([...wrongReasons, i])
      setHintMsg(question.wrongHint ?? '근거를 다시 살펴보세요!')
    }
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (placed) return
    e.currentTarget.setPointerCapture(e.pointerId)
    startPos.current = { x: e.clientX, y: e.clientY }
    setDrag({ x: 0, y: 0 })
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (drag === null) return
    setDrag({ x: e.clientX - startPos.current.x, y: e.clientY - startPos.current.y })
  }
  const onPointerUp = (e: React.PointerEvent) => {
    if (drag === null) return
    const moved = Math.hypot(drag.x, drag.y) > 12
    setDrag(null)
    if (!moved) {
      // 탭: 선택 상태 토글 → 슬롯 탭으로 배치 (키보드·터치 접근 대체 경로)
      setArmed(!armed)
      return
    }
    for (const [slotId, el] of slotRefs.current) {
      const r = el.getBoundingClientRect()
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
        trySlot(slotId)
        return
      }
    }
  }

  if (placed) {
    return (
      <div className="qv qv-reason">
        <PaperCard className="qv__prompt-card">
          <p className="qv__prompt">{question.reasonPrompt}</p>
        </PaperCard>
        <ChoiceList choices={question.reasonChoices} wrongPicks={wrongReasons} onPick={pickReason} />
        <HintBubble msg={hintMsg} />
      </div>
    )
  }

  return (
    <div className="qv qv-placement">
      <PaperCard className="qv__prompt-card">
        <p className="qv__prompt">{question.prompt}</p>
      </PaperCard>
      <div className="placement-slots">
        {question.slots.map((s) => (
          <button
            key={s.id}
            type="button"
            ref={(el) => {
              if (el) slotRefs.current.set(s.id, el)
              else slotRefs.current.delete(s.id)
            }}
            className={`placement-slot ${wrongSlots.includes(s.id) ? 'placement-slot--wrong' : ''} ${armed ? 'placement-slot--target' : ''}`}
            onClick={() => armed && trySlot(s.id)}
            aria-label={`${s.label} 자리에 놓기`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="placement-tray">
        <button
          type="button"
          className={`placement-artifact ${armed ? 'placement-artifact--armed' : ''}`}
          style={drag ? { transform: `translate(${drag.x}px, ${drag.y}px)`, zIndex: 30 } : undefined}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          aria-label={`${question.artifactName} — 끌어서 알맞은 자리에 놓거나, 눌러서 고른 뒤 자리를 누르세요`}
        >
          <AssetImage
            src={iconSrc(question.artifactIcon)}
            alt={question.artifactName}
            className="placement-artifact__img"
            fallbackLabel={question.artifactName}
          />
          <span className="placement-artifact__name">{question.artifactName}</span>
        </button>
        <p className="placement-guide">유물을 끌어서 알맞은 자리에 놓아 보세요</p>
      </div>
      <HintBubble msg={hintMsg} />
    </div>
  )
}
