import { useEffect } from 'react'
import { iconSrc, photoSrc, photoCredit } from '../data/assets'
import type { Sticker } from '../types'
import { audio } from '../utils/audio'
import { AppButton } from './common'
import { AssetImage } from './AssetImage'
import { PhotoZoomButton } from './PhotoViewer'

interface Props {
  sticker: Sticker
  explanation: string
  onDone: () => void
}

/** 정답 시 스티커 획득 연출: 반짝이며 커졌다가 안내 카드로 정리 */
export function StickerReward({ sticker, explanation, onDone }: Props) {
  useEffect(() => {
    audio.playSfx('sticker')
  }, [])
  return (
    <div className="modal-backdrop" role="presentation">
      <div className="reward" role="dialog" aria-modal="true" aria-label="스티커 획득">
        <div className="reward__burst" aria-hidden="true" />
        <div className="reward__sticker">
          <AssetImage src={iconSrc(sticker.icon)} alt={sticker.name} className="reward__img" />
        </div>
        <div className="paper-card reward__card">
          <p className="reward__badge">스티커 획득!</p>
          <h2 className="reward__name">{sticker.name}</h2>
          {photoSrc(sticker.id) && (
            <span className="reward__photo-wrap artifact-photo-frame">
              <AssetImage src={photoSrc(sticker.id)} alt={`${sticker.name} 실물 사진`} className="reward__photo" />
              <PhotoZoomButton stickerId={sticker.id} title={sticker.name} />
              <span className="artifact-photo-credit">{photoCredit(sticker.id)}</span>
            </span>
          )}
          <p className="reward__explain">{explanation}</p>
          <AppButton onClick={onDone}>보관함에 넣기</AppButton>
        </div>
      </div>
    </div>
  )
}
