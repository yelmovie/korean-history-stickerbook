import { useState } from 'react'
import { iconSrc } from '../../data/assets'
import type { FillQuestion } from '../../types'
import { audio } from '../../utils/audio'
import { AssetImage } from '../AssetImage'
import { PaperCard } from '../common'

interface Props {
  question: FillQuestion
  onSolved: (firstTryCorrect: boolean) => void
}

/** 빈칸 채우기: 낱말 칩을 눌러 문장을 완성한다 */
export function FillView({ question, onSolved }: Props) {
  const [wrongPicks, setWrongPicks] = useState<number[]>([])
  const [filled, setFilled] = useState<number | null>(null)
  const [hintMsg, setHintMsg] = useState<string | null>(null)

  const pick = (i: number) => {
    if (filled !== null) return
    if (i === question.answerIndex) {
      audio.playSfx('snap')
      setFilled(i)
      setHintMsg(null)
      setTimeout(() => {
        audio.playSfx('correct')
        onSolved(wrongPicks.length === 0)
      }, 800)
    } else if (!wrongPicks.includes(i)) {
      audio.playSfx('wrong')
      setWrongPicks([...wrongPicks, i])
      setHintMsg(question.wrongHint ?? '문장을 다시 읽고 어울리는 말을 찾아보세요!')
    }
  }

  return (
    <div className="qv qv-fill">
      {question.artifactName && (
        <div className="artifact-pedestal artifact-pedestal--small">
          <AssetImage
            src={iconSrc(question.artifactIcon)}
            alt={question.artifactName}
            className="artifact-pedestal__img"
            fallbackLabel={question.artifactName}
          />
          <span className="artifact-pedestal__name">{question.artifactName}</span>
        </div>
      )}
      <PaperCard className="qv__prompt-card">
        <p className="qv__prompt">{question.prompt}</p>
      </PaperCard>
      <PaperCard className="fill-sentence-card">
        <p className="fill-sentence">
          {question.textBefore}
          <span className={`fill-blank ${filled !== null ? 'fill-blank--filled' : ''}`}>
            {filled !== null ? question.chips[filled] : ''}
          </span>
          {question.textAfter}
        </p>
      </PaperCard>
      <div className="fill-chips">
        {question.chips.map((c, i) => (
          <button
            key={c}
            type="button"
            className={`fill-chip ${wrongPicks.includes(i) ? 'fill-chip--wrong' : ''} ${filled === i ? 'fill-chip--used' : ''}`}
            onClick={() => pick(i)}
            disabled={wrongPicks.includes(i) || filled !== null}
          >
            {c}
          </button>
        ))}
      </div>
      <p className="placement-guide">알맞은 낱말 카드를 눌러 빈칸을 채워 보세요</p>
      {hintMsg && (
        <div className="hint-bubble" role="status">
          💡 {hintMsg}
        </div>
      )}
    </div>
  )
}
