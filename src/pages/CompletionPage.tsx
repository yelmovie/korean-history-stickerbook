import { useState } from 'react'
import { AssetImage } from '../components/AssetImage'
import { Confetti } from '../components/Confetti'
import { AppButton, Modal, PaperCard } from '../components/common'
import { bgSrc, iconSrc, SCREEN_BG, A } from '../data/assets'
import { STAGES } from '../data/stages'
import { STICKERS } from '../data/stickers'
import { useGame } from '../game/GameContext'

/** 완료 스테이지 수에 따른 칭호 */
function titleFor(completed: number): string {
  if (completed >= 5) return '어린이 역사 큐레이터'
  if (completed >= 4) return '조선 발명 연구원'
  if (completed >= 3) return '보물 복원가'
  if (completed >= 2) return '문화유산 탐험가'
  return '시대 탐정'
}

/** 수료증을 그림 파일로 저장한다 (외부 라이브러리 없이 캔버스로 직접 그린다) */
/** 수료증 배경 (docs/ASSET-PROMPTS-DIARY.md 참조). 없으면 CSS/캔버스 기본 테두리로 대체된다 */
const CERT_BG = '/assets/opt/cert/cert_bg.webp'

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

/** 문장을 주어진 폭에 맞춰 줄바꿈한다. 캔버스에는 자동 줄바꿈이 없다. */
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const lines: string[] = []
  let line = ''
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word
    if (ctx.measureText(next).width > maxW && line) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines
}

/** 화면에 보이는 수료증을 그대로 PNG로 그려 내려받는다.
 *  배경·그림 글자·도장이 없어도(로드 실패해도) 글자는 그려지도록 null을 허용한다. */
