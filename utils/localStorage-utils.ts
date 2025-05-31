type GameStatistics = {
  played: number
  wins: number
  currentStreak: number
  maxStreak: number
  distribution: number[]
}

const STATS_KEY = "desletra-statistics"
const GAME_KEY = "gameStored"

export function getStatistics(): GameStatistics | null {
  const raw = localStorage.getItem(STATS_KEY)
  return raw ? JSON.parse(raw) : null
}

export function saveStatistics(stats: GameStatistics) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats))
}

export function updateStatistics(stats: GameStatistics, ganhou: boolean, tentativas: number): GameStatistics {
  const updated = { ...stats }
  updated.played += 1

  if (ganhou) {
    updated.wins += 1
    updated.currentStreak += 1
    updated.maxStreak = Math.max(updated.maxStreak, updated.currentStreak)
    updated.distribution[tentativas] += 1
  } else {
    updated.currentStreak = 0
  }

  saveStatistics(updated)
  return updated
}

// --- GAME STATE ---

export function getGameState<T = any>(): T | null {
  const raw = localStorage.getItem(GAME_KEY)
  return raw ? JSON.parse(raw) : null
}

export function saveGameState(partial: Partial<any>) {
  const current = getGameState() || {}
  const updated = { ...current, ...partial }
  localStorage.setItem(GAME_KEY, JSON.stringify(updated))
}
