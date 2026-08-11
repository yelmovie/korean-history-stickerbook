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
function downloadCertificate(title: string, stats: { label: string; value: string }[]) {
  const W = 1200
  const H = 850
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  // 종이 바탕
  ctx.fillStyle = '#fdf6e5'
  ctx.fillRect(0, 0, W, H)
  ctx.strokeStyle = '#d6a84f'
  ctx.lineWidth = 10
  ctx.strokeRect(28, 28, W - 56, H - 56)
  ctx.strokeStyle = '#10233f'
  ctx.lineWidth = 3
  ctx.strokeRect(46, 46, W - 92, H - 92)
  ctx.textAlign = 'center'
  ctx.fillStyle = '#2e6e6a'
  ctx.font = 'bold 34px "Malgun Gothic", sans-serif'
  ctx.fillText('수 료 증', W / 2, 140)
  ctx.fillStyle = '#10233f'
  ctx.font = 'bold 64px "Malgun Gothic", sans-serif'
  ctx.fillText(title, W / 2, 235)
  ctx.fillStyle = '#2b2118'
  ctx.font = '30px "Malgun Gothic", sans-serif'
  ctx.fillText('한국사 스티커북 · 시간여행 다이어리', W / 2, 300)
  // 손으로 쓰는 칸
  ctx.textAlign = 'left'
  ctx.font = '32px "Malgun Gothic", sans-serif'
  ctx.fillText('학년        반        번    이름', 210, 400)
  ctx.strokeStyle = '#6b4528'
  ctx.lineWidth = 2
  for (const [x, w] of [[150, 55], [300, 55], [430, 55], [590, 320]] as const) {
    ctx.beginPath()
    ctx.moveTo(x, 410)
    ctx.lineTo(x + w, 410)
    ctx.stroke()
  }
  // 기록
  ctx.textAlign = 'center'
  ctx.font = 'bold 28px "Malgun Gothic", sans-serif'
  stats.forEach((s, i) => {
    const x = W / 2 + (i - (stats.length - 1) / 2) * 250
    ctx.fillStyle = '#10233f'
    ctx.fillText(s.value, x, 540)
    ctx.fillStyle = '#6b4528'
    ctx.font = '22px "Malgun Gothic", sans-serif'
    ctx.fillText(s.label, x, 580)
    ctx.font = 'bold 28px "Malgun Gothic", sans-serif'
  })
  ctx.fillStyle = '#2b2118'
  ctx.font = '30px "Malgun Gothic", sans-serif'
  ctx.fillText('위 어린이는 한국사 시간여행을 훌륭하게 마쳤음을 확인합니다.', W / 2, 680)
  ctx.fillStyle = '#b04a3a'
  ctx.font = 'bold 26px "Malgun Gothic", sans-serif'
  ctx.fillText('한국사 스티커북', W / 2, 760)
  const url = canvas.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = url
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
