import { useEffect, useRef, useState } from 'react'
import { iconSrc } from '../data/assets'
import { audio } from '../utils/audio'
import { AssetImage } from './AssetImage'

interface Props {
  /** 캐릭터 아이콘 id */
  icon: string
  /** 누를 때마다 순서대로 나오는 대사 */
  lines: string[]
  /** 말풍선이 캐릭터의 어느 쪽에 붙는지 */
  side?: 'left' | 'right'
  className?: string
  name?: string
}

const TYPE_SPEED_MS = 45
const HOLD_AFTER_TYPING_MS = 2600

/** 누르면 말풍선에 대사가 한 글자씩 타이핑되고, 다 읽을 즈음 사라진다.
 *  다시 누르면 다음 대사로 넘어간다. */
export function CharacterTalk({ icon, lines, side = 'left', className, name }: Props) {
  const [index, setIndex] = useState(0)
  const [typed, setTyped] = useState('')
  const [open, setOpen] = useState(false)
  const timers = useRef<number[]>([])

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }

  useEffect(() => clearTimers, [])

  const talk = () => {
    if (lines.length === 0) return
    clearTimers()
    const line = lines[index % lines.length]
    setIndex((i) => i + 1)
    setTyped('')
    setOpen(true)
    audio.playSfx('page')
    // 한 글자씩 타이핑
    for (let i = 1; i <= line.length; i += 1) {
      timers.current.push(window.setTimeout(() => setTyped(line.slice(0, i)), i * TYPE_SPEED_MS))
    }
    // 다 쓰고 잠시 뒤 사라짐
    timers.current.push(
      window.setTimeout(() => setOpen(false), line.length * TYPE_SPEED_MS + HOLD_AFTER_TYPING_MS),
    )
  }

  return (
    <div className={`char-talk char-talk--${side} ${className ?? ''}`}>
      {open && (
        <div className="char-talk__bubble" role="status">
          {typed}
          <span className="char-talk__caret" aria-hidden="true" />
        </div>
      )}
      <button
        type="button"
        className="char-talk__btn"
        onClick={talk}
        aria-label={name ? `${name}에게 말 걸기` : '캐릭터에게 말 걸기'}
      >
        <AssetImage src={iconSrc(icon)} alt="" className="char-talk__img" />
      </button>
    </div>
  )
}
