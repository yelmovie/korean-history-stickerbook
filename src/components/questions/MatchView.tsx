import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { iconSrc } from '../../data/assets'
import type { MatchQuestion } from '../../types'
import { audio } from '../../utils/audio'
import { derange } from '../../utils/shuffle'
import { AssetImage } from '../AssetImage'
import { PaperCard } from '../common'
import { HintBubble } from './shared'

interface Props {
  question: MatchQuestion
  onSolved: (firstTryCorrect: boolean) => void
}

interface Line {
  x1: number
  y1: number
  x2: number
  y2: number
}

/** 선잇기: 왼쪽 점을 끌어 오른쪽 점에 놓거나, 왼쪽→오른쪽 순서로 눌러 잇는다 */
export function MatchView({ question, onSolved }: Props) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [links, setLinks] = useState<Record<string, string>>({})
  const [missed, setMissed] = useState(false)
  const [hintMsg, setHintMsg] = useState<string | null>(null)
  const [lines, setLines] = useState<Line[]>([])
  /** 끌고 있는 중인 임시 선 */
  const [dragLine, setDragLine] = useState<Line | null>(null)
  const dragFrom = useRef<string | null>(null)
  const areaRef = useRef<HTMLDivElement>(null)
  const leftRefs = useRef(new Map<string, HTMLButtonElement>())
  const rightRefs = useRef(new Map<string, HTMLButtonElement>())
  // 데이터는 정답 짝 순서로 적혀 있어 그대로 두면 선이 一자 세 줄이 된다 → 오른쪽만 어긋나게 섞는다
  const rightItems = useMemo(() => derange(question.right, question.id), [question])

  const recalcLines = (current: Record<string, string>) => {
    const area = areaRef.current
    if (!area) return
    const ar = area.getBoundingClientRect()
    const next: Line[] = []
    for (const [l, r] of Object.entries(current)) {
      const le = leftRefs.current.get(l)
      const re = rightRefs.current.get(r)
      if (!le || !re) continue
      const lr = le.getBoundingClientRect()
      const rr = re.getBoundingClientRect()
      next.push({
        x1: lr.right - ar.left,
        y1: lr.top + lr.height / 2 - ar.top,
        x2: rr.left - ar.left,
        y2: rr.top + rr.height / 2 - ar.top,
      })
    }
    setLines(next)
  }

  useLayoutEffect(() => {
    recalcLines(links)
    const onResize = () => recalcLines(links)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [links])

  const connect = (leftId: string, rightId: string) => {
    if (question.pairs[leftId] === rightId) {
      audio.playSfx('snap')
      const next = { ...links, [leftId]: rightId }
      setLinks(next)
      setSelectedLeft(null)
      setHintMsg(null)
      if (Object.keys(next).length === question.left.length) {
        audio.playSfx('correct')
        setTimeout(() => onSolved(!missed), 700)
      }
    } else {
      audio.playSfx('wrong')
      setMissed(true)
      setHintMsg('그 짝이 아니에요. 쓰임을 다시 생각해 보세요!')
    }
  }

  const clickRight = (rightId: string) => {
    if (!selectedLeft) {
      setHintMsg('왼쪽 카드를 먼저 누르거나, 왼쪽 점을 끌어서 이어 주세요!')
      return
    }
    connect(selectedLeft, rightId)
  }

  /* ---- 드래그로 잇기 ---- */

  const startDrag = (leftId: string) => (e: React.PointerEvent<HTMLButtonElement>) => {
    if (leftId in links) return
    e.currentTarget.setPointerCapture(e.pointerId)
    dragFrom.current = leftId
    setSelectedLeft(leftId)
    const area = areaRef.current!.getBoundingClientRect()
    const from = e.currentTarget.getBoundingClientRect()
    setDragLine({
      x1: from.right - area.left,
      y1: from.top + from.height / 2 - area.top,
      x2: e.clientX - area.left,
      y2: e.clientY - area.top,
    })
  }

  const moveDrag = (e: React.PointerEvent) => {
    if (!dragFrom.current) return
    const area = areaRef.current!.getBoundingClientRect()
    setDragLine((d) => (d ? { ...d, x2: e.clientX - area.left, y2: e.clientY - area.top } : d))
  }

  const endDrag = (e: React.PointerEvent) => {
    const leftId = dragFrom.current
    dragFrom.current = null
    setDragLine(null)
    if (!leftId) return
    for (const [rightId, el] of rightRefs.current) {
      const r = el.getBoundingClientRect()
      // 점까지 포함해 넉넉히 판정
      if (e.clientX >= r.left - 30 && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
        connect(leftId, rightId)
        return
      }
    }
  }

  return (
    <div className="qv qv-match">
      <PaperCard className="qv__prompt-card">
        <p className="qv__prompt">{question.prompt}</p>
      </PaperCard>
      <div className="match-area" ref={areaRef}>
        <svg className="match-lines" aria-hidden="true">
          {lines.map((l, i) => (
            <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
          ))}
          {dragLine && (
            <line
              className="match-lines__drag"
              x1={dragLine.x1}
              y1={dragLine.y1}
              x2={dragLine.x2}
              y2={dragLine.y2}
            />
          )}
        </svg>
        <div className="match-col">
          {question.left.map((item) => {
            const done = item.id in links
            return (
              <button
                key={item.id}
                type="button"
                ref={(el) => {
                  if (el) leftRefs.current.set(item.id, el)
                  else leftRefs.current.delete(item.id)
                }}
                className={`match-item ${selectedLeft === item.id ? 'match-item--selected' : ''} ${done ? 'match-item--done' : ''}`}
                onClick={() => !done && setSelectedLeft(selectedLeft === item.id ? null : item.id)}
                onPointerDown={startDrag(item.id)}
                onPointerMove={moveDrag}
                onPointerUp={endDrag}
                onPointerCancel={() => {
                  dragFrom.current = null
                  setDragLine(null)
                }}
                disabled={done}
              >
                {item.icon && (
                  <AssetImage src={iconSrc(item.icon)} alt="" className="match-item__icon" fallbackLabel={item.label} />
                )}
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
        <div className="match-col">
          {rightItems.map((item) => {
            const done = Object.values(links).includes(item.id)
            return (
              <button
                key={item.id}
                type="button"
                ref={(el) => {
                  if (el) rightRefs.current.set(item.id, el)
                  else rightRefs.current.delete(item.id)
                }}
                className={`match-item match-item--right ${done ? 'match-item--done' : ''}`}
                onClick={() => clickRight(item.id)}
                disabled={done}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </div>
      <p className="placement-guide">왼쪽 점을 끌어 오른쪽 점에 놓아 보세요 (눌러서 잇기도 돼요)</p>
      <HintBubble msg={hintMsg} />
    </div>
  )
}