async function downloadCertificate(citation: string, issued: string) {
  const W = 1200
  const H = 900
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const [bg, logo, seal] = await Promise.all([
    loadImage(CERT_BG),
    loadImage(iconSrc(A.curatorLogo) ?? ''),
    loadImage(iconSrc(A.stamp) ?? ''),
  ])

  if (bg) {
    ctx.drawImage(bg, 0, 0, W, H)
  } else {
    ctx.fillStyle = '#fdf6e5'
    ctx.fillRect(0, 0, W, H)
    ctx.strokeStyle = '#d6a84f'
    ctx.lineWidth = 10
    ctx.strokeRect(28, 28, W - 56, H - 56)
    ctx.strokeStyle = '#10233f'
    ctx.lineWidth = 3
    ctx.strokeRect(46, 46, W - 92, H - 92)
  }

  /* 배경 그림의 테두리 장식 안쪽(크림색 면)만 실제로 쓸 수 있다.
   * cert_bg.webp 를 1200×900 으로 재서 얻은 값 — 배경을 바꾸면 다시 재야 한다. */
  const SAFE = { left: 160, right: 1024, top: 150, bottom: 752 }
  const midX = (SAFE.left + SAFE.right) / 2

  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#2e6e6a'
  ctx.font = 'bold 38px "Malgun Gothic", sans-serif'
  ctx.fillText('수 료 증', midX, 208)

  // 칭호는 글자 대신 그림 글자를 얹는다 (화면과 동일)
  let cursorY = 244
  if (logo) {
    const h = 148
    const w = (logo.naturalWidth / logo.naturalHeight) * h
    ctx.drawImage(logo, midX - w / 2, cursorY, w, h)
    cursorY += h + 42
  } else {
    ctx.fillStyle = '#10233f'
    ctx.font = 'bold 56px "Malgun Gothic", sans-serif'
    ctx.fillText('어린이 역사 큐레이터', midX, cursorY + 54)
    cursorY += 96
  }

  // 본문 서술 — 숫자 나열 대신 한 문단으로
  ctx.fillStyle = '#2b2118'
  ctx.font = '25px "Malgun Gothic", sans-serif'
  for (const ln of wrapText(ctx, citation, SAFE.right - SAFE.left - 30)) {
    ctx.fillText(ln, midX, cursorY)
    cursorY += 39
  }

  // 손으로 쓰는 칸 — 밑줄과 글자를 한 덩어리로 재서 가운데에 맞춘다
  ctx.font = '30px "Malgun Gothic", sans-serif'
  ctx.textAlign = 'left'
  const FIELD_Y = cursorY + 34
  /* 학년·반·번은 '밑줄 뒤에 이름표', 이름은 '이름표 뒤에 밑줄' 순서다(화면과 동일).
   * 이름의 순서를 뒤집어야 덩어리가 밑줄로 시작해 밑줄로 끝나고, 그래야 밑줄이 가운데 보인다.
   * (전부 '밑줄 뒤 이름표'로 두면 오른쪽 끝이 글자라 밑줄만 왼쪽으로 치우쳐 보였다.) */
  const fields: { label: string; lineW: number; labelFirst?: boolean }[] = [
    { label: '학년', lineW: 64 },
    { label: '반', lineW: 64 },
    { label: '번', lineW: 64 },
    { label: '이름', lineW: 240, labelFirst: true },
  ]
  const GAP_AFTER_LINE = 8
  const GAP_BETWEEN = 40
  const partW = (f: (typeof fields)[number]) =>
    f.lineW + GAP_AFTER_LINE + ctx.measureText(f.label).width
  const runW = fields.reduce((sum, f) => sum + partW(f), 0) + GAP_BETWEEN * (fields.length - 1)
  // 덩어리는 밑줄로 시작해 밑줄로 끝나므로, 덩어리를 가운데 두면 밑줄도 가운데 온다
  let cursor = midX - runW / 2
  ctx.strokeStyle = '#6b4528'
  ctx.lineWidth = 2
  for (const f of fields) {
    if (f.labelFirst) {
      ctx.fillStyle = '#2b2118'
      ctx.fillText(f.label, cursor, FIELD_Y)
      cursor += ctx.measureText(f.label).width + GAP_AFTER_LINE
    }
    ctx.beginPath()
    ctx.moveTo(cursor, FIELD_Y + 10)
    ctx.lineTo(cursor + f.lineW, FIELD_Y + 10)
    ctx.stroke()
    cursor += f.lineW
    if (!f.labelFirst) {
      cursor += GAP_AFTER_LINE
      ctx.fillStyle = '#2b2118'
      ctx.fillText(f.label, cursor, FIELD_Y)
      cursor += ctx.measureText(f.label).width
    }
    cursor += GAP_BETWEEN
  }

  // 발급일과 발급 주체
  ctx.textAlign = 'center'
  ctx.fillStyle = '#6b4528'
  ctx.font = 'bold 24px "Malgun Gothic", sans-serif'
  ctx.fillText(issued, midX, FIELD_Y + 64)
  ctx.fillStyle = '#b04a3a'
  ctx.font = 'bold 26px "Malgun Gothic", sans-serif'
  ctx.fillText('한국사 스티커북 · 시간여행 다이어리', midX, FIELD_Y + 106)

  /* 도장은 확인 문장 아래·기관명 오른쪽의 빈 자리에 찍는다.
   * 회전 때문에 실제 차지하는 폭이 커지므로 그만큼 안쪽으로 당겨 배치한다. */
  if (seal) {
    const size = 92
    const angle = (-10 * Math.PI) / 180
    const half = (size / 2) * (Math.abs(Math.cos(angle)) + Math.abs(Math.sin(angle)))
    ctx.save()
    ctx.translate(SAFE.right - half - 8, SAFE.bottom - half - 6)
    ctx.rotate(angle)
    ctx.drawImage(seal, -size / 2, -size / 2, size, size)
    ctx.restore()
  }

  const a = document.createElement('a')
  a.href = canvas.toDataURL('image/png')
  a.download = '한국사스티커북_수료증.png'
  a.click()
}

/** 모은 기록을 숫자 나열이 아니라 한 문단의 서술로 바꾼다.
 *  수료증은 성적표가 아니라 "무엇을 해냈는지"를 말해 주는 문서라야 한다. */
