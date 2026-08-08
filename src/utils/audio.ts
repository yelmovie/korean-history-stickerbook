import type { Screen } from '../types'

const BGM_BASE = '/assets/sound/'
const SFX_BASE = '/assets/sound/sfx/'
const BGM_VOLUME = 0.3
const SFX_VOLUME = 0.5

/** 화면 → BGM 트랙 파일명. 없는 화면은 직전 트랙 유지 */
const SCREEN_BGM: Partial<Record<Screen, string>> = {
  main: 'main_theme.mp3',
  stageSelect: 'main_theme.mp3',
  stage1: 'stage1.mp3',
  stage2: 'stage2.mp3',
  stage3: 'stage3.mp3',
  stage4: 'stage4.mp3',
  stage5: 'stage5.mp3',
  diaryEdit: 'main_theme.mp3',
  diaryShow: 'main_theme.mp3',
  completion: 'main_theme.mp3',
}

export type SfxName = 'correct' | 'wrong' | 'sticker' | 'page' | 'snap'

/** 전체 음소거(우상단 아이콘) + BGM/SFX 개별 음소거(설정 패널) */
class AudioManager {
  private bgm: HTMLAudioElement | null = null
  private currentTrack = ''
  private _muted = false
  private _bgmMuted = false
  private _sfxMuted = false
  private unlocked = false
  private sfxCache = new Map<string, HTMLAudioElement>()

  constructor() {
    // 브라우저 자동재생 제한: 첫 사용자 입력 후 BGM 재생을 재시도한다
    const unlock = () => {
      this.unlocked = true
      this.applyBgmState()
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
    window.addEventListener('pointerdown', unlock)
    window.addEventListener('keydown', unlock)
  }

  get muted(): boolean {
    return this._muted
  }

  get bgmMuted(): boolean {
    return this._bgmMuted
  }

  get sfxMuted(): boolean {
    return this._sfxMuted
  }

  setMuted(muted: boolean): void {
    this._muted = muted
    this.applyBgmState()
  }

  setBgmMuted(muted: boolean): void {
    this._bgmMuted = muted
    this.applyBgmState()
  }

  setSfxMuted(muted: boolean): void {
    this._sfxMuted = muted
  }

  private bgmSilenced(): boolean {
    return this._muted || this._bgmMuted
  }

  private applyBgmState(): void {
    if (!this.bgm) return
    if (this.bgmSilenced()) this.bgm.pause()
    else if (this.unlocked) void this.bgm.play().catch(() => {})
  }

  /** 화면에 맞는 BGM으로 전환. 같은 트랙이면 그대로 둔다(중복 재생 방지) */
  playForScreen(screen: Screen): void {
    const track = SCREEN_BGM[screen]
    if (!track || track === this.currentTrack) return
    this.currentTrack = track
    if (this.bgm) {
      this.bgm.pause()
      this.bgm = null
    }
    try {
      const audio = new Audio(BGM_BASE + track)
      audio.loop = true
      audio.volume = BGM_VOLUME
      this.bgm = audio
      if (!this.bgmSilenced() && this.unlocked) void audio.play().catch(() => {})
    } catch {
      this.bgm = null
    }
  }

  playSfx(name: SfxName): void {
    if (this._muted || this._sfxMuted) return
    try {
      let audio = this.sfxCache.get(name)
      if (!audio) {
        audio = new Audio(`${SFX_BASE}${name}.mp3`)
        audio.volume = SFX_VOLUME
        this.sfxCache.set(name, audio)
      }
      audio.currentTime = 0
      void audio.play().catch(() => {})
    } catch {
      // 파일이 없어도 앱은 계속 동작
    }
  }
}

export const audio = new AudioManager()
