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

export default function App() {
  const initial = useRef(loadSave())
  const [save, setSave] = useState<SaveData>(initial.current.data)
  const [screen, setScreen] = useState<Screen>('main')
  const [saveFailed, setSaveFailed] = useState(false)

  useEffect(() => {
    audio.setMuted(save.settings.muted)
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
      </div>
    </GameContext.Provider>
  )
}
