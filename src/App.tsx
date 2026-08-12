import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ErrorBoundary } from './components/common'
import { PhotoViewerProvider } from './components/PhotoViewer'
import { GameContext, type GameApi } from './game/GameContext'
import { CompletionPage } from './pages/CompletionPage'
import { DiaryEditorPage } from './pages/DiaryEditorPage'
import { DiaryShowcasePage } from './pages/DiaryShowcasePage'
import { MainPage } from './pages/MainPage'
import { StagePage } from './pages/StagePage'
import { StageSelectPage } from './pages/StageSelectPage'
import type { SaveData, Screen } from './types'
import { audio } from './utils/audio'
import { clearSave, defaultSave, loadSave, persistSave } from './utils/storage'

/** 와이파이가 끊겼는지 알려준다. navigator.onLine 은 "랜선/와이파이 연결 여부"라 완벽하진 않지만,
 *  교실에서 실제로 생기는 상황(공유기가 죽거나 태블릿이 망에서 떨어짐)은 이걸로 잡힌다. */
function useOffline(): boolean {
  const [offline, setOffline] = useState(() => typeof navigator !== 'undefined' && navigator.onLine === false)
  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine)
    window.addEventListener('online', sync)
    window.addEventListener('offline', sync)
    return () => {
      window.removeEventListener('online', sync)
      window.removeEventListener('offline', sync)
    }
  }, [])
  return offline
}

export default function App() {
  const initial = useRef(loadSave())
  const [save, setSave] = useState<SaveData>(initial.current.data)
  const [screen, setScreen] = useState<Screen>('main')
  const [saveFailed, setSaveFailed] = useState(false)
  const offline = useOffline()

  // 저장된 소리 설정을 시작할 때 되살린다.
  // 전체 음소거만 복원하던 탓에, 배경음·효과음을 꺼 두고 새로고침하면
  // 설정 화면에는 '꺼짐'인데 소리는 나오는 상태가 됐다.
  useEffect(() => {
    audio.setMuted(save.settings.muted)
    audio.setBgmMuted(save.settings.bgmMuted)
    audio.setSfxMuted(save.settings.sfxMuted)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    audio.playForScreen(screen)
  }, [screen])

  const update = useCallback((mutate: (draft: SaveData) => SaveData) => {
    setSave((prev) => {
      const next = mutate(prev)
      setSaveFailed(!persistSave(next))
      return next
    })
  }, [])

  const resetAll = useCallback(() => {
    clearSave()
    setSave(defaultSave())
    setScreen('main')
  }, [])

  const api = useMemo<GameApi>(
    () => ({
      save,
      update,
      goTo: setScreen,
      corrupted: initial.current.corrupted,
      hasSave: initial.current.existed,
      saveFailed,
      resetAll,
    }),
    [save, update, saveFailed, resetAll],
  )

  return (
    <GameContext.Provider value={api}>
      <div className="app-stage">
        <PhotoViewerProvider>
        <ErrorBoundary>
          {screen === 'main' && <MainPage />}
          {screen === 'stageSelect' && <StageSelectPage />}
          {(screen === 'stage1' ||
            screen === 'stage2' ||
            screen === 'stage3' ||
            screen === 'stage4' ||
            screen === 'stage5') && <StagePage key={screen} stageId={screen} />}
          {screen === 'diaryEdit' && <DiaryEditorPage />}
          {screen === 'diaryShow' && <DiaryShowcasePage />}
          {screen === 'completion' && <CompletionPage />}
        </ErrorBoundary>
        </PhotoViewerProvider>
        {saveFailed && (
          <div className="save-warning" role="alert">
            저장 공간이 부족해 진행이 저장되지 않았어요.
          </div>
        )}
        {offline && (
          <div className="offline-badge" role="status">
            오프라인 · 진행은 계속돼요
          </div>
        )}
      </div>
    </GameContext.Provider>
  )
}
