import type { LetterState } from '../types'

export function evaluateGuess(guess: string, target: string): LetterState[] {
  const result: LetterState[] = Array(target.length).fill('absent')
  const remaining = target.split('')

  // Pass 1: exact matches (green)
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === target[i]) {
      result[i] = 'correct'
      remaining[i] = '#'
    }
  }

  // Pass 2: present in wrong position (yellow)
  for (let i = 0; i < guess.length; i++) {
    if (result[i] === 'correct') continue
    const idx = remaining.indexOf(guess[i])
    if (idx !== -1) {
      result[i] = 'present'
      remaining[idx] = '#'
    }
  }

  return result
}
