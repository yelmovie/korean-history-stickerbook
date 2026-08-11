import { useEffect, useState, createContext, useContext, type ReactNode } from 'react'
import { photoCredit, photoSrc, PHOTO_ONLY_INFO } from '../data/assets'
import { stickerById } from '../data/stickers'
import { PERIOD_LABELS } from '../data/stages'
import { AssetImage } from './AssetImage'

interface ViewerApi {
  /** 실물 사진을 전체 화면으로 연다 */
  open: (stickerId: string, title: string) => void
}

const PhotoViewerContext = createContext<ViewerApi>({ open: () => {} })

export function usePhotoViewer(): ViewerApi {
  return useContext(PhotoViewerContext)
}

/** 앱 전체에서 쓰는 실물 사진 전체화면 뷰어 */
export function PhotoViewerProvider({ children }: { children: ReactNode }) {
  const [shown, setShown] = useState<{ id: string; title: string } | null>(null)
  /** 휠·버튼으로 조절하는 확대 배율 */
  const [scale, setScale] = useState(1)

  useEffect(() => {
    if (!shown) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShown(null)
      if (e.key === '+' || e.key === '=') setScale((v) => Math.min(4, v + 0.25))
      if (e.key === '-') setScale((v) => Math.max(1, v - 0.25))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [shown])

  return (
    <PhotoViewerContext.Provider value={{ open: (id, title) => { setScale(1); setShown({ id, title }) } }}>
      {children}
      {shown && (
        <div
          className="photo-viewer"
          role="dialog"
          aria-modal="true"
          aria-label={`${shown.title} 크게 보기`}
          onWheel={(e) => setScale((v) => Math.min(4, Math.max(1, v - e.deltaY * 0.0015)))}
        >
          <button type="button" className="photo-viewer__scrim" onClick={() => setShown(null)} aria-label="닫기" />
          <div className="photo-viewer__inner">
            <figure className="photo-viewer__frame">
              <div className="photo-viewer__mat">
                <AssetImage
                  src={photoSrc(shown.id)}
                  alt={shown.title}
                  className="photo-viewer__img"
                  style={{ transform: `scale(${scale})` }}
                  onClick={() => setScale((v) => (v >= 3 ? 1 : v + 0.5))}
                />
              </div>
              <div className="photo-viewer__zoombar" role="group" aria-label="확대 조절">
                <button
                  type="button"
                  className="photo-viewer__zoombtn"
                  onClick={() => setScale((v) => Math.max(1, v - 0.25))}
                  disabled={scale <= 1}
                  aria-label="축소"
                >
                  −
                </button>
                <span className="photo-viewer__zoomval" aria-live="polite">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  type="button"
                  className="photo-viewer__zoombtn"
                  onClick={() => setScale((v) => Math.min(4, v + 0.25))}
                  disabled={scale >= 4}
                  aria-label="확대"
                >
                  ＋
                </button>
                <button
                  type="button"
                  className="photo-viewer__zoomreset"
                  onClick={() => setScale(1)}
                  disabled={scale === 1}
                >
                  원래 크기
                </button>
              </div>
            </figure>
            <aside className="photo-viewer__info">
              {(() => {
                const s = stickerById.get(shown.id)
                const extra = PHOTO_ONLY_INFO[shown.id]
                return (
                  <>
                    <p className="photo-viewer__eyebrow">유물 자세히 보기</p>
                    <h2 className="photo-viewer__title">{s?.name ?? extra?.name ?? shown.title}</h2>
                    {s && <p className="photo-viewer__period">{PERIOD_LABELS[s.period]}</p>}
                    {(s || extra) && <p className="photo-viewer__desc">{s?.hintLine ?? extra?.desc}</p>}
                    <p className="photo-viewer__hint">재료·모양·쓰임이 그 시대를 알려 줘요.</p>
                    <p className="photo-viewer__zoomhint">
                      사진을 누르거나 마우스 휠을 굴려도 확대돼요.
                    </p>
                    <p className="photo-viewer__credit">{photoCredit(shown.id)}</p>
                  </>
                )
              })()}
            </aside>
          </div>
          <button type="button" className="photo-viewer__close" onClick={() => setShown(null)} aria-label="크게 보기 닫기">
            <span aria-hidden="true">✕</span>
          </button>
        </div>
      )}
    </PhotoViewerContext.Provider>
  )
}

/** 사진 위에 겹쳐 두는 "전체화면으로 보기" 버튼 */
export function PhotoZoomButton({ stickerId, title }: { stickerId: string; title: string }) {
  const viewer = usePhotoViewer()
  return (
    <button
      type="button"
      className="photo-zoom-btn"
      onClick={(e) => {
        e.stopPropagation()
        viewer.open(stickerId, title)
      }}
      aria-label={`${title} 실물 사진 크게 보기`}
    >
      <span aria-hidden="true">⛶</span>
      <span className="photo-zoom-btn__label">크게 보기</span>
    </button>
  )
}
