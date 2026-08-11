import { useState } from 'react'
import { AssetImage } from '../components/AssetImage'
import { CharacterTalk } from '../components/CharacterTalk'
import { AppButton } from '../components/common'
import { bgSrc, iconSrc, SCREEN_BG, A } from '../data/assets'
import { PERIOD_LABELS } from '../data/stages'
import { stickerById } from '../data/stickers'
import { SHOWCASE_LINES } from '../data/lines'
import { useGame } from '../game/GameContext'
import type { PeriodId } from '../types'
import { audio } from '../utils/audio'

const PERIOD_ORDER: PeriodId[] = ['prehistoric', 'threeKingdoms', 'goryeo', 'joseon', 'modern']

/** 완성된 다이어리를 발표 모드로 보여준다. 페이지 넘기기 + 발표 문장 템플릿 */
export function DiaryShowcasePage() {
  const { save, goTo } = useGame()
  /* 항상 선사부터 열면, 근현대만 꾸민 학생에게는 빈 페이지가 떠서
   * 꾸민 것이 저장되지 않은 줄 안다. 스티커가 있는 첫 페이지에서 시작한다. */
  const [pageIdx, setPageIdx] = useState(() => {
    const i = PERIOD_ORDER.findIndex((p) => save.diary[p]?.stickers.length > 0)
    return i === -1 ? 0 : i
  })
  const period = PERIOD_ORDER[pageIdx]
  const page = save.diary[period]
  const firstSticker = page.stickers.length > 0 ? stickerById.get(page.stickers[0].stickerId) : undefined

  const turn = (dir: number) => {
    audio.playSfx('page')
    setPageIdx((i) => Math.min(PERIOD_ORDER.length - 1, Math.max(0, i + dir)))
  }

  const speech = firstSticker
    ? `내가 고른 ${PERIOD_LABELS[period]}의 보물은 「${firstSticker.name}」입니다. ${page.note || firstSticker.hintLine}`
    : `${PERIOD_LABELS[period]} 페이지는 아직 꾸미는 중이에요.`

  return (
    <div className="screen diary-show">
      <img src={bgSrc(SCREEN_BG.diaryShow)} alt="" className="screen__bg" />
      <div className="screen__content">
        <header className="diary-edit__header">
          <AppButton variant="ghost" onClick={() => goTo('main')} ariaLabel="메인 화면으로">
            ← 메인
          </AppButton>
          <h1 className="stage-header__title">역사 다이어리 전시</h1>
          <AppButton variant="secondary" onClick={() => goTo('diaryEdit')}>
            다시 꾸미기
          </AppButton>
        </header>
        <div className="diary-show__stage">
          <AppButton variant="ghost" onClick={() => turn(-1)} disabled={pageIdx === 0} ariaLabel="이전 페이지">
            ◀
          </AppButton>
          <div className="diary-show__book">
            <div className="diary-page diary-page--show" data-period={period}>
              <span className="diary-page__label">
                {PERIOD_LABELS[period]} ({pageIdx + 1}/{PERIOD_ORDER.length})
              </span>
              {page.stickers.length === 0 && <p className="diary-page__empty">아직 붙인 스티커가 없어요</p>}
              {[...page.stickers]
                .sort((a, b) => a.z - b.z)
                .map((s) => {
                  const sticker = stickerById.get(s.stickerId)
                  if (!sticker) return null
                  return (
                    <div
                      key={s.uid}
                      className="diary-sticker diary-sticker--static"
                      style={{
                        left: `${s.x * 100}%`,
                        top: `${s.y * 100}%`,
                        transform: `translate(-50%, -50%) scale(${s.scale}) rotate(${s.rotation}deg)`,
                        zIndex: s.z,
                      }}
                    >
                      <AssetImage src={iconSrc(sticker.icon)} alt={sticker.name} className="diary-sticker__img" fallbackLabel={sticker.name} />
                    </div>
                  )
                })}
              {page.note && <p className="diary-show__note">“{page.note}”</p>}
            </div>
          </div>
          <AppButton
            variant="ghost"
            onClick={() => turn(1)}
            disabled={pageIdx === PERIOD_ORDER.length - 1}
            ariaLabel="다음 페이지"
          >
            ▶
          </AppButton>
        </div>
        {/* 어느 시대 페이지에 스티커가 있는지 한눈에 보이게 — 빈 페이지에서 헤매지 않도록 */}
        <nav className="diary-show__dots" aria-label="시대 페이지 이동">
          {PERIOD_ORDER.map((p, i) => {
            const filled = save.diary[p]?.stickers.length > 0
            return (
              <button
                key={p}
                type="button"
                className={`diary-dot ${i === pageIdx ? 'diary-dot--on' : ''} ${filled ? 'diary-dot--filled' : ''}`}
                onClick={() => {
                  audio.playSfx('page')
                  setPageIdx(i)
                }}
                aria-label={`${PERIOD_LABELS[p]} 페이지${filled ? '' : ' (아직 비어 있음)'}`}
                aria-current={i === pageIdx}
              >
                {PERIOD_LABELS[p]}
              </button>
            )
          })}
        </nav>
        <div className="diary-show__speech">
          <CharacterTalk icon={A.medalGirl} lines={SHOWCASE_LINES} side="left" className="diary-show__presenter" name="발표자" />
          <div className="paper-card diary-show__speech-card">
            <p className="diary-show__speech-label">🎤 발표해 보세요</p>
            <p className="diary-show__speech-text">{speech}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
