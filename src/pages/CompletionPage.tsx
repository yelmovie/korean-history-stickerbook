import { useState } from 'react'
import { AssetImage } from '../components/AssetImage'
import { AppButton, Modal, PaperCard } from '../components/common'
import { bgSrc, iconSrc, SCREEN_BG, A } from '../data/assets'
import { QUESTIONS } from '../data/questions'
import { STAGES } from '../data/stages'
import { STICKERS } from '../data/stickers'
import { useGame } from '../game/GameContext'

/** 완료 스테이지 수에 따른 칭호 */
function titleFor(completed: number, diaryNotes: number): string {
  if (completed >= 5 && diaryNotes >= 3) return '어린이 역사 큐레이터'
  if (completed >= 5) return '근현대 기록가'
  if (completed >= 4) return '조선 발명 연구원'
  if (completed >= 3) return '보물 복원가'
  if (completed >= 2) return '문화유산 탐험가'
  return '시대 탐정'
}

export function CompletionPage() {
  const { save, goTo, resetAll } = useGame()
  const [confirmReset, setConfirmReset] = useState(false)

  const answered = Object.values(save.questionResults)
  const correctRate = answered.length > 0 ? Math.round((answered.filter(Boolean).length / answered.length) * 100) : 0
  const diaryNotes = Object.values(save.diary).filter((p) => p.note.trim().length > 0).length
  const title = titleFor(save.completedStages.length, diaryNotes)

  return (
    <div className="screen completion">
      <img src={bgSrc(SCREEN_BG.completion)} alt="" className="screen__bg" />
      <div className="screen__content completion__content">
        <AssetImage src={iconSrc(A.curatorLogo)} alt="어린이 역사 큐레이터" className="completion__logo" />
        <PaperCard className="completion__cert">
          <p className="completion__cert-head">수료증</p>
          <h1 className="completion__title">🏅 {title}</h1>
          <p className="completion__desc">한국사 시간여행을 훌륭하게 마쳤음을 확인합니다.</p>
          <div className="completion__stats">
            <div className="completion__stat">
              <span className="completion__stat-num">
                {save.earnedStickers.length}/{STICKERS.length}
              </span>
              <span className="completion__stat-label">모은 스티커</span>
            </div>
            <div className="completion__stat">
              <span className="completion__stat-num">
                {save.completedStages.length}/{STAGES.length}
              </span>
              <span className="completion__stat-label">완료한 시대</span>
            </div>
            <div className="completion__stat">
              <span className="completion__stat-num">{correctRate}%</span>
              <span className="completion__stat-label">
                첫 도전 정답률 ({answered.length}/{QUESTIONS.length}문제)
              </span>
            </div>
            <div className="completion__stat">
              <span className="completion__stat-num">{diaryNotes}/5</span>
              <span className="completion__stat-label">다이어리 한 줄 설명</span>
            </div>
          </div>
          <div className="completion__seal" aria-hidden="true">
            <AssetImage src={iconSrc(A.stamp)} alt="" className="completion__seal-img" />
          </div>
        </PaperCard>
        <div className="completion__actions">
          <AppButton onClick={() => goTo('diaryShow')}>내 다이어리 다시 보기</AppButton>
          <AppButton variant="secondary" onClick={() => goTo('main')}>
            처음으로
          </AppButton>
          <AppButton variant="ghost" onClick={() => setConfirmReset(true)}>
            기록 초기화
          </AppButton>
        </div>
      </div>
      <Modal open={confirmReset} onClose={() => setConfirmReset(false)}>
        <div className="stage-complete">
          <h2>정말 처음부터 다시 시작할까요?</h2>
          <p>모든 스티커와 다이어리, 진행 기록이 사라져요. 되돌릴 수 없어요.</p>
          <div className="stage-complete__actions">
            <AppButton onClick={resetAll}>네, 초기화할게요</AppButton>
            <AppButton variant="secondary" onClick={() => setConfirmReset(false)}>
              아니요
            </AppButton>
          </div>
        </div>
      </Modal>
    </div>
  )
}
