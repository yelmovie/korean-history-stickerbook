import { AssetImage } from '../components/AssetImage'
import { AppButton } from '../components/common'
import { bgSrc, iconSrc, SCREEN_BG, A } from '../data/assets'
import { questionsForStage } from '../data/questions'
import { STAGES } from '../data/stages'
import { useGame } from '../game/GameContext'

/** 순차 해금: 이전 스테이지를 완료해야 다음이 열린다. ?unlock=all 로 교사용 전체 해금 */
const devUnlockAll = new URLSearchParams(location.search).get('unlock') === 'all'

export function StageSelectPage() {
  const { save, goTo } = useGame()
  const allDone = STAGES.every((s) => save.completedStages.includes(s.id))
  const unlockAll = devUnlockAll || save.settings.unlockAll

  return (
    <div className="screen stage-select">
      <img src={bgSrc(SCREEN_BG.stageSelect)} alt="" className="screen__bg" />
      <div className="screen__content">
        <header className="stage-select__header">
          <AppButton variant="ghost" onClick={() => goTo('main')} ariaLabel="메인 화면으로">
            ← 메인
          </AppButton>
          <h1 className="stage-header__title">탐험 스테이지 선택</h1>
          <p className="stage-header__subtitle">선사 → 삼국 → 고려 → 조선 → 근현대 순서로 시간여행을 떠나요</p>
        </header>
        <main className="stage-select__cards">
          {STAGES.map((stage, idx) => {
            const done = save.completedStages.includes(stage.id)
            const locked = !unlockAll && idx > 0 && !save.completedStages.includes(STAGES[idx - 1].id)
            const total = questionsForStage(stage.id).length
            const earned = questionsForStage(stage.id).filter((q) =>
              save.earnedStickers.includes(q.rewardStickerId),
            ).length
            return (
              <button
                key={stage.id}
                type="button"
                className={`stage-card ${locked ? 'stage-card--locked' : ''} ${done ? 'stage-card--done' : ''}`}
                onClick={() => !locked && goTo(stage.id)}
                disabled={locked}
                aria-label={
                  locked ? `${stage.title} (이전 시대를 완료하면 열려요)` : `${stage.title} 입장 — 스티커 ${earned}/${total}`
                }
              >
                <span className="stage-card__order">{stage.order}</span>
                <AssetImage src={iconSrc(stage.badge)} alt="" className="stage-card__badge" fallbackLabel={stage.periodLabel} />
                <span className="stage-card__period">{stage.periodLabel}</span>
                <span className="stage-card__title">{stage.title}</span>
                <span className="stage-card__count">
                  {locked ? '🔒 이전 시대 완료 시 해금' : `스티커 ${earned}/${total}`}
                </span>
                {done && (
                  <span className="stage-card__stamp" aria-label="완료 도장">
                    <AssetImage src={iconSrc(A.stamp)} alt="완료" className="stage-card__stamp-img" fallbackLabel="완료" />
                  </span>
                )}
              </button>
            )
          })}
        </main>
        <footer className="stage-select__footer">
          <AppButton
            variant="secondary"
            onClick={() => goTo('diaryEdit')}
            disabled={save.earnedStickers.length === 0}
          >
            📖 다이어리 꾸미기 ({save.earnedStickers.length})
          </AppButton>
          {allDone && <AppButton onClick={() => goTo('completion')}>🏆 최종 결과 보기</AppButton>}
        </footer>
      </div>
    </div>
  )
}
