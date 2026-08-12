import { useEffect, useState, type CSSProperties } from 'react'
import { useGame } from '../game/GameContext'
import { audio } from '../utils/audio'
import { AppButton, Modal } from './common'

type SectionId = 'sound' | 'standards' | 'student' | 'guide' | 'admin' | 'feedback' | 'info'

interface GuideBlock {
  summary: string
  sections: { title: string; lines: string[] }[]
}

interface LineBlock {
  title: string
  lines: string[]
}

interface TeacherData {
  curriculum: {
    subject: string
    gradeBand: string
    note: string
    standards: { code: string; area: string; text: string; stages: string[]; how: string }[]
  }
  studentGuide: GuideBlock
  guide: GuideBlock
  feedback: { title: string; intro: string; template: string[]; howTo: string[] }
  notice: LineBlock
  credit: LineBlock
}

let teacherCache: TeacherData | null = null

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: 'sound', label: '♪ 소리' },
  { id: 'standards', label: '▤ 관련 성취기준' },
  { id: 'student', label: '☺ 학생용 가이드' },
  { id: 'guide', label: '✎ 교사용 가이드' },
  { id: 'admin', label: '⚙ 관리자' },
  { id: 'feedback', label: '✉ 의견 보내기' },
  { id: 'info', label: 'ⓘ 정보' },
]

/** 볼륨 막대: 전용 CSS를 추가할 수 없어(다른 작업과 충돌) 기존 행 스타일에 최소 인라인만 얹는다 */
const SLIDER_STYLE: CSSProperties ={
  flex: 1,
  minWidth: 0,
  minHeight: 44,
  accentColor: 'var(--color-teal)',
  cursor: 'pointer',
}
const SLIDER_VALUE_STYLE: CSSProperties ={ minWidth: '6cqw', textAlign: 'right' }

/** 받는 사람 주소. 화면에 그대로 적지 않기 위해 조각으로 나눠 두고 보낼 때만 합친다.
 *  (수집 로봇이 소스에서 통문자로 긁어가는 것을 조금이라도 늦추기 위한 것이고,
 *   완전한 은닉은 아니다 — 화면에 노출하지 않는 것이 목적이다) */
const MAIL_PARTS = ['bongbiyobi', '@', 'gmail', '.', 'com']
const feedbackAddress = () => MAIL_PARTS.join('')

/** 욕설·협박처럼 앱과 상관없는 내용은 보내지 않는다.
 *  학생이 쓸 수도 있는 화면이라 최소한의 거름망을 둔다. 완벽한 필터가 아니라
 *  홧김에 눌러 보내는 것을 한 번 멈춰 세우는 정도이며, 과하게 막으면 정상 제보까지 걸린다. */
const BAD_WORDS = [
  // 욕설·비속어
  '시발', '씨발', 'ㅅㅂ', '병신', 'ㅂㅅ', '지랄', '개새', '새끼', '좆', '엿먹',
  '꺼져', 'fuck', 'shit', 'bitch', 'asshole',
  // 협박성 표현
  '죽여', '죽인다', '죽을래', '패버', '가만안', '테러', '폭파',
]

function findBadWord(text: string): string | null {
  const flat = text.toLowerCase().replace(/\s/g, '')
  return BAD_WORDS.find((w) => flat.includes(w)) ?? null
}

interface Props {
  open: boolean
  onClose: () => void
}

