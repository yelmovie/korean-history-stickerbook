import { useState } from 'react'
import { AssetImage } from '../components/AssetImage'
import { AppButton, Modal, PaperCard } from '../components/common'
import { bgSrc, iconSrc, SCREEN_BG, A } from '../data/assets'
import { QUESTIONS } from '../data/questions'
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

/** 화면에 보이는 수료증을 그대로 PNG로 그려 내려받는다.
 *  배경·도장 이미지가 없어도(로드 실패해도) 글자는 그려지도록 null을 허용한다. */
async function downloadCertificate(title: string, stats: { label: string; value: string }[]) {
  const W = 1200
  const H = 900
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const [bg, seal] = await Promise.all([loadImage(CERT_BG), loadImage(iconSrc(A.stamp) ?? '')])

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
  ctx.font = 'bold 34px "Malgun Gothic", sans-serif'
  ctx.fillText('수 료 증', midX, 195)
  ctx.fillStyle = '#10233f'
  ctx.font = 'bold 60px "Malgun Gothic", sans-serif'
  ctx.fillText(title, midX, 285)
  ctx.fillStyle = '#2b2118'
  ctx.font = '28px "Malgun Gothic", sans-serif'
  ctx.fillText('한국사 스티커북 · 시간여행 다이어리', midX, 340)

  // 손으로 쓰는 칸 — 밑줄과 글자를 한 덩어리로 재서 가운데에 맞춘다
  ctx.font = '30px "Malgun Gothic", sans-serif'
  ctx.textAlign = 'left'
  const FIELD_Y = 424
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

  // 기록 4칸
  ctx.textAlign = 'center'
  const statGap = (SAFE.right - SAFE.left) / stats.length
  stats.forEach((st, i) => {
    const x = midX + (i - (stats.length - 1) / 2) * statGap
    ctx.fillStyle = '#10233f'
    ctx.font = 'bold 28px "Malgun Gothic", sans-serif'
    ctx.fillText(st.value, x, 520)
    ctx.fillStyle = '#6b4528'
    ctx.font = '21px "Malgun Gothic", sans-serif'
    ctx.fillText(st.label, x, 558)
  })

  ctx.fillStyle = '#2b2118'
  ctx.font = '28px "Malgun Gothic", sans-serif'
  ctx.fillText('위 어린이는 한국사 시간여행을 훌륭하게 마쳤음을 확인합니다.', midX, 612)
  ctx.fillStyle = '#b04a3a'
  ctx.font = 'bold 26px "Malgun Gothic", sans-serif'
  ctx.fillText('한국사 스티커북', midX, 694)

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

export function CompletionPage() {
  const { save, goTo, resetAll } = useGame()
  const [confirmReset, setConfirmReset] = useState(false)

  const answered = Object.values(save.questionResults)
  const correctRate = answered.length > 0 ? Math.round((answered.filter(Boolean).length / answered.length) * 100) : 0
  const diaryNotes = Object.values(save.diary).filter((p) => p.note.trim().length > 0).length
  const title = titleFor(save.completedStages.length)

  return (
    <div className="screen completion">
      <img src={bgSrc(SCREEN_BG.completion)} alt="" className="screen__bg" />
      <div className="screen__content completion__content">
        <AssetImage src={iconSrc(A.curatorLogo)} alt="어린이 역사 큐레이터" className="completion__logo" />
        <PaperCard className="completion__cert">
          <p className="completion__cert-head">수료증</p>
          <h1 className="completion__title">🏅 {title}</h1>
          <p className="completion__desc">한국사 시간여행을 훌륭하게 마쳤음을 확인합니다.</p>
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
          <div className="completion__stats">
            <div className="completion__stat">
              <span className="completion__stat-num">
                {save.earnedStickers.length}/{STICKERS.length}
              </span>
              <span className="completion__stat-label">모은 스티커</span>
            </div>
            <div className="completion__stat">
              <span className="completion__stat-num">
                {save.completedStages.length}/{STAGES.length}
              </span>
              <span className="completion__stat-label">완료한 시대</span>
            </div>
            <div className="completion__stat">
              <span className="completion__stat-num">{correctRate}%</span>
              <span className="completion__stat-label">
                첫 도전 정답률 ({answered.length}/{QUESTIONS.length}문제)
              </span>
            </div>
            <div className="completion__stat">
              <span className="completion__stat-num">{diaryNotes}/5</span>
              <span className="completion__stat-label">다이어리 한 줄 설명</span>
            </div>
          </div>
          <div className="completion__seal" aria-hidden="true">
            <AssetImage src={iconSrc(A.stamp)} alt="" className="completion__seal-img" />
          </div>
        </PaperCard>
        <div className="completion__actions">
          <AppButton
            onClick={() =>
              downloadCertificate(title, [
                { label: '모은 스티커', value: `${save.earnedStickers.length}/${STICKERS.length}` },
                { label: '완료한 시대', value: `${save.completedStages.length}/${STAGES.length}` },
                { label: '첫 도전 정답률', value: `${correctRate}%` },
                { label: '다이어리 한 줄 설명', value: `${diaryNotes}/5` },
              ])
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
