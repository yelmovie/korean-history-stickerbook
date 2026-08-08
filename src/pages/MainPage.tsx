import { useState } from 'react'
import { AssetImage } from '../components/AssetImage'
import { AppButton, Modal } from '../components/common'
import { A, bgSrc, iconSrc, SCREEN_BG } from '../data/assets'
import { useGame } from '../game/GameContext'
import { audio } from '../utils/audio'

export function MainPage() {
  const { goTo, hasSave, corrupted, save, update, resetAll } = useGame()
  const [showCorrupted, setShowCorrupted] = useState(corrupted)
  const [confirmRestart, setConfirmRestart] = useState(false)
  const [muted, setMuted] = useState(audio.muted)

  const canContinue = hasSave && (save.earnedStickers.length > 0 || save.completedStages.length > 0)

  const startNew = () => {
    if (canContinue) {
      setConfirmRestart(true)
    } else {
      goTo('stageSelect')
    }
  }

  return (
    <div className="screen main-page">
      <img src={bgSrc(SCREEN_BG.main)} alt="" className="screen__bg" />
      <div className="screen__content">
        <header className="main-page__title-area">
          <AssetImage src={iconSrc(A.logo)} alt="한국사 스티커북" className="main-page__logo" />
          <p className="main-page__subtitle">— 시간여행 다이어리 —</p>
          <p className="main-page__tagline">유물의 모양, 쓰임, 발견 장소를 근거로 역사 스티커를 모아 보세요!</p>
        </header>
        <div className="main-page__scene" aria-hidden="true">
          <AssetImage src={iconSrc(A.boyExplorer)} alt="" className="main-page__character" />
          <AssetImage src={iconSrc(A.portal)} alt="" className="main-page__portal" />
          <AssetImage src={iconSrc(A.treasureChest)} alt="" className="main-page__chest" />
        </div>
        <nav className="main-page__buttons">
          <AppButton onClick={startNew}>시작하기</AppButton>
          {canContinue && (
            <AppButton variant="secondary" onClick={() => goTo('stageSelect')}>
              이어하기
            </AppButton>
          )}
          <AppButton
            variant="ghost"
            onClick={() => goTo('diaryShow')}
            disabled={save.earnedStickers.length === 0}
          >
            스티커북 보기
          </AppButton>
          <AppButton
            variant="ghost"
            ariaLabel={muted ? '소리 켜기' : '소리 끄기'}
            onClick={() => {
              const next = !muted
              audio.setMuted(next)
              setMuted(next)
              update((d) => ({ ...d, settings: { ...d.settings, muted: next } }))
            }}
          >
            {muted ? '🔇' : '🔊'}
          </AppButton>
        </nav>
      </div>
      <Modal open={confirmRestart} onClose={() => setConfirmRestart(false)}>
        <div className="stage-complete">
          <h2>처음부터 다시 시작할까요?</h2>
          <p>지금까지 모은 스티커와 다이어리가 모두 사라져요.</p>
          <div className="stage-complete__actions">
            <AppButton
              onClick={() => {
                resetAll()
                setConfirmRestart(false)
                goTo('stageSelect')
              }}
            >
              네, 새로 시작할래요
            </AppButton>
            <AppButton variant="secondary" onClick={() => setConfirmRestart(false)}>
              아니요
            </AppButton>
          </div>
        </div>
      </Modal>
      <Modal open={showCorrupted} onClose={() => setShowCorrupted(false)}>
        <div className="stage-complete">
          <h2>저장 데이터를 새로 시작해요</h2>
          <p>
            이전 저장 데이터를 읽을 수 없어서 안전하게 처음 상태로 되돌렸어요.
            <br />
            새로운 탐험을 시작해 보세요!
          </p>
          <AppButton onClick={() => setShowCorrupted(false)}>알겠어요</AppButton>
        </div>
      </Modal>
    </div>
  )
}
