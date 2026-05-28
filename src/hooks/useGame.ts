import { useState, useCallback, useEffect } from 'react'
import { evaluateGuess } from '../utils/evaluateGuess'
import type { GameStatus, LetterState, WordEntry } from '../types'

const MAX_GUESSES = 6

interface State {
  wordEntry: WordEntry
  guesses: string[]
  evaluations: LetterState[][]
  currentGuess: string
  status: GameStatus
}

export function useGame(wordEntry: WordEntry) {
  const [state, setState] = useState<State>({
    wordEntry,
    guesses: [],
    evaluations: [],
    currentGuess: '',
    status: 'playing',
  })

  const addLetter = useCallback((letter: string) => {
    setState(s => {
      if (s.status !== 'playing') return s
      if (s.currentGuess.length >= s.wordEntry.word.length) return s
      return { ...s, currentGuess: s.currentGuess + letter.toUpperCase() }
    })
  }, [])

  const deleteLetter = useCallback(() => {
    setState(s => {
      if (s.status !== 'playing') return s
      return { ...s, currentGuess: s.currentGuess.slice(0, -1) }
    })
  }, [])

  const submitGuess = useCallback(() => {
    setState(s => {
      if (s.status !== 'playing') return s
      if (s.currentGuess.length !== s.wordEntry.word.length) return s

      const guess = s.currentGuess
      const evaluation = evaluateGuess(guess, s.wordEntry.word)
      const newGuesses = [...s.guesses, guess]
      const newEvaluations = [...s.evaluations, evaluation]

      let status: GameStatus = 'playing'
      if (guess === s.wordEntry.word) status = 'won'
      else if (newGuesses.length >= MAX_GUESSES) status = 'lost'

      return { ...s, guesses: newGuesses, evaluations: newEvaluations, currentGuess: '', status }
    })
  }, [])

  // Reset game state when word changes
  useEffect(() => {
    setState({
      wordEntry,
      guesses: [],
      evaluations: [],
      currentGuess: '',
      status: 'playing',
    })
  }, [wordEntry.word])

  return { ...state, addLetter, deleteLetter, submitGuess }
}
