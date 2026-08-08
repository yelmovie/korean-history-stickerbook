import { useRef, useState } from 'react'
import { iconSrc } from '../../data/assets'
import type { PuzzleQuestion } from '../../types'
import { audio } from '../../utils/audio'
import { PaperCard } from '../common'
import { ChoiceList, HintBubble } from './shared'

interface Props {
  question: PuzzleQuestion
  onSolved: (firstTryCorrect: boolean) => void
}

/** 2×2 조각을 드래그(또는 탭-탭)로 원래 자리에 스냅해 유물을 복원한 뒤 근거를 고른다 */
export function PuzzleView({ question, onSolved }: Props) {
  const [placedPieces, setPlacedPieces] = useState<number[]>([])
  const [missed, setMissed] = useState(false)
  const [armedPiece, setArmedPiece] = useState<number | null>(null)
  const [drag, setDrag] = useState<{ piece: number; x: number; y: number } | null>(null)
  const [wrongReasons, setWrongReasons] = useState<number[]>([])
  const [hintMsg, setHintMsg] = useState<string | null>(null)
  const [restored, setRestored] = useState(false)
  const slotRefs = useRef(new Map<number, HTMLButtonElement>())
  const startPos = useRef({ x: 0, y: 0 })

  const src = iconSrc(question.artifactIcon)
  // 조각 번호 0~3 = (row, col). 트레이는 고정 섞임 순서로 보여준다
  const trayOrder = [2, 0, 3, 1].filter((p) => !placedPieces.includes(p))
  const complete = placedPieces.length === 4

  const pieceStyle = (piece: number): React.CSSProperties => {
    const row = Math.floor(piece / 2)
    const col = piece % 2
    return src
      ? {
          backgroundImage: `url(${src})`,
          backgroundSize: '200% 200%',
          backgroundPosition: `${col * 100}% ${row * 100}%`,
        }
      : {}
  }

  const tryPlace = (piece: number, slot: number) => {
    setArmedPiece(null)
    if (piece === slot) {
      audio.playSfx('snap')
      const next = [...placedPieces, piece]
      setPlacedPieces(next)
      setHintMsg(null)
      if (next.length === 4) {
        setTimeout(() => setRestored(true), 600)
      }
    } else {
      audio.playSfx('wrong')
      setMissed(true)
      setHintMsg('조각의 무늬를 잘 보고 이어지는 자리를 찾아보세요!')
    }
  }

  const onPointerDown = (piece: number) => (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    startPos.current = { x: e.clientX, y: e.clientY }
    setDrag({ piece, x: 0, y: 0 })
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag) return
    setDrag({ ...drag, x: e.clientX - startPos.current.x, y: e.clientY - startPos.current.y })
  }
  const onPointerUp = (e: React.PointerEvent) => {
    if (!drag) return
    const { piece, x, y } = drag
    setDrag(null)
    if (Math.hypot(x, y) <= 12) {
      setArmedPiece(armedPiece === piece ? null : piece)
      return
    }
    for (const [slot, el] of slotRefs.current) {
      const r = el.getBoundingClientRect()
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
        tryPlace(piece, slot)
        return
      }
    }
  }

  const pickReason = (i: number) => {
    if (i === question.reasonAnswerIndex) {
      audio.playSfx('correct')
      onSolved(!missed && wrongReasons.length === 0)
    } else if (!wrongReasons.includes(i)) {
      audio.playSfx('wrong')
      setWrongReasons([...wrongReasons, i])
      setHintMsg('설명을 다시 읽어 보세요. 상감은 "새겨 넣는" 기법이에요.')
    }
  }

  if (restored) {
    return (
      <div className="qv qv-reason">
        <div className="puzzle-restored">
          {src ? (
            <img src={src} alt={question.artifactName} className="puzzle-restored__img" />
          ) : (
            <span className="asset-fallback">{question.artifactName}</span>
          )}
          <span className="puzzle-restored__label">복원 완료!</span>
        </div>
        <PaperCard className="qv__prompt-card">
          <p className="qv__prompt">{question.reasonPrompt}</p>
        </PaperCard>
        <ChoiceList choices={question.reasonChoices} wrongPicks={wrongReasons} onPick={pickReason} />
        <HintBubble msg={hintMsg} />
      </div>
    )
  }

  return (
    <div className="qv qv-puzzle">
      <PaperCard className="qv__prompt-card">
        <p className="qv__prompt">{question.prompt}</p>
      </PaperCard>
      <div className="puzzle-wrap">
        <div className={`puzzle-board ${complete ? 'puzzle-board--complete' : ''}`}>
          {[0, 1, 2, 3].map((slot) => (
            <button
              key={slot}
              type="button"
              ref={(el) => {
                if (el) slotRefs.current.set(slot, el)
                else slotRefs.current.delete(slot)
              }}
              className={`puzzle-slot ${placedPieces.includes(slot) ? 'puzzle-slot--filled' : ''} ${armedPiece !== null ? 'puzzle-slot--target' : ''}`}
              style={placedPieces.includes(slot) ? pieceStyle(slot) : undefined}
              onClick={() => armedPiece !== null && tryPlace(armedPiece, slot)}
              aria-label={`복원판 ${Math.floor(slot / 2) + 1}행 ${(slot % 2) + 1}열`}
            />
          ))}
        </div>
        <div className="puzzle-tray">
          {trayOrder.map((piece) => (
            <button
              key={piece}
              type="button"
              className={`puzzle-piece ${armedPiece === piece ? 'puzzle-piece--armed' : ''}`}
              style={{
                ...pieceStyle(piece),
                ...(drag?.piece === piece ? { transform: `translate(${drag.x}px, ${drag.y}px)`, zIndex: 30 } : {}),
              }}
              onPointerDown={onPointerDown(piece)}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              aria-label={`청자 조각 ${piece + 1} — 끌어서 복원판에 놓기`}
            />
          ))}
        </div>
      </div>
      <p className="placement-guide">조각을 끌어 복원판의 알맞은 자리에 맞춰 보세요</p>
      <HintBubble msg={hintMsg} />
    </div>
  )
}
