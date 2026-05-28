import type { LetterState } from '../types'
import { GameRow } from './GameRow'

const MAX_GUESSES = 6

interface Props {
  wordLength: number
  guesses: string[]
  evaluations: LetterState[][]
  currentGuess: string
  shake: boolean
}

export function GameBoard({ wordLength, guesses, evaluations, currentGuess, shake }: Props) {
  const emptyCount = Math.max(0, MAX_GUESSES - guesses.length - 1)

  return (
    <div className="flex flex-col gap-1.5 items-center">
      {guesses.map((guess, i) => (
        <GameRow key={i} word={guess} length={wordLength} evaluation={evaluations[i]} />
      ))}
      {guesses.length < MAX_GUESSES && (
        <GameRow word={currentGuess} length={wordLength} isActive shake={shake} />
      )}
      {Array.from({ length: emptyCount }, (_, i) => (
        <GameRow key={`e${i}`} word="" length={wordLength} />
      ))}
    </div>
  )
}