function citationFor(v: {
  stages: number
  totalStages: number
  stickers: number
  totalStickers: number
  answered: number
  correct: number
  notes: number
}): string {
  const parts: string[] = []

  parts.push(
    v.stages >= v.totalStages
      ? `선사부터 근현대까지 ${v.totalStages}개 시대를 모두 돌아보며`
      : `${v.stages}개 시대를 탐험하며`,
  )
  parts.push(`유물 스티커 ${v.stickers}개를 모았고`)

  if (v.answered > 0) {
    parts.push(`${v.answered}개의 물음 가운데 ${v.correct}개를 첫 도전에 스스로 풀어냈습니다.`)
  } else {
    parts.push('유물을 하나하나 살펴보았습니다.')
  }

  const second =
    v.notes > 0
      ? `특히 다이어리 ${v.notes}쪽에 자기 말로 설명을 남겨, 본 것을 남에게 전할 수 있음을 보였습니다.`
      : '유물을 관찰하고 그렇게 생각한 까닭을 찾아가는 태도를 보였습니다.'

  return `${parts.join(' ')} ${second} 이에 유물을 관찰하고 근거를 들어 설명할 수 있으므로, 위 어린이가 어린이 역사 큐레이터의 자격을 갖추었음을 확인합니다.`
}

/** 발급일. 수료증답게 오늘 날짜를 찍는다 */
function todayText(): string {
  const d = new Date()
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
}

export function CompletionPage() {
  const { save, goTo, resetAll } = useGame()
  const [confirmReset, setConfirmReset] = useState(false)

  const answered = Object.values(save.questionResults)
  const correctCount = answered.filter(Boolean).length
  const diaryNotes = Object.values(save.diary).filter((p) => p.note.trim().length > 0).length
  const title = titleFor(save.completedStages.length)
  const citation = citationFor({
    stages: save.completedStages.length,
    totalStages: STAGES.length,
    stickers: save.earnedStickers.length,
    totalStickers: STICKERS.length,
    answered: answered.length,
    correct: correctCount,
    notes: diaryNotes,
  })

  return (
    <div className="screen completion">
      <img src={bgSrc(SCREEN_BG.completion)} alt="" className="screen__bg" />
      <div className="screen__content completion__content">
        <Confetti />
        <PaperCard className="completion__cert">
          <p className="completion__cert-head">수료증</p>
          {/* 칭호는 글자 대신 그림 글자를 도장처럼 찍는다 */}
          <h1 className="completion__title">
            <AssetImage src={iconSrc(A.curatorLogo)} alt={title} className="completion__logo" />
          </h1>
          <p className="completion__citation">{citation}</p>
          <div className="cert-fields" aria-label="학년 반 번호 이름 적는 곳">
            <span className="cert-field">
              <span className="cert-field__line" /> 학년
            </span>
            <span className="cert-field">
              <span className="cert-field__line" /> 반
            </span>
            <span className="cert-field">
              <span className="cert-field__line" /> 번
            </span>
            <span className="cert-field cert-field--name">
              이름 <span className="cert-field__line cert-field__line--long" />
            </span>
          </div>
          <p className="completion__issued">
            <span className="completion__date">{todayText()}</span>
            <span className="completion__issuer">한국사 스티커북 · 시간여행 다이어리</span>
          </p>
          <div className="completion__seal" aria-hidden="true">
            <AssetImage src={iconSrc(A.stamp)} alt="" className="completion__seal-img" />
          </div>
        </PaperCard>
        <div className="completion__actions">
          <AppButton
            onClick={() =>
              downloadCertificate(citation, todayText())
            }
          >
            🏅 수료증 저장하기
          </AppButton>
          <AppButton variant="secondary" onClick={() => goTo('diaryShow')}>
            내 다이어리 다시 보기
          </AppButton>
          <AppButton variant="ghost" onClick={() => goTo('main')}>
            처음으로
          </AppButton>
          <AppButton variant="ghost" onClick={() => setConfirmReset(true)}>
            기록 초기화
          </AppButton>
        </div>
      </div>
      <Modal open={confirmReset} onClose={() => setConfirmReset(false)}>
        <div className="stage-complete">
          <h2>정말 처음부터 다시 시작할까요?</h2>
          <p>모든 스티커와 다이어리, 진행 기록이 사라져요. 되돌릴 수 없어요.</p>
          <div className="stage-complete__actions">
            <AppButton onClick={resetAll}>네, 초기화할게요</AppButton>
            <AppButton variant="secondary" onClick={() => setConfirmReset(false)}>
              아니요
            </AppButton>
          </div>
        </div>
      </Modal>
    </div>
  )
}
