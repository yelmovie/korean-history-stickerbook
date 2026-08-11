import { useEffect, useRef, useState } from 'react'
import { AssetImage } from '../components/AssetImage'
import { AppButton } from '../components/common'
import { bgSrc, iconSrc, SCREEN_BG } from '../data/assets'
import { PERIOD_LABELS } from '../data/stages'
import { DECO_STICKERS, STICKERS, stickerById } from '../data/stickers'
import { useGame } from '../game/GameContext'
import type { DiaryPlacedSticker, PeriodId, StageId } from '../types'
import { audio } from '../utils/audio'

const PERIOD_ORDER: PeriodId[] = ['prehistoric', 'threeKingdoms', 'goryeo', 'joseon', 'modern']

/** 시대 ↔ 그 시대를 다루는 스테이지 */
const STAGE_OF_PERIOD: Record<PeriodId, StageId> = {
  prehistoric: 'stage1',
  threeKingdoms: 'stage2',
  goryeo: 'stage3',
  joseon: 'stage4',
  modern: 'stage5',
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

const SCALE_MIN = 0.5
const SCALE_MAX = 1.8
const ROT_MIN = -60
const ROT_MAX = 60

/** 핸들 조작 중인 스티커의 실시간 크기·각도 (화면 미리보기용) */
type Gesture = { id: string; scale: number; rotation: number }
/** 핸들 조작의 기준값 — 스티커 중심 좌표와 누른 순간의 거리·각도를 담는다 */
type GestureRef = Gesture & {
  mode: 'scale' | 'rotate'
  cx: number
  cy: number
  startDist: number
  startAngle: number
  startScale: number
  startRotation: number
}

/** 붙인 스티커 한 건씩 구분할 id. 저장 데이터 안에서만 쓰이므로 짧아도 된다 */
let uidSeq = 0
const nextUid = () => Date.now().toString(36) + (uidSeq += 1).toString(36)
/** 새로 붙인 스티커가 페이지 밖으로 나가지 않게 */
const clampPos = (v: number) => Math.min(0.92, Math.max(0.08, v))

export function DiaryEditorPage() {
  const { save, update, goTo } = useGame()
  const [period, setPeriod] = useState<PeriodId>('prehistoric')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  // 드래그 좌표는 ref로 동기 추적 (빠른 플릭에서 state 지연으로 드래그 유실 방지)
  const dragRef = useRef<{ id: string; x: number; y: number } | null>(null)
  const [dragPos, setDragPos] = useState<{ id: string; x: number; y: number } | null>(null)
  const pageRef = useRef<HTMLDivElement>(null)
  const dragOffset = useRef({ dx: 0, dy: 0 })
  // 크기·회전 핸들도 같은 이유로 ref 동기 추적 + state는 미리보기 용도로만 쓴다
  const gestureRef = useRef<GestureRef | null>(null)
  const [gesture, setGesture] = useState<Gesture | null>(null)

  /* 다이어리는 그 시대 스테이지를 마친 뒤에 열린다.
   * 스테이지를 안 끝냈는데 시대 페이지가 열려 있으면 학습 순서가 무너진다. */
  const isPeriodOpen = (p: PeriodId) =>
    save.settings.unlockAll || save.completedStages.includes(STAGE_OF_PERIOD[p])
  const openPeriods = PERIOD_ORDER.filter(isPeriodOpen)

  // 잠긴 시대를 보고 있으면(초기화·해금 해제 등) 열린 첫 시대로 되돌린다
  useEffect(() => {
    if (openPeriods.length > 0 && !isPeriodOpen(period)) {
      setPeriod(openPeriods[0])
      setSelectedId(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openPeriods.length, period])

  const page = save.diary[period]
  const earnedInPeriod = [
    ...STICKERS.filter((s) => s.period === period && save.earnedStickers.includes(s.id)),
    // 꾸미기 스티커는 모으지 않아도 늘 쓸 수 있다
    ...DECO_STICKERS.filter((s) => s.period === period),
  ]
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
    const uid = stickerId + '-' + nextUid()
    // 같은 자리에 그대로 겹쳐 쌓이지 않게, 붙일 때마다 조금씩 어긋나게 놓는다
    const n = page.stickers.length
    mutatePage((stickers) => [
      ...stickers,
      {
        uid,
        stickerId,
        x: clampPos(0.5 + ((n % 5) - 2) * 0.07),
        y: clampPos(0.45 + (Math.floor(n / 5) % 3) * 0.12),
        scale: 1,
        rotation: 0,
        z: maxZ + 1,
      },
    ])
    setSelectedId(uid)
  }

  const removeById = (uid: string) => {
    mutatePage((stickers) => stickers.filter((s) => s.uid !== uid))
    setSelectedId((cur) => (cur === uid ? null : cur))
  }

  const onStickerPointerDown = (s: DiaryPlacedSticker) => (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    const rect = pageRef.current!.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    dragOffset.current = { dx: px - s.x, dy: py - s.y }
    setSelectedId(s.uid)
    const maxZ = page.stickers.reduce((m, st) => Math.max(m, st.z), 0)
    if (s.z < maxZ) changeSelectedById(s.uid, (st) => ({ ...st, z: maxZ + 1 }))
    dragRef.current = { id: s.uid, x: s.x, y: s.y }
    setDragPos({ id: s.uid, x: s.x, y: s.y })
  }

  const changeSelectedById = (uid: string, fn: (s: DiaryPlacedSticker) => DiaryPlacedSticker) => {
    mutatePage((stickers) => stickers.map((s) => (s.uid === uid ? fn(s) : s)))
  }

  const onStickerPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return
    const rect = pageRef.current!.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    const next = {
      id: dragRef.current.id,
      x: clamp(px - dragOffset.current.dx, 0.06, 0.94),
      y: clamp(py - dragOffset.current.dy, 0.08, 0.92),
    }
    dragRef.current = next
    setDragPos(next)
  }

  const onStickerPointerUp = () => {
    const d = dragRef.current
    if (!d) return
    dragRef.current = null
    setDragPos(null)
    changeSelectedById(d.id, (s) => ({ ...s, x: d.x, y: d.y }))
  }

  /** 스티커 중심의 화면 좌표 (핸들 각도·거리 계산 기준점) */
  const centerOf = (s: DiaryPlacedSticker) => {
    const rect = pageRef.current!.getBoundingClientRect()
    return { cx: rect.left + s.x * rect.width, cy: rect.top + s.y * rect.height }
  }

  const onHandlePointerDown =
    (s: DiaryPlacedSticker, mode: 'scale' | 'rotate') => (e: React.PointerEvent) => {
      // 본체 드래그(이동)가 같이 시작되지 않도록 차단
      e.stopPropagation()
      e.currentTarget.setPointerCapture(e.pointerId)
      const { cx, cy } = centerOf(s)
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      gestureRef.current = {
        id: s.uid,
        mode,
        cx,
        cy,
        startDist: Math.max(Math.hypot(dx, dy), 1),
        startAngle: Math.atan2(dy, dx),
        startScale: s.scale,
        startRotation: s.rotation,
        scale: s.scale,
        rotation: s.rotation,
      }
      setSelectedId(s.uid)
      setGesture({ id: s.uid, scale: s.scale, rotation: s.rotation })
    }

  const onHandlePointerMove = (e: React.PointerEvent) => {
    const g = gestureRef.current
    if (!g) return
    e.stopPropagation()
    const dx = e.clientX - g.cx
    const dy = e.clientY - g.cy
    if (g.mode === 'scale') {
      // 중심에서 멀어진 비율만큼 커진다
      g.scale = clamp((g.startScale * Math.hypot(dx, dy)) / g.startDist, SCALE_MIN, SCALE_MAX)
    } else {
      let deg = ((Math.atan2(dy, dx) - g.startAngle) * 180) / Math.PI
      if (deg > 180) deg -= 360
      if (deg < -180) deg += 360
      g.rotation = clamp(g.startRotation + deg, ROT_MIN, ROT_MAX)
    }
    setGesture({ id: g.id, scale: g.scale, rotation: g.rotation })
  }

  const onHandlePointerUp = (e: React.PointerEvent) => {
    const g = gestureRef.current
    if (!g) return
    e.stopPropagation()
    gestureRef.current = null
    setGesture(null)
    changeSelectedById(g.id, (s) => ({ ...s, scale: g.scale, rotation: g.rotation }))
  }

  /** 선택된 스티커를 키보드로 조작 — 방향키 이동, +/- 크기, [/] 회전, Delete 삭제 */
  const onStickerKeyDown = (s: DiaryPlacedSticker) => (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 0.05 : 0.02
    const move = (dx: number, dy: number) =>
      changeSelectedById(s.uid, (st) => ({
        ...st,
        x: clamp(st.x + dx, 0.06, 0.94),
        y: clamp(st.y + dy, 0.08, 0.92),
      }))
    const resize = (d: number) =>
      changeSelectedById(s.uid, (st) => ({
        ...st,
        scale: clamp(st.scale + d, SCALE_MIN, SCALE_MAX),
      }))
    const rotate = (d: number) =>
      changeSelectedById(s.uid, (st) => ({
        ...st,
        rotation: clamp(st.rotation + d, ROT_MIN, ROT_MAX),
      }))

    switch (e.key) {
      case 'ArrowLeft': move(-step, 0); break
      case 'ArrowRight': move(step, 0); break
      case 'ArrowUp': move(0, -step); break
      case 'ArrowDown': move(0, step); break
      case '+': case '=': resize(0.15); break
      case '-': case '_': resize(-0.15); break
      case '[': rotate(-15); break
      case ']': rotate(15); break
      case 'Delete': case 'Backspace': removeById(s.uid); break
      default: return
    }
    e.preventDefault()
  }

  const selected = page.stickers.find((s) => s.uid === selectedId)
  /** 지금 누른 스티커. 이 스티커의 설명이 곧 이 시대 페이지의 한 줄 설명이 된다 */
  const selectedSticker = selected ? stickerById.get(selected.stickerId) : undefined

  // 고른 스티커의 설명을 페이지에 남겨 둔다 — 전시 화면과 수료증이 이 값을 읽는다
  useEffect(() => {
    if (!selectedSticker || page.note === selectedSticker.hintLine) return
    update((draft) => ({
      ...draft,
      diary: {
        ...draft.diary,
        [period]: { ...draft.diary[period], note: selectedSticker.hintLine },
      },
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSticker?.id, period])

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
          {PERIOD_ORDER.map((p) => {
            const open = isPeriodOpen(p)
            return (
              <button
                key={p}
                type="button"
                role="tab"
                aria-selected={p === period}
                className={`diary-tab ${p === period ? 'diary-tab--active' : ''} ${open ? '' : 'diary-tab--locked'}`}
                onClick={() => {
                  if (!open) return
                  setPeriod(p)
                  setSelectedId(null)
                }}
                disabled={!open}
                aria-label={open ? PERIOD_LABELS[p] : `${PERIOD_LABELS[p]} — 그 시대를 먼저 완료해야 열려요`}
              >
                {open ? PERIOD_LABELS[p] : `🔒 ${PERIOD_LABELS[p]}`}
              </button>
            )
          })}
        </div>
        <div className="diary-edit__body">
          <div
            className="diary-page"
            data-period={period}
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
                const pos = dragPos && dragPos.id === s.uid ? dragPos : s
                // 핸들 조작 중이면 저장값 대신 실시간 값으로 그린다
                const live = gesture && gesture.id === s.uid ? gesture : s
                const isSelected = selectedId === s.uid
                return (
                  <div
                    key={s.uid}
                    className={`diary-sticker ${isSelected ? 'diary-sticker--selected' : ''}`}
                    style={{
                      left: `${pos.x * 100}%`,
                      top: `${pos.y * 100}%`,
                      transform: `translate(-50%, -50%) scale(${live.scale}) rotate(${live.rotation}deg)`,
                      zIndex: s.z,
                      // 핸들이 스티커 크기와 무관하게 항상 같은 크기로 보이도록 역보정
                      ['--sticker-inv' as string]: `${1 / live.scale}`,
                    }}
                    onPointerDown={onStickerPointerDown(s)}
                    onPointerMove={onStickerPointerMove}
                    onPointerUp={onStickerPointerUp}
                    onPointerCancel={onStickerPointerUp}
                    onKeyDown={onStickerKeyDown(s)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${sticker.name} 스티커 — 끌어서 이동, 방향키로 이동, + - 로 크기, 대괄호로 회전, Delete로 떼기`}
                  >
                    <AssetImage src={iconSrc(sticker.icon)} alt={sticker.name} className="diary-sticker__img" fallbackLabel={sticker.name} />
                    {isSelected && (
                      <>
                        <button
                          type="button"
                          className="diary-handle diary-handle--delete"
                          aria-label={`${sticker.name} 스티커 떼기`}
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={() => removeById(s.uid)}
                        >
                          ✕
                        </button>
                        <button
                          type="button"
                          className="diary-handle diary-handle--rotate"
                          aria-label={`${sticker.name} 스티커 돌리기 — 끌어서 회전`}
                          onPointerDown={onHandlePointerDown(s, 'rotate')}
                          onPointerMove={onHandlePointerMove}
                          onPointerUp={onHandlePointerUp}
                          onPointerCancel={onHandlePointerUp}
                        >
                          ↻
                        </button>
                        <button
                          type="button"
                          className="diary-handle diary-handle--resize"
                          aria-label={`${sticker.name} 스티커 크기 조절 — 끌어서 크게`}
                          onPointerDown={onHandlePointerDown(s, 'scale')}
                          onPointerMove={onHandlePointerMove}
                          onPointerUp={onHandlePointerUp}
                          onPointerCancel={onHandlePointerUp}
                        >
                          ⤡
                        </button>
                      </>
                    )}
                  </div>
                )
              })}
            {/* 직접 타이핑하는 대신, 누른 스티커의 이름과 설명을 보여 준다 */}
            <div className="diary-note" role="status" aria-live="polite">
              <span className="diary-note__label">한 줄 설명</span>
              {selectedSticker ? (
                <p className="diary-note__card">
                  <span className="diary-note__name">{selectedSticker.name}</span>
                  <span className="diary-note__text">{selectedSticker.hintLine}</span>
                </p>
              ) : (
                <p className="diary-note__card diary-note__card--empty">
                  붙인 스티커를 누르면 이름과 설명이 여기에 나와요
                </p>
              )}
            </div>
          </div>
          <aside className="diary-tray" data-period={period}>
            <h2 className="diary-tray__title">스티커 보관함</h2>
            <div className="diary-tray__list">
              {earnedInPeriod.length === 0 && (
                <p className="diary-tray__empty">이 시대의 스티커가 아직 없어요. 스테이지에서 모아 보세요!</p>
              )}
              {earnedInPeriod.map((s) => {
                const count = placedIds.filter((id) => id === s.id).length
                return (
                  <button
                    key={s.id}
                    type="button"
                    className="diary-tray__item"
                    onClick={() => addSticker(s.id)}
                    aria-label={count > 0 ? `${s.name} 붙이기 (지금 ${count}개 붙임)` : `${s.name} 붙이기`}
                  >
                    <span className="tray-card">
                      <span className="tray-card__face tray-card__face--front">
                        <AssetImage src={iconSrc(s.icon)} alt="" className="diary-tray__img" fallbackLabel={s.name} />
                        <span className="diary-tray__name">{s.name}</span>
                      </span>
                      <span className="tray-card__face tray-card__face--back">
                        <span className="tray-card__back-name">{s.name}</span>
                      </span>
                    </span>
                    {count > 0 && <span className="diary-tray__count">{count}</span>}
                  </button>
                )
              })}
            </div>
            {selected && (
              <p className="diary-tray__hint">
                스티커를 누르면 둘레에 단추가 나와요. ✕ 떼기 · ↻ 끌어서 돌리기 · ⤡ 끌어서 크기
              </p>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}
