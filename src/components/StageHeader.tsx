import { useState } from 'react'
import { audio } from '../utils/audio'
import { AppButton } from './common'

interface Props {
  title: string
  subtitle?: string
  onBack: () => void
}

/** 제목·소제목은 화면 정중앙, 나가기·소리 버튼은 양쪽 모서리에 고정 */
export function StageHeader({ title, subtitle, onBack }: Props) {
  const [muted, setMuted] = useState(audio.muted)
  return (
    <header className="stage-header">
      <AppButton variant="ghost" className="stage-header__back" onClick={onBack} ariaLabel="스테이지 선택으로 돌아가기">
        ← 나가기
      </AppButton>
      <div className="stage-header__title-wrap">
        <h1 className="stage-header__title">{title}</h1>
        {subtitle && <p className="stage-header__subtitle">{subtitle}</p>}
      </div>
      <AppButton
        variant="ghost"
        className="stage-header__sound"
        ariaLabel={muted ? '소리 켜기' : '소리 끄기'}
        onClick={() => {
          audio.setMuted(!muted)
          setMuted(!muted)
        }}
      >
        {muted ? '🔇' : '🔊'}
      </AppButton>
    </header>
  )
}
