import { useState } from 'react'

interface Props {
  src: string | null
  alt: string
  className?: string
  /** 로딩 실패·아이콘 미확정 시 표시할 이름 칩 (기본: alt) */
  fallbackLabel?: string
  draggable?: boolean
  style?: React.CSSProperties
  onClick?: () => void
}

/** 이미지 로딩 실패 시 레이아웃이 깨지지 않게 이름 칩으로 대체한다 */
export function AssetImage({ src, alt, className, fallbackLabel, draggable = false, style, onClick }: Props) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return (
      <span className={`asset-fallback ${className ?? ''}`} role="img" aria-label={alt}>
        {fallbackLabel ?? alt}
      </span>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      draggable={draggable}
      loading="lazy"
      style={style}
      onClick={onClick}
      onError={() => setFailed(true)}
    />
  )
}
