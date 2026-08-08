import { useState } from 'react'
import { iconSrc } from '../../data/assets'
import type { ChoiceQuestion } from '../../types'
import { audio } from '../../utils/audio'
import { AssetImage } from '../AssetImage'
import { PaperCard } from '../common'

interface Props {
  question: ChoiceQuestion
  onSolved: (firstTryCorrect: boolean) => void
}

/** 관찰 포인트 클릭 → 힌트 카드 → 근거 선택 */
export function ChoiceView({ question, onSolved }: Props) {
  const [openHints, setOpenHints] = useState<number[]>([])
  const [wrongPicks, setWrongPicks] = useState<number[]>([])
  const [hintMsg, setHintMsg] = useState<string | null>(null)

  const pick = (i: number) => {
    if (i === question.answerIndex) {
      audio.playSfx('correct')
      onSolved(wrongPicks.length === 0)
    } else if (!wrongPicks.includes(i)) {
      audio.playSfx('wrong')
      setWrongPicks([...wrongPicks, i])
      setHintMsg(question.wrongHint ?? '다시 한번 관찰해 보세요!')
    }
  }

  return (
    <div className="qv qv-choice">
      <div className="qv-choice__left">
        {question.artifactName && (
          <div className="artifact-pedestal">
            <AssetImage
              src={iconSrc(question.artifactIcon)}
              alt={question.artifactName}
              className="artifact-pedestal__img"
              fallbackLabel={question.artifactName}
            />
            <span className="artifact-pedestal__name">{question.artifactName}</span>
          </div>
        )}
        {question.observePoints && (
          <div className="observe-points">
            {question.observePoints.map((p, i) => (
              <button
                key={p.label}
                type="button"
                className={`observe-point ${openHints.includes(i) ? 'observe-point--open' : ''}`}
                onClick={() => {
                  if (!openHints.includes(i)) setOpenHints([...openHints, i])
                }}
                aria-expanded={openHints.includes(i)}
              >
                <span className="observe-point__label">🔍 {p.label}</span>
                {openHints.includes(i) && <span className="observe-point__text">{p.text}</span>}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="qv-choice__right">
        <PaperCard className="qv__prompt-card">
          <p className="qv__prompt">{question.prompt}</p>
        </PaperCard>
        <div className="choice-list">
          {question.choices.map((c, i) => (
            <button
              key={c}
              type="button"
              className={`choice-item ${wrongPicks.includes(i) ? 'choice-item--wrong' : ''}`}
              onClick={() => pick(i)}
              disabled={wrongPicks.includes(i)}
            >
              <span className="choice-item__num">{i + 1}</span>
              <span>{c}</span>
              {wrongPicks.includes(i) && <span aria-label="오답">✕</span>}
            </button>
          ))}
        </div>
        {hintMsg && (
          <div className="hint-bubble" role="status">
            💡 {hintMsg}
          </div>
        )}
      </div>
    </div>
  )
}
