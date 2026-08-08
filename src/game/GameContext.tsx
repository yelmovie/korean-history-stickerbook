import { createContext, useContext } from 'react'
import type { SaveData, Screen } from '../types'

export interface GameApi {
  save: SaveData
  /** 저장 데이터를 갱신하고 localStorage에 반영한다 */
  update: (mutate: (draft: SaveData) => SaveData) => void
  goTo: (screen: Screen) => void
  /** 시작 시 저장 데이터가 깨져 있어 초기화됐는지 */
  corrupted: boolean
  /** 이어하기 가능한 저장이 있었는지 */
  hasSave: boolean
  /** 마지막 저장 시도가 실패했는지 (용량 초과 등) */
  saveFailed: boolean
  resetAll: () => void
}

export const GameContext = createContext<GameApi | null>(null)

export function useGame(): GameApi {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameContext')
  return ctx
}
