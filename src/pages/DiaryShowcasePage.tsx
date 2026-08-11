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
  const [pageIdx, setPageIdx] = useState(0)
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
                      key={s.stickerId}
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
