import { useState } from 'react'
import { AssetImage } from '../components/AssetImage'
import { AppButton, Modal } from '../components/common'
import { ChoiceView } from '../components/questions/ChoiceView'
import { FillView } from '../components/questions/FillView'
import { MatchView } from '../components/questions/MatchView'
import { OrderingView } from '../components/questions/OrderingView'
import { PlacementView } from '../components/questions/PlacementView'
import { PuzzleView } from '../components/questions/PuzzleView'
import { StageHeader } from '../components/StageHeader'
import { StickerReward } from '../components/StickerReward'
import { bgSrc, iconSrc, SCREEN_BG } from '../data/assets'
import { questionsForStage } from '../data/questions'
import { stageById } from '../data/stages'
import { stickerById } from '../data/stickers'
import { useGame } from '../game/GameContext'
import type { Question, StageId } from '../types'

interface Props {
  stageId: StageId
}

/** 모든 스테이지의 공통 엔진: 문제 순서 진행 + 보상 + 완료 처리.
 *  스테이지별 차이(배경·캐릭터·문항·상호작용)는 데이터와 문항 유형이 결정한다. */
export function StagePage({ stageId }: Props) {
  const { save, update, goTo } = useGame()
  const stage = stageById.get(stageId)!
  const questions = questionsForStage(stageId)
  const [index, setIndex] = useState(0)
  const [reward, setReward] = useState<Question | null>(null)
  const [finished, setFinished] = useState(false)
  /** 이번 도전에서 첫 시도에 맞힌 문항 수 (재도전 최고 기록용) */
  const [runCorrect, setRunCorrect] = useState(0)

  const question = questions[index]

  const handleSolved = (q: Question) => (firstTryCorrect: boolean) => {
    if (firstTryCorrect) setRunCorrect((n) => n + 1)
    update((draft) => ({
      ...draft,
      earnedStickers: draft.earnedStickers.includes(q.rewardStickerId)
        ? draft.earnedStickers
        : [...draft.earnedStickers, q.rewardStickerId],
      questionResults: { ...draft.questionResults, [q.id]: draft.questionResults[q.id] ?? firstTryCorrect },
    }))
    setReward(q)
  }

  const nextQuestion = () => {
    setReward(null)
    if (index + 1 < questions.length) {
      setIndex(index + 1)
    } else {
      update((draft) => ({
        ...draft,
        completedStages: draft.completedStages.includes(stageId)
          ? draft.completedStages
          : [...draft.completedStages, stageId],
        bestRuns: { ...draft.bestRuns, [stageId]: Math.max(draft.bestRuns[stageId] ?? 0, runCorrect) },
      }))
      setFinished(true)
    }
  }

  return (
    <div className="screen">
      <img src={bgSrc(SCREEN_BG[stageId])} alt="" className="screen__bg" />
      <div className="screen__content">
        <StageHeader
          title={stage.title}
          subtitle={`${index + 1}단계 · ${stage.subtitle}`}
          current={index}
          total={questions.length}
          onBack={() => goTo('stageSelect')}
        />
        <main className="stage-body">
          {question && (
            <>
              {question.type === 'choice' && (
                <ChoiceView key={question.id} question={question} onSolved={handleSolved(question)} />
              )}
              {question.type === 'placement' && (
                <PlacementView key={question.id} question={question} onSolved={handleSolved(question)} />
              )}
              {question.type === 'match' && (
                <MatchView key={question.id} question={question} onSolved={handleSolved(question)} />
              )}
              {question.type === 'ordering' && (
                <OrderingView key={question.id} question={question} onSolved={handleSolved(question)} />
              )}
              {question.type === 'puzzle' && (
                <PuzzleView key={question.id} question={question} onSolved={handleSolved(question)} />
              )}
              {question.type === 'fill' && (
                <FillView key={question.id} question={question} onSolved={handleSolved(question)} />
              )}
            </>
          )}
        </main>
        <div className="stage-deco" aria-hidden="true">
          <AssetImage src={iconSrc(stage.character)} alt="" className="stage-deco__character" />
          <AssetImage src={iconSrc(stage.mascot)} alt="" className="stage-deco__mascot" />
        </div>
      </div>
      {reward && (
        <StickerReward
          sticker={stickerById.get(reward.rewardStickerId)!}
          explanation={reward.explanation}
          onDone={nextQuestion}
        />
      )}
      <Modal open={finished}>
        <div className="stage-complete">
          <AssetImage src={iconSrc(stage.badge)} alt={`${stage.title} 완료 배지`} className="stage-complete__badge" />
          <h2>{stage.title} 탐험 완료!</h2>
          <p>
            첫 시도 정답 {runCorrect}/{questions.length}
            {(save.bestRuns[stageId] ?? 0) <= runCorrect ? ' — 최고 기록!' : ` (최고 기록 ${save.bestRuns[stageId]}/${questions.length})`}
            <br />
            모은 스티커는 역사 다이어리에 붙일 수 있어요.
          </p>
          <div className="stage-complete__actions">
            <AppButton onClick={() => goTo('stageSelect')}>스테이지 선택으로</AppButton>
            <AppButton variant="secondary" onClick={() => goTo('diaryEdit')}>
              다이어리 꾸미기
            </AppButton>
          </div>
        </div>
      </Modal>
    </div>
  )
}
