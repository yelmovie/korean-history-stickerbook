import { useEffect, useState, createContext, useContext, type ReactNode } from 'react'
import { photoCredit, photoSrc } from '../data/assets'
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

  useEffect(() => {
    if (!shown) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShown(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [shown])

  return (
    <PhotoViewerContext.Provider value={{ open: (id, title) => setShown({ id, title }) }}>
      {children}
      {shown && (
        <div className="photo-viewer" role="dialog" aria-modal="true" aria-label={`${shown.title} 크게 보기`}>
          <button type="button" className="photo-viewer__scrim" onClick={() => setShown(null)} aria-label="닫기" />
          <div className="photo-viewer__inner">
            <AssetImage src={photoSrc(shown.id)} alt={shown.title} className="photo-viewer__img" />
            <aside className="photo-viewer__info">
              {(() => {
                const s = stickerById.get(shown.id)
                return (
                  <>
                    <p className="photo-viewer__title">{s?.name ?? shown.title}</p>
                    {s && <p className="photo-viewer__period">{PERIOD_LABELS[s.period]}</p>}
                    {s && <p className="photo-viewer__desc">{s.hintLine}</p>}
                    <p className="photo-viewer__hint">사진을 눌러 자세히 살펴보세요. 재료·모양·쓰임이 그 시대를 알려 줘요.</p>
                    <p className="photo-viewer__credit">{photoCredit(shown.id)}</p>
                  </>
                )
              })()}
            </aside>
          </div>
          <button type="button" className="photo-viewer__close" onClick={() => setShown(null)} aria-label="크게 보기 닫기">
            ✕
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
      ⛶
    </button>
  )
}
