import { useState } from 'react'
import { AppButton, Modal } from './common'

/** 카카오톡·네이버 같은 '앱 안의 브라우저'.
 *  위아래를 앱 막대가 먹어 무대가 낮아지고, 홈 화면 설치도 안 된다. */
const UA = navigator.userAgent
const IN_APP = /KAKAOTALK|NAVER\(inapp|Instagram|FBAN|FBAV|FB_IAB|Line\//i.test(UA)
const IS_KAKAO = /KAKAOTALK/i.test(UA)
const IS_IOS = /iPhone|iPad|iPod/.test(UA)

/** 한 번 닫으면 그 수업 동안은 다시 뜨지 않는다.
 *  탭을 닫고 다시 열면(= 다음 수업) 새로 안내한다. */
const SEEN_KEY = 'kh_viewing_tip_seen'

/** 앱 안의 브라우저에서 바깥 브라우저로 넘긴다.
 *  기기마다 통로가 달라 한 가지 방법으로는 안 된다.
 *  어느 것도 통하지 않는 기기가 있으므로 주소 복사 안내를 늘 함께 둔다. */
function openOutside() {
  const url = window.location.href
  if (IS_KAKAO) {
    // 카카오톡 전용 통로 — 기기 기본 브라우저로 곧장 넘어간다
    window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(url)}`
    return
  }
  if (IS_IOS) {
    window.location.href = url.replace(/^https?:\/\//, 'googlechrome://')
    return
  }
  const { host, pathname, search } = window.location
  window.location.href = `intent://${host}${pathname}${search}#Intent;scheme=https;package=com.android.chrome;end`
}

/** 시작 화면에서 한 번 뜨는 안내 팝업: 가로로 눕히기 + (앱 안 브라우저일 때) 크롬으로 열기 */
export function ViewingTip() {
  const [open, setOpen] = useState(() => {
    try {
      return sessionStorage.getItem(SEEN_KEY) !== '1'
    } catch {
      // 사생활 보호 모드 등으로 못 읽어도 안내는 떠야 한다
      return true
    }
  })
  const [copied, setCopied] = useState(false)

  const close = () => {
    setOpen(false)
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {
      /* 못 적어도 그냥 닫는다 */
    }
  }

  const copyAddress = () => {
    void navigator.clipboard
      ?.writeText(window.location.href)
      .then(() => setCopied(true))
      .catch(() => setCopied(false))
  }

  return (
    <Modal open={open} onClose={close} className="viewing-tip">
      <h2 className="viewing-tip__title">이렇게 보면 가장 잘 보여요</h2>
      <p className="viewing-tip__line">
        태블릿을 <b>가로로 눕혀서</b> 전체 화면으로 봐 주세요.
      </p>
      {IN_APP && (
        <>
          <p className="viewing-tip__line viewing-tip__line--warn">
            지금은 <b>앱 안의 브라우저</b>라 위아래 막대가 화면을 가려요.
            <br />
            크롬으로 열면 더 넓게 볼 수 있어요.
          </p>
          <div className="viewing-tip__actions">
            <AppButton onClick={openOutside}>크롬으로 열기</AppButton>
            <AppButton variant="secondary" onClick={copyAddress}>
              {copied ? '✓ 주소 복사됨' : '주소 복사'}
            </AppButton>
          </div>
        </>
      )}
      <AppButton variant={IN_APP ? 'ghost' : 'primary'} onClick={close}>
        알겠어요
      </AppButton>
    </Modal>
  )
}
