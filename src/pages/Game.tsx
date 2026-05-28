import { useState, useEffect, useCallback } from 'react'
import { useGame } from '../hooks/useGame'
import { getRandomWord, getKeyboardState } from '../utils/wordUtils'
import { playTypeClick, playCorrect, playWrong } from '../utils/sounds'
import { HintBox } from '../components/HintBox'
import { GameBoard } from '../components/GameBoard'
import { Keyboard } from '../components/Keyboard'
import { ResultModal } from '../components/ResultModal'
import type { Topic, WordEntry } from '../types'

interface Props {
  topics: Topic[]
  onHome: () => void
}

function todayKey() {
  return `streak-${new Date().toISOString().slice(0, 10)}`
}

export function Game({ topics, onHome }: Props) {
  const [wordEntry, setWordEntry] = useState<WordEntry>(() => getRandomWord(topics))
  const [shake, setShake] = useState(false)
  const game = useGame(wordEntry)

  // Increment daily streak on win + play result sound
  useEffect(() => {
    if (game.status === 'won') {
      const key = todayKey()
      localStorage.setItem(key, String(Number(localStorage.getItem(key) ?? 0) + 1))
      playCorrect()
    } else if (game.status === 'lost') {
      playWrong()
    }
  }, [game.status])

  const handleSubmit = useCallback(() => {
    if (game.currentGuess.length !== wordEntry.word.length) {
      setShake(true)
      setTimeout(() => setShake(false), 400)
    } else {
      game.submitGuess()
    }
  }, [game, wordEntry.word.length])

  const nextWord = useCallback(() => {
    setWordEntry(getRandomWord(topics))
  }, [topics])

  // Physical keyboard handler
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (game.status !== 'playing') {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); nextWord() }
        return
      }
      if (e.key === 'Enter')          handleSubmit()
      else if (e.key === 'Backspace') game.deleteLetter()
      else if (/^[a-zA-Z]$/.test(e.key)) { game.addLetter(e.key); playTypeClick() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleSubmit, game, nextWord])

  const keyState = getKeyboardState(game.guesses, game.evaluations)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 py-3 px-4 flex items-center justify-between">
        <button onClick={onHome} className="text-sm text-gray-500 hover:text-gray-700">
          ← 홈
        </button>
        <h1 className="font-bold text-gray-800">은성이 영어퀴즈</h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 flex flex-col items-center gap-4 py-4 px-2 pb-6">
        <HintBox wordEntry={wordEntry} revealed={game.status !== 'playing'} />
        <div className="flex gap-3 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <span className="inline-block w-4 h-4 rounded bg-correct" />
            정확한 위치
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-4 h-4 rounded bg-present" />
            위치 틀림
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-4 h-4 rounded bg-absent" />
            없는 글자
          </span>
        </div>
        <GameBoard
          wordLength={wordEntry.word.length}
          guesses={game.guesses}
          evaluations={game.evaluations}
          currentGuess={game.currentGuess}
          shake={shake}
        />
        <div className="mt-auto w-full max-w-md">
          <Keyboard
            keyState={keyState}
            onLetter={(l) => { game.addLetter(l); playTypeClick() }}
            onDelete={game.deleteLetter}
            onEnter={handleSubmit}
          />
        </div>
      </main>

      <ResultModal
        status={game.status}
        wordEntry={wordEntry}
        attempts={game.guesses.length}
        onNext={nextWord}
      />
    </div>
  )
}
