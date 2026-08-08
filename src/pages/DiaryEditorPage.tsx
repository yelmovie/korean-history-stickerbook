import { useRef, useState } from 'react'
import { AssetImage } from '../components/AssetImage'
import { AppButton } from '../components/common'
import { bgSrc, iconSrc, SCREEN_BG } from '../data/assets'
import { PERIOD_LABELS } from '../data/stages'
import { STICKERS, stickerById } from '../data/stickers'
import { useGame } from '../game/GameContext'
import type { DiaryPlacedSticker, PeriodId } from '../types'
import { audio } from '../utils/audio'

const PERIOD_ORDER: PeriodId[] = ['prehistoric', 'threeKingdoms', 'goryeo', 'joseon', 'modern']

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export function DiaryEditorPage() {
  const { save, update, goTo } = useGame()
  const [period, setPeriod] = useState<PeriodId>('prehistoric')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [dragPos, setDragPos] = useState<{ id: string; x: number; y: number } | null>(null)
  const pageRef = useRef<HTMLDivElement>(null)
  const dragOffset = useRef({ dx: 0, dy: 0 })

  const page = save.diary[period]
  const earnedInPeriod = STICKERS.filter(
    (s) => s.period === period && save.earnedStickers.includes(s.id),
  )
  const placedIds = page.stickers.map((p) => p.stickerId)

  const mutatePage = (fn: (stickers: DiaryPlacedSticker[]) => DiaryPlacedSticker[]) => {
    update((draft) => ({
      ...draft,
      diary: {
        ...draft.diary,
        [period]: { ...draft.diary[period], stickers: fn(draft.diary[period].stickers) },
      },
    }))
  }

  const addSticker = (stickerId: string) => {
    audio.playSfx('snap')
    const maxZ = page.stickers.reduce((m, s) => Math.max(m, s.z), 0)
    mutatePage((stickers) => [
      ...stickers,
      { stickerId, x: 0.5, y: 0.45, scale: 1, rotation: 0, z: maxZ + 1 },
    ])
    setSelectedId(stickerId)
  }

  const changeSelected = (fn: (s: DiaryPlacedSticker) => DiaryPlacedSticker) => {
    if (!selectedId) return
    mutatePage((stickers) => stickers.map((s) => (s.stickerId === selectedId ? fn(s) : s)))
  }

  const removeSelected = () => {
    if (!selectedId) return
    mutatePage((stickers) => stickers.filter((s) => s.stickerId !== selectedId))
    setSelectedId(null)
  }

  const onStickerPointerDown = (s: DiaryPlacedSticker) => (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    const rect = pageRef.current!.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    dragOffset.current = { dx: px - s.x, dy: py - s.y }
    setSelectedId(s.stickerId)
    const maxZ = page.stickers.reduce((m, st) => Math.max(m, st.z), 0)
    if (s.z < maxZ) changeSelectedById(s.stickerId, (st) => ({ ...st, z: maxZ + 1 }))
    setDragPos({ id: s.stickerId, x: s.x, y: s.y })
  }

  const changeSelectedById = (id: string, fn: (s: DiaryPlacedSticker) => DiaryPlacedSticker) => {
    mutatePage((stickers) => stickers.map((s) => (s.stickerId === id ? fn(s) : s)))
  }

  const onStickerPointerMove = (e: React.PointerEvent) => {
    if (!dragPos) return
    const rect = pageRef.current!.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    setDragPos({
      id: dragPos.id,
      x: clamp(px - dragOffset.current.dx, 0.06, 0.94),
      y: clamp(py - dragOffset.current.dy, 0.08, 0.92),
    })
  }

  const onStickerPointerUp = () => {
    if (!dragPos) return
    const { id, x, y } = dragPos
    setDragPos(null)
    changeSelectedById(id, (s) => ({ ...s, x, y }))
  }

  const setNote = (content: string) => {
    update((draft) => ({
      ...draft,
      diary: { ...draft.diary, [period]: { ...draft.diary[period], note: content } },
    }))
  }

  const firstSticker = placedIds.length > 0 ? stickerById.get(placedIds[0]) : undefined
  const selected = page.stickers.find((s) => s.stickerId === selectedId)

  return (
    <div className="screen diary-edit">
      <img src={bgSrc(SCREEN_BG.diaryEdit)} alt="" className="screen__bg" />
      <div className="screen__content">
        <header className="diary-edit__header">
          <AppButton variant="ghost" onClick={() => goTo('stageSelect')} ariaLabel="스테이지 선택으로">
            ← 나가기
          </AppButton>
          <h1 className="stage-header__title">역사 다이어리 꾸미기</h1>
          <AppButton variant="secondary" onClick={() => goTo('diaryShow')} disabled={save.earnedStickers.length === 0}>
            전시 보기 →
          </AppButton>
        </header>
        <div className="diary-edit__tabs" role="tablist" aria-label="시대 선택">
          {PERIOD_ORDER.map((p) => (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={p === period}
              className={`diary-tab ${p === period ? 'diary-tab--active' : ''}`}
              onClick={() => {
                setPeriod(p)
                setSelectedId(null)
              }}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
        <div className="diary-edit__body">
          <div
            className="diary-page"
            ref={pageRef}
            onPointerDown={(e) => {
              if (e.target === e.currentTarget) setSelectedId(null)
            }}
          >
            <span className="diary-page__label">{PERIOD_LABELS[period]} 페이지</span>
            {page.stickers.length === 0 && (
              <p className="diary-page__empty">오른쪽 보관함에서 스티커를 눌러 붙여 보세요!</p>
            )}
            {[...page.stickers]
              .sort((a, b) => a.z - b.z)
              .map((s) => {
                const sticker = stickerById.get(s.stickerId)
                if (!sticker) return null
                const pos = dragPos && dragPos.id === s.stickerId ? dragPos : s
                return (
                  <div
                    key={s.stickerId}
                    className={`diary-sticker ${selectedId === s.stickerId ? 'diary-sticker--selected' : ''}`}
                    style={{
                      left: `${pos.x * 100}%`,
                      top: `${pos.y * 100}%`,
                      transform: `translate(-50%, -50%) scale(${s.scale}) rotate(${s.rotation}deg)`,
                      zIndex: s.z,
                    }}
                    onPointerDown={onStickerPointerDown(s)}
                    onPointerMove={onStickerPointerMove}
                    onPointerUp={onStickerPointerUp}
                    role="button"
                    aria-label={`${sticker.name} 스티커 — 끌어서 이동`}
                  >
                    <AssetImage src={iconSrc(sticker.icon)} alt={sticker.name} className="diary-sticker__img" fallbackLabel={sticker.name} />
                  </div>
                )
              })}
            <div className="diary-note">
              <label className="diary-note__label" htmlFor="diary-note-input">
                한 줄 설명
              </label>
              <input
                id="diary-note-input"
                className="diary-note__input"
                type="text"
                maxLength={80}
                value={page.note}
                placeholder={firstSticker ? firstSticker.hintLine : '이 시대에서 알게 된 점을 한 줄로 써 보세요'}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
          <aside className="diary-tray">
            <h2 className="diary-tray__title">스티커 보관함</h2>
            <div className="diary-tray__list">
              {earnedInPeriod.length === 0 && (
                <p className="diary-tray__empty">이 시대의 스티커가 아직 없어요. 스테이지에서 모아 보세요!</p>
              )}
              {earnedInPeriod.map((s) => {
                const used = placedIds.includes(s.id)
                return (
                  <button
                    key={s.id}
                    type="button"
                    className={`diary-tray__item ${used ? 'diary-tray__item--used' : ''}`}
                    onClick={() => !used && addSticker(s.id)}
                    disabled={used}
                    aria-label={used ? `${s.name} (이미 붙임)` : `${s.name} 붙이기`}
                  >
                    <AssetImage src={iconSrc(s.icon)} alt="" className="diary-tray__img" fallbackLabel={s.name} />
                    <span className="diary-tray__name">{s.name}</span>
                  </button>
                )
              })}
            </div>
            {selected && (
              <div className="diary-controls" aria-label="선택한 스티커 조절">
                <AppButton variant="ghost" ariaLabel="크게" onClick={() => changeSelected((s) => ({ ...s, scale: clamp(s.scale + 0.15, 0.5, 1.8) }))}>➕</AppButton>
                <AppButton variant="ghost" ariaLabel="작게" onClick={() => changeSelected((s) => ({ ...s, scale: clamp(s.scale - 0.15, 0.5, 1.8) }))}>➖</AppButton>
                <AppButton variant="ghost" ariaLabel="왼쪽으로 회전" onClick={() => changeSelected((s) => ({ ...s, rotation: clamp(s.rotation - 15, -60, 60) }))}>↺</AppButton>
                <AppButton variant="ghost" ariaLabel="오른쪽으로 회전" onClick={() => changeSelected((s) => ({ ...s, rotation: clamp(s.rotation + 15, -60, 60) }))}>↻</AppButton>
                <AppButton variant="ghost" ariaLabel="스티커 떼기" onClick={removeSelected}>🗑</AppButton>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}
