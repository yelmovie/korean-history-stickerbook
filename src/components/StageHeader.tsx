import { useState } from 'react'
import { audio } from '../utils/audio'
import { AppButton } from './common'

interface Props {
  title: string
  subtitle?: string
  current: number
  total: number
  onBack: () => void
}

export function StageHeader({ title, subtitle, current, total, onBack }: Props) {
  const [muted, setMuted] = useState(audio.muted)
  const pct = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0
  return (
    <header className="stage-header">
      <AppButton variant="ghost" onClick={onBack} ariaLabel="스테이지 선택으로 돌아가기">
        ← 나가기
      </AppButton>
      <div className="stage-header__title-wrap">
        <h1 className="stage-header__title">{title}</h1>
        {subtitle && <p className="stage-header__subtitle">{subtitle}</p>}
      </div>
      <div className="stage-header__right">
        <div className="stage-progress" aria-label={`진행도 ${current}/${total}`}>
          <div className="stage-progress__bar">
            <div className="stage-progress__fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="stage-progress__text">
            {current}/{total}
          </span>
        </div>
        <AppButton
          variant="ghost"
          ariaLabel={muted ? '소리 켜기' : '소리 끄기'}
          onClick={() => {
            audio.setMuted(!muted)
            setMuted(!muted)
          }}
        >
          {muted ? '🔇' : '🔊'}
        </AppButton>
      </div>
    </header>
  )
}
