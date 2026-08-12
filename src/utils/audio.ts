import type { Screen } from '../types'

const BGM_BASE = '/assets/sound/'
const SFX_BASE = '/assets/sound/sfx/'
/** 볼륨 막대 100%일 때의 실제 재생 크기. 막대 값(0~1)을 여기에 곱해 쓴다 */
const BGM_MAX_VOLUME = 0.3
const SFX_MAX_VOLUME = 0.5
/** 볼륨은 save.settings와 별도 키에 둔다(저장 스키마 변경 없이 값만 보존) */
const VOLUME_KEY = 'kh_volume_v1'

interface VolumeLevels {
  bgm: number
  sfx: number
}

function clamp01(v: number): number {
  return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 1
}

function loadLevels(): VolumeLevels {
  try {
    const raw = localStorage.getItem(VOLUME_KEY)
    if (!raw) return { bgm: 1, sfx: 1 }
    const parsed = JSON.parse(raw) as Partial<VolumeLevels>
    return { bgm: clamp01(Number(parsed.bgm)), sfx: clamp01(Number(parsed.sfx)) }
  } catch {
    return { bgm: 1, sfx: 1 }
  }
}

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
  private levels: VolumeLevels = loadLevels()

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

  /** 볼륨 막대 값(0~1). 실제 재생 크기는 여기에 BGM/SFX_MAX_VOLUME을 곱한 값 */
  get bgmVolume(): number {
    return this.levels.bgm
  }

  get sfxVolume(): number {
    return this.levels.sfx
  }

  setBgmVolume(level: number): void {
    this.levels.bgm = clamp01(level)
    if (this.bgm) this.bgm.volume = this.levels.bgm * BGM_MAX_VOLUME
    this.persistLevels()
  }

  setSfxVolume(level: number): void {
    this.levels.sfx = clamp01(level)
    for (const el of this.sfxCache.values()) el.volume = this.levels.sfx * SFX_MAX_VOLUME
    this.persistLevels()
  }

  private persistLevels(): void {
    try {
      localStorage.setItem(VOLUME_KEY, JSON.stringify(this.levels))
    } catch {
      // 저장이 막혀 있어도(사생활 보호 모드 등) 이번 세션 볼륨은 그대로 동작한다
    }
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
      audio.volume = this.levels.bgm * BGM_MAX_VOLUME
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
        this.sfxCache.set(name, audio)
      }
      audio.volume = this.levels.sfx * SFX_MAX_VOLUME
      audio.currentTime = 0
      void audio.play().catch(() => {})
    } catch {
      // 파일이 없어도 앱은 계속 동작
    }
  }
}

export const audio = new AudioManager()
