import { useEffect, useState } from 'react'
import { useGame } from '../game/GameContext'
import { audio } from '../utils/audio'
import { AppButton, Modal } from './common'

type SectionId = 'sound' | 'standards' | 'guide' | 'admin' | 'info'

interface TeacherData {
  curriculum: {
    subject: string
    gradeBand: string
    note: string
    standards: { code: string; area: string; text: string; stages: string[]; how: string }[]
  }
  guide: { summary: string; sections: { title: string; lines: string[] }[] }
  notice: { title: string; lines: string[] }
}

let teacherCache: TeacherData | null = null

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: 'sound', label: '♪ 소리' },
  { id: 'standards', label: '▤ 관련 성취기준' },
  { id: 'guide', label: '✎ 교사용 가이드' },
  { id: 'admin', label: '⚙ 관리자' },
  { id: 'info', label: 'ⓘ 정보' },
]

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
              onClick={() => setSection(s.id)}
            >
              {s.label}
            </button>
          ))}
        </nav>
        <div className="settings-panel__content">
          {section === 'sound' && (
            <div className="settings-section">
              {toggle('배경음악', !save.settings.bgmMuted, (on) => {
                audio.setBgmMuted(!on)
                setSetting({ bgmMuted: !on })
              })}
              {toggle('효과음', !save.settings.sfxMuted, (on) => {
                audio.setSfxMuted(!on)
                setSetting({ sfxMuted: !on })
              })}
              <p className="settings-note">화면 오른쪽 위 ♪ 아이콘은 배경음악과 효과음을 한 번에 켜고 끕니다.</p>
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
          {section === 'guide' && (
            <div className="settings-section">
              {teacher ? (
                <>
                  <p className="settings-note">{teacher.guide.summary}</p>
                  {teacher.guide.sections.map((g) => (
                    <div key={g.title} className="standard-card">
                      <p className="standard-card__code">{g.title}</p>
                      {g.lines.map((l) => (
                        <p key={l} className="standard-card__how">
                          · {l}
                        </p>
                      ))}
                    </div>
                  ))}
                </>
              ) : (
                <p className="settings-note">{loadFailed ? '가이드 자료를 불러오지 못했어요.' : '불러오는 중…'}</p>
              )}
            </div>
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
          {section === 'info' && (
            <div className="settings-section">
              {teacher ? (
                <div className="standard-card">
                  <p className="standard-card__code">{teacher.notice.title}</p>
                  {teacher.notice.lines.map((l) => (
                    <p key={l} className="standard-card__how">
                      · {l}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="settings-note">{loadFailed ? '안내 자료를 불러오지 못했어요.' : '불러오는 중…'}</p>
              )}
              <p className="settings-note">
                대상: 초등 5~6학년(4학년 심화) · 구성: 시대별 스테이지 5개 + 역사 다이어리 · 저장: 이 기기의
                브라우저(localStorage), 서버 전송 없음
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