/** 통합 설정 패널 (title-screen 표준: 좌측 메뉴 + 우측 내용, 관리자 잠금 없음) */
export function SettingsPanel({ open, onClose }: Props) {
  const { save, update, resetAll } = useGame()
  const [section, setSection] = useState<SectionId>('sound')
  const [teacher, setTeacher] = useState<TeacherData | null>(teacherCache)
  const [loadFailed, setLoadFailed] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const [bgmLevel, setBgmLevel] = useState(audio.bgmVolume)
  const [sfxLevel, setSfxLevel] = useState(audio.sfxVolume)
  const [copied, setCopied] = useState(false)
  const [feedbackText, setFeedbackText] = useState('')
  /** 욕설이 섞여 보내기가 막혔는지 */
  const [blocked, setBlocked] = useState(false)

  useEffect(() => {
    if (!open || teacherCache) return
    fetch('/data/teacher.json')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: TeacherData) => {
        teacherCache = d
        setTeacher(d)
      })
      .catch(() => setLoadFailed(true))
  }, [open])

  const setSetting = (patch: Partial<typeof save.settings>) => {
    update((d) => ({ ...d, settings: { ...d.settings, ...patch } }))
  }

  const toggle = (label: string, value: boolean, onChange: (v: boolean) => void) => (
    <div className="settings-toggle">
      <span className="settings-toggle__label">{label}</span>
      <button
        type="button"
        className={`settings-toggle__btn ${value ? 'settings-toggle__btn--on' : ''}`}
        onClick={() => onChange(!value)}
        aria-pressed={value}
      >
        {value ? '켜짐' : '꺼짐'}
      </button>
    </div>
  )

  const slider = (label: string, value: number, onChange: (v: number) => void) => (
    <div className="settings-toggle">
      <span className="settings-toggle__label">{label}</span>
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={Math.round(value * 100)}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
        aria-label={label}
        aria-valuetext={`${Math.round(value * 100)}퍼센트`}
        style={SLIDER_STYLE}
      />
      <span className="settings-toggle__label" style={SLIDER_VALUE_STYLE}>
        {Math.round(value * 100)}%
      </span>
    </div>
  )

  // 볼륨 0 = 꺼짐. 막대와 켬/끔 토글이 서로 다른 상태를 보이지 않게 항상 함께 움직인다
  const changeBgm = (level: number) => {
    setBgmLevel(level)
    audio.setBgmVolume(level)
    audio.setBgmMuted(level === 0)
    setSetting({ bgmMuted: level === 0 })
  }

  const changeSfx = (level: number) => {
    setSfxLevel(level)
    audio.setSfxVolume(level)
    audio.setSfxMuted(level === 0)
    setSetting({ sfxMuted: level === 0 })
  }

  const copyFeedbackForm = () => {
    if (!teacher) return
    const text = teacher.feedback.template.join('\n')
    void navigator.clipboard
      ?.writeText(text)
      .then(() => setCopied(true))
      .catch(() => setCopied(false))
  }

  /** 메일 앱을 열어 양식을 채운 채로 띄운다.
   *  받는 주소는 화면에 찍지 않고 링크를 만들 때만 조립한다. */
  const sendFeedbackMail = () => {
    if (!teacher) return
    const body = feedbackText.trim() || teacher.feedback.template.join('\n')
    const bad = findBadWord(body)
    if (bad) {
      setBlocked(true)
      return
    }
    setBlocked(false)
    const subject = '[한국사 스티커북] 의견 보내기'
    window.location.href = `mailto:${feedbackAddress()}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const renderGuide = (block: GuideBlock | undefined, failText: string) =>
    block ? (
      <>
        <p className="settings-note">{block.summary}</p>
        {block.sections.map((g, i) => (
          <details key={g.title} className="standard-card standard-card--toggle" open={i === 0}>
            <summary className="standard-card__summary">
              <span className="standard-card__code">{g.title}</span>
              <span className="standard-card__chevron" aria-hidden="true">
                ▼
              </span>
            </summary>
            {g.lines.map((l) => (
              <p key={l} className="standard-card__how">
                · {l}
              </p>
            ))}
          </details>
        ))}
      </>
    ) : (
      <p className="settings-note">{loadFailed ? failText : '불러오는 중…'}</p>
    )

  const renderLines = (block: LineBlock) => (
    <div className="standard-card">
      <p className="standard-card__code">{block.title}</p>
      {block.lines.map((l) => (
        <p key={l} className="standard-card__how">
          · {l}
        </p>
      ))}
    </div>
  )

  return (
    <Modal open={open} onClose={onClose} className="settings-panel">
      <div className="settings-panel__head">
        <h2>설정</h2>
        <AppButton variant="ghost" onClick={onClose} ariaLabel="설정 닫기">
          ✕ 닫기
        </AppButton>
      </div>
      <div className="settings-panel__body">
        <nav className="settings-panel__menu" aria-label="설정 메뉴">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`settings-menu-item ${section === s.id ? 'settings-menu-item--active' : ''}`}
              onClick={() => {
                setSection(s.id)
                setCopied(false)
              }}
            >
              {s.label}
            </button>
          ))}
        </nav>
        <div className="settings-panel__content">
          {section === 'sound' && (
            <div className="settings-section">
              {toggle('배경음악', !save.settings.bgmMuted, (on) => {
                // 꺼진 상태에서 켤 때 볼륨이 0이면 소리가 안 나므로 기본값으로 되돌린다
                if (on && bgmLevel === 0) changeBgm(1)
                else {
                  audio.setBgmMuted(!on)
                  setSetting({ bgmMuted: !on })
                }
              })}
              {slider('배경음악 크기', bgmLevel, changeBgm)}
              {toggle('효과음', !save.settings.sfxMuted, (on) => {
                if (on && sfxLevel === 0) changeSfx(1)
                else {
                  audio.setSfxMuted(!on)
                  setSetting({ sfxMuted: !on })
                }
              })}
              {slider('효과음 크기', sfxLevel, changeSfx)}
              <p className="settings-note">
                화면 오른쪽 위 ♪ 아이콘은 배경음악과 효과음을 한 번에 켜고 끕니다. 막대를 0%로 내리면 해당 소리가 꺼짐으로
                바뀌고, 크기는 이 기기에 저장됩니다.
              </p>
            </div>
          )}
          {section === 'standards' && (
            <div className="settings-section">
              {teacher ? (
                <>
                  <p className="settings-note">
                    {teacher.curriculum.subject} · {teacher.curriculum.gradeBand}
                  </p>
                  {teacher.curriculum.standards.map((s, i) => (
                    <details key={s.code} className="standard-card standard-card--toggle" open={i === 0}>
                      <summary className="standard-card__summary">
                        <span className="standard-card__code">
                          {s.code} <span className="standard-card__area">{s.area}</span>
                        </span>
                        <span className="standard-card__chevron" aria-hidden="true">
                          ▼
                        </span>
                      </summary>
                      <p className="standard-card__text">{s.text}</p>
                      <p className="standard-card__how">
                        <strong>{s.stages.join(' · ')}</strong> — {s.how}
                      </p>
                    </details>
                  ))}
                  <p className="settings-note">{teacher.curriculum.note}</p>
                </>
              ) : (
                <p className="settings-note">{loadFailed ? '성취기준 자료를 불러오지 못했어요.' : '불러오는 중…'}</p>
              )}
            </div>
          )}
          {section === 'student' && (
            <div className="settings-section">
              {renderGuide(teacher?.studentGuide, '학생용 가이드를 불러오지 못했어요.')}
            </div>
          )}
          {section === 'guide' && (
            <div className="settings-section">{renderGuide(teacher?.guide, '가이드 자료를 불러오지 못했어요.')}</div>
          )}
          {section === 'admin' && (
            <div className="settings-section">
              {toggle('전체 스테이지 해금 (교사용)', save.settings.unlockAll, (on) => setSetting({ unlockAll: on }))}
              <p className="settings-note">
                해금은 잠금만 풀어 줍니다. 학생이 모은 스티커와 진행 기록은 그대로 유지됩니다.
              </p>
              <hr className="settings-divider" />
              <AppButton variant="ghost" className="danger-btn" onClick={() => setConfirmReset(true)}>
                진행도 초기화
              </AppButton>
              <p className="settings-note">모든 스티커·다이어리·기록이 지워지며 되돌릴 수 없습니다.</p>
            </div>
          )}
          {section === 'feedback' && (
            <div className="settings-section">
              {teacher ? (
                <>
                  <p className="settings-note">{teacher.feedback.intro}</p>
                  <label className="settings-note" htmlFor="feedback-text">
                    {teacher.feedback.title}
                  </label>
                  <textarea
                    id="feedback-text"
                    className="feedback-input"
                    rows={6}
                    value={feedbackText}
                    placeholder={teacher.feedback.template.join('\n')}
                    onChange={(e) => {
                      setFeedbackText(e.target.value)
                      setBlocked(false)
                    }}
                  />
                  {blocked && (
                    <p className="feedback-blocked" role="alert">
                      거친 말이나 앱과 상관없는 내용이 들어 있어요. 고쳤으면 하는 점을 적어서 다시 눌러 주세요.
                    </p>
                  )}
                  <div className="feedback-actions">
                    <AppButton onClick={sendFeedbackMail}>✉ 메일로 보내기</AppButton>
                    <AppButton variant="secondary" onClick={copyFeedbackForm}>
                      {copied ? '✓ 복사했어요' : '양식 복사하기'}
                    </AppButton>
                  </div>
                  {teacher.feedback.howTo.map((l) => (
                    <p key={l} className="settings-note">
                      · {l}
                    </p>
                  ))}
                </>
              ) : (
                <p className="settings-note">{loadFailed ? '의견 보내기 안내를 불러오지 못했어요.' : '불러오는 중…'}</p>
              )}
            </div>
          )}
          {section === 'info' && (
            <div className="settings-section">
              {teacher ? (
                <>
                  {renderLines(teacher.notice)}
                  {renderLines(teacher.credit)}
                </>
              ) : (
                <p className="settings-note">{loadFailed ? '안내 자료를 불러오지 못했어요.' : '불러오는 중…'}</p>
              )}
              <p className="settings-note">
                구성: 시대별 스테이지 5개 + 역사 다이어리 · 저장: 이 기기의 브라우저(localStorage), 서버 전송 없음
              </p>
            </div>
          )}
        </div>
      </div>
      {confirmReset && (
        <div className="modal-backdrop" role="presentation">
          <div className="modal-panel paper-card stage-complete" role="dialog" aria-modal="true">
            <h2>정말 초기화할까요?</h2>
            <p>모든 스티커와 다이어리, 진행 기록이 사라져요. 되돌릴 수 없어요.</p>
            <div className="stage-complete__actions">
              <AppButton
                className="danger-btn"
                onClick={() => {
                  setConfirmReset(false)
                  onClose()
                  resetAll()
                }}
              >
                네, 초기화할게요
              </AppButton>
              <AppButton variant="secondary" onClick={() => setConfirmReset(false)}>
                아니요
              </AppButton>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}
