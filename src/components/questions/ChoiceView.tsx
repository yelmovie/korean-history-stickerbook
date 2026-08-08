import { useState } from 'react'
import { iconSrc, photoSrc, PHOTO_CREDIT } from '../../data/assets'
import type { ChoiceQuestion } from '../../types'
import { audio } from '../../utils/audio'
import { AssetImage } from '../AssetImage'
import { PaperCard } from '../common'
import { ScratchReveal } from './ScratchReveal'
import { ChoiceList, HintBubble } from './shared'

interface Props {
  question: ChoiceQuestion
  onSolved: (firstTryCorrect: boolean) => void
}

/** (발굴→) 관찰 포인트 뒤집기 → 힌트 확인 → 근거 선택. 유물은 눌러서 확대 관찰 가능 */
export function ChoiceView({ question, onSolved }: Props) {
  const [openHints, setOpenHints] = useState<number[]>([])
  const [wrongPicks, setWrongPicks] = useState<number[]>([])
  const [hintMsg, setHintMsg] = useState<string | null>(null)
  // 오답 2회부터: 근거를 다시 확인해야 계속 고를 수 있다 (아무거나 누르기 방지)
  const [needReview, setNeedReview] = useState(false)
  // 발굴형이면 흙을 문질러 유물을 드러낸 뒤에 선택지가 열린다
  const [revealed, setRevealed] = useState(!question.excavate)
  const [zoomed, setZoomed] = useState(false)

  const pick = (i: number) => {
    if (i === question.answerIndex) {
      audio.playSfx('correct')
      onSolved(wrongPicks.length === 0)
    } else if (!wrongPicks.includes(i)) {
      audio.playSfx('wrong')
      const next = [...wrongPicks, i]
      setWrongPicks(next)
      if (next.length >= 2) {
        setNeedReview(true)
        setHintMsg('두 번 틀렸어요. 아래 "근거 다시 보기"를 누르고 천천히 다시 생각해 보세요.')
      } else {
        setHintMsg(question.wrongHint ?? '다시 한번 관찰해 보세요!')
      }
    }
  }

  const reviewEvidence = () => {
    if (question.observePoints) setOpenHints(question.observePoints.map((_, i) => i))
    setNeedReview(false)
    setHintMsg(
      question.observePoints
        ? '관찰 포인트가 모두 열렸어요. 재료·모양·쓰임을 근거로 골라 보세요.'
        : '문제를 소리 내어 다시 읽고, 남은 선택지를 근거와 비교해 보세요.',
    )
  }

  // 실물 사진이 있으면 AI 일러스트 대신 실물 사진으로 관찰한다 (공공누리 원본 우선 원칙)
  const realPhoto = photoSrc(question.artifactPhoto)
  const artifactBody = realPhoto ? (
    <span className="artifact-photo-frame">
      <AssetImage src={realPhoto} alt={question.artifactName ?? ''} className="artifact-photo" fallbackLabel={question.artifactName} />
      <span className="artifact-photo-credit">{PHOTO_CREDIT}</span>
    </span>
  ) : (
    <AssetImage
      src={iconSrc(question.artifactIcon)}
      alt={question.artifactName ?? ''}
      className="artifact-pedestal__img"
      fallbackLabel={question.artifactName}
    />
  )

  return (
    <div className="qv qv-choice">
      <div className="qv-choice__left">
        {question.artifactName && (
          <button
            type="button"
            className={`artifact-pedestal ${zoomed ? 'artifact-pedestal--zoomed' : ''}`}
            onClick={() => revealed && setZoomed(!zoomed)}
            aria-label={zoomed ? `${question.artifactName} 축소하기` : `${question.artifactName} 확대해서 관찰하기`}
          >
            {question.excavate && !revealed ? (
              <ScratchReveal onRevealed={() => setRevealed(true)}>{artifactBody}</ScratchReveal>
            ) : (
              artifactBody
            )}
            <span className="artifact-pedestal__name">
              {revealed ? `${question.artifactName} ${zoomed ? '➖' : '🔍'}` : '❓ 발굴 중...'}
            </span>
          </button>
        )}
        {revealed && question.observePoints && (
          <div className="observe-points">
            {question.observePoints.map((p, i) => {
              const open = openHints.includes(i)
              return (
                <button
                  key={p.label}
                  type="button"
                  className={`flip-card ${open ? 'flip-card--open' : ''}`}
                  onClick={() => {
                    if (!open) {
                      audio.playSfx('page')
                      setOpenHints([...openHints, i])
                    }
                  }}
                  aria-expanded={open}
                  aria-label={`관찰 포인트: ${p.label}`}
                >
                  <span className="flip-card__inner">
                    <span className="flip-card__front">🔍 {p.label}</span>
                    <span className="flip-card__back">{p.text}</span>
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>
      <div className="qv-choice__right">
        <PaperCard className="qv__prompt-card">
          <p className="qv__prompt">{question.prompt}</p>
        </PaperCard>
        {!revealed ? (
          <div className="hint-bubble" role="status">
            🖌️ 먼저 흙을 문질러 유물을 발굴해 보세요!
          </div>
        ) : (
          <>
            <ChoiceList choices={question.choices} wrongPicks={wrongPicks} onPick={pick} disabled={needReview} />
            {needReview && (
              <button type="button" className="review-gate" onClick={reviewEvidence}>
                🔍 근거 다시 보기
              </button>
            )}
            <HintBubble msg={hintMsg} />
          </>
        )}
      </div>
    </div>
  )
}
