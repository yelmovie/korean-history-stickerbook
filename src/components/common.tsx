import { Component, type ReactNode, useEffect, useRef } from 'react'

/* ---------- AppButton ---------- */

interface AppButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  disabled?: boolean
  className?: string
  ariaLabel?: string
}

export function AppButton({ children, onClick, variant = 'primary', disabled, className, ariaLabel }: AppButtonProps) {
  return (
    <button
      type="button"
      className={`app-btn app-btn--${variant} ${className ?? ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}

/* ---------- PaperCard ---------- */

export function PaperCard({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={`paper-card ${className ?? ''}`}>{children}</div>
}

/* ---------- Modal ---------- */

interface ModalProps {
  open: boolean
  onClose?: () => void
  children: ReactNode
  className?: string
}

export function Modal({ open, onClose, children, className }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (open) ref.current?.focus()
  }, [open])
  if (!open) return null

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose?.()
      return
    }
    // 포커스 트랩: Tab이 다이얼로그 밖으로 나가지 않게 한다
    if (e.key === 'Tab' && ref.current) {
      const focusables = ref.current.querySelectorAll<HTMLElement>(
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
      )
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        ref={ref}
        className={`modal-panel paper-card ${className ?? ''}`}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        {children}
      </div>
    </div>
  )
}

/* ---------- ErrorBoundary ---------- */

interface EBState {
  error: Error | null
}

export class ErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  state: EBState = { error: null }

  static getDerivedStateFromError(error: Error): EBState {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="error-fallback">
          <div className="paper-card error-fallback__card">
            <h2>앗, 문제가 생겼어요</h2>
            <p>화면을 새로 고치면 이어서 탐험할 수 있어요. 진행 상황은 저장되어 있어요.</p>
            <button type="button" className="app-btn app-btn--primary" onClick={() => location.reload()}>
              새로 고침
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
