import { useState } from 'react'
import { AssetImage } from '../components/AssetImage'
import { AppButton, Modal } from '../components/common'
import { SettingsPanel } from '../components/SettingsPanel'
import { A, bgSrc, iconSrc, SCREEN_BG } from '../data/assets'
import { useGame } from '../game/GameContext'
import { audio } from '../utils/audio'

export function MainPage() {
  const { goTo, hasSave, corrupted, save, update } = useGame()
  const [showCorrupted, setShowCorrupted] = useState(corrupted)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const canContinue = hasSave && (save.earnedStickers.length > 0 || save.completedStages.length > 0)
  const muted = save.settings.muted

  return (
    <div className="screen main-page">
      <img src={bgSrc(SCREEN_BG.main)} alt="" className="screen__bg" />
      <div className="screen__content">
        <div className="top-right-icons">
          <button
            type="button"
            className="icon-btn"
            aria-label={muted ? '소리 켜기' : '소리 끄기'}
            onClick={() => {
              const next = !muted
              audio.setMuted(next)
              update((d) => ({ ...d, settings: { ...d.settings, muted: next } }))
            }}
          >
            {muted ? '✕' : '♪'}
          </button>
          <button type="button" className="icon-btn" aria-label="설정 열기" onClick={() => setSettingsOpen(true)}>
            ⚙
          </button>
        </div>
        <header className="main-page__title-area">
          <AssetImage src={iconSrc(A.logo)} alt="한국사 스티커북" className="main-page__logo" />
          <p className="main-page__subtitle">— 시간여행 다이어리 —</p>
        </header>
        <div className="main-page__scene" aria-hidden="true">
          <AssetImage src={iconSrc(A.boyExplorer)} alt="" className="main-page__character" />
          <AssetImage src={iconSrc(A.treasureChest)} alt="" className="main-page__chest" />
        </div>
        <nav className="main-page__buttons">
          <AppButton onClick={() => goTo('stageSelect')}>시작하기</AppButton>
          {canContinue && (
            <AppButton variant="secondary" className="pulse-btn" onClick={() => goTo('stageSelect')}>
              이어하기
            </AppButton>
          )}
          <AppButton variant="ghost" onClick={() => goTo('diaryShow')} disabled={save.earnedStickers.length === 0}>
            스티커북 보기
          </AppButton>
        </nav>
      </div>
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
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
