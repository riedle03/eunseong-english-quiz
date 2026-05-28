import type { LetterState, Topic, WordEntry } from '../types'
import hobbyWords from '../data/hobby.json'
import travelWords from '../data/travel.json'
import animalsWords from '../data/animals.json'

const WORD_MAP: Record<Topic, WordEntry[]> = {
  hobby:   hobbyWords as WordEntry[],
  travel:  travelWords as WordEntry[],
  animals: animalsWords as WordEntry[],
}

export function getRandomWord(topics: Topic[]): WordEntry {
  const pool = topics.flatMap(t => WORD_MAP[t])
  return pool[Math.floor(Math.random() * pool.length)]
}

export function getKeyboardState(
  guesses: string[],
  evaluations: LetterState[][]
): Record<string, LetterState> {
  const state: Record<string, LetterState> = {}
  guesses.forEach((guess, gi) => {
    guess.split('').forEach((letter, li) => {
      const next = evaluations[gi][li]
      const current = state[letter]
      if (current === 'correct') return
      if (next === 'correct' || current !== 'present') {
        state[letter] = next
      }
    })
  })
  return state
}
