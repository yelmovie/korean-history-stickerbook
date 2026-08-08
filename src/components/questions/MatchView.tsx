import { useLayoutEffect, useRef, useState } from 'react'
import { iconSrc } from '../../data/assets'
import type { MatchQuestion } from '../../types'
import { audio } from '../../utils/audio'
import { AssetImage } from '../AssetImage'
import { PaperCard } from '../common'

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

/** 선잇기: 왼쪽 항목을 누른 뒤 오른쪽 항목을 누르면 SVG 선으로 연결된다 */
export function MatchView({ question, onSolved }: Props) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [links, setLinks] = useState<Record<string, string>>({})
  const [missed, setMissed] = useState(false)
  const [hintMsg, setHintMsg] = useState<string | null>(null)
  const [lines, setLines] = useState<Line[]>([])
  const areaRef = useRef<HTMLDivElement>(null)
  const leftRefs = useRef(new Map<string, HTMLButtonElement>())
  const rightRefs = useRef(new Map<string, HTMLButtonElement>())

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

  const clickRight = (rightId: string) => {
    if (!selectedLeft) return
    if (question.pairs[selectedLeft] === rightId) {
      audio.playSfx('snap')
      const next = { ...links, [selectedLeft]: rightId }
      setLinks(next)
      setSelectedLeft(null)
      setHintMsg(null)
      if (Object.keys(next).length === question.left.length) {
        audio.playSfx('correct')
        // 연결 완료 화면을 잠깐 보여준 뒤 완료 처리
        setTimeout(() => onSolved(!missed), 700)
      }
    } else {
      audio.playSfx('wrong')
      setMissed(true)
      setHintMsg('그 짝이 아니에요. 쓰임을 다시 생각해 보세요!')
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
          {question.right.map((item) => {
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
                disabled={done || !selectedLeft}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </div>
      <p className="placement-guide">왼쪽을 누르고, 알맞은 오른쪽 짝을 눌러 이어 보세요</p>
      {hintMsg && (
        <div className="hint-bubble" role="status">
          💡 {hintMsg}
        </div>
      )}
    </div>
  )
}
