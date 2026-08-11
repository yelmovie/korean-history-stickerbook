import { useEffect, useRef } from 'react'

/** 수료 화면에서 한 번만 터지는 축하 종이꽃가루.
 *  캔버스 하나로 그리므로 DOM이 늘어나지 않고, 다 떨어지면 스스로 멈춘다. */
export function Confetti({ pieces = 90 }: { pieces?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const parent = canvas.parentElement!
    const W = (canvas.width = parent.clientWidth)
    const H = (canvas.height = parent.clientHeight)

    const COLORS = ['#d6a84f', '#10233f', '#2f6f6a', '#b04a3a', '#f7ead0', '#e8c26a']
    const bits = Array.from({ length: pieces }, (_, i) => ({
      x: W * (0.15 + 0.7 * ((i * 37) % 100) / 100),
      y: -H * 0.1 * (((i * 53) % 100) / 100) - 20,
      w: 6 + ((i * 17) % 8),
      h: 9 + ((i * 29) % 10),
      vy: 1.6 + ((i * 13) % 20) / 10,
      vx: -1.2 + ((i * 31) % 24) / 10,
      rot: ((i * 41) % 360) * (Math.PI / 180),
      spin: (-4 + ((i * 7) % 9)) / 60,
      color: COLORS[i % COLORS.length],
    }))

    let raf = 0
    let frame = 0
    const draw = () => {
      frame += 1
      ctx.clearRect(0, 0, W, H)
      let alive = 0
      for (const b of bits) {
        b.x += b.vx
        b.y += b.vy
        b.vy += 0.02
        b.rot += b.spin
        if (b.y < H + 40) alive += 1
        ctx.save()
        ctx.translate(b.x, b.y)
        ctx.rotate(b.rot)
        ctx.fillStyle = b.color
        // 회전하며 납작해지는 종잇조각처럼 보이게 가로폭을 흔든다
        ctx.fillRect(-b.w / 2, -b.h / 2, b.w * Math.abs(Math.cos(b.rot)), b.h)
        ctx.restore()
      }
      // 다 떨어졌거나 너무 오래되면 멈춘다
      if (alive > 0 && frame < 60 * 8) raf = requestAnimationFrame(draw)
      else ctx.clearRect(0, 0, W, H)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [pieces])

  return <canvas ref={ref} className="confetti" aria-hidden="true" />
}
