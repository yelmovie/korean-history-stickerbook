import { useEffect, useRef, useState, type ReactNode } from 'react'
import { audio } from '../../utils/audio'

interface Props {
  children: ReactNode
  onRevealed: () => void
}

/** 흙 레이어를 그린다 (캔버스 크기에 맞춰) */
function drawDirt(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const g = ctx.createLinearGradient(0, 0, 0, canvas.height)
  g.addColorStop(0, '#8a6a48')
  g.addColorStop(1, '#5f4630')
  ctx.globalCompositeOperation = 'source-over'
  ctx.fillStyle = g
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = 'rgba(74, 55, 37, 0.55)'
  for (let i = 0; i < 40; i++) {
    const x = ((i * 137) % canvas.width) + (i % 3) * 4
    const y = ((i * 89) % canvas.height) + (i % 5) * 3
    ctx.beginPath()
    ctx.arc(x, y, 6 + (i % 9), 0, Math.PI * 2)
    ctx.fill()
  }
}

/** 문지르기 발굴: 흙 레이어를 문질러 60% 이상 지우면 유물이 드러난다.
 *  캔버스는 감싼 유물 이미지 크기에 자동으로 맞춘다. */
export function ScratchReveal({ children, onRevealed }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [done, setDone] = useState(false)
  const rubbing = useRef(false)
  const moveCount = useRef(0)

  // 이미지 로딩·리사이즈에 따라 캔버스 크기를 유물 이미지에 맞춘다
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const sync = () => {
      const canvas = canvasRef.current
      if (!canvas || moveCount.current > 0) return
      const r = wrap.getBoundingClientRect()
      const w = Math.floor(r.width)
      const h = Math.floor(r.height)
      if (w < 4 || h < 4 || (canvas.width === w && canvas.height === h)) return
      canvas.width = w
      canvas.height = h
      drawDirt(canvas)
    }
    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [])

  const erase = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current
    if (!canvas || done || canvas.width < 4) return
    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    // 붓 크기: 캔버스 폭의 14% (최소 36px)
    const r = Math.max(36, canvas.width * 0.14)
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(
      ((clientX - rect.left) / rect.width) * canvas.width,
      ((clientY - rect.top) / rect.height) * canvas.height,
      r,
      0,
      Math.PI * 2,
    )
    ctx.fill()
    moveCount.current += 1
    if (moveCount.current % 8 === 0) checkCleared()
  }

  const checkCleared = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || canvas.width < 4) return
    const step = 12
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    let clear = 0
    let total = 0
    for (let y = 0; y < canvas.height; y += step) {
      for (let x = 0; x < canvas.width; x += step) {
        total += 1
        if (data[(y * canvas.width + x) * 4 + 3] < 40) clear += 1
      }
    }
    if (total > 0 && clear / total >= 0.6) {
      setDone(true)
      audio.playSfx('sticker')
      setTimeout(onRevealed, 500)
    }
  }

  return (
    <div className="scratch-wrap" ref={wrapRef}>
      {children}
      {!done && (
        <>
          <canvas
            ref={canvasRef}
            className="scratch-canvas"
            onPointerDown={(e) => {
              rubbing.current = true
              e.currentTarget.setPointerCapture(e.pointerId)
              erase(e.clientX, e.clientY)
            }}
            onPointerMove={(e) => rubbing.current && erase(e.clientX, e.clientY)}
            onPointerUp={() => {
              rubbing.current = false
              checkCleared()
            }}
            onPointerCancel={() => {
              rubbing.current = false
            }}
            aria-label="흙을 문질러 유물 발굴하기"
            role="img"
          />
          <span className="scratch-guide" aria-hidden="true">
            🖌️ 문질러서 발굴!
          </span>
        </>
      )}
      {done && (
        <span className="scratch-done" aria-hidden="true">
          ✨
        </span>
      )}
    </div>
  )
}
