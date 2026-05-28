import type { LetterState } from '../types'

interface Props {
  word: string
  length: number
  evaluation?: LetterState[]
  isActive?: boolean
  shake?: boolean
}

const TILE_CLASSES: Record<LetterState, string> = {
  correct: 'bg-correct  border-correct  text-white',
  present: 'bg-present  border-present  text-white',
  absent:  'bg-absent   border-absent   text-white',
  empty:   'bg-white    border-gray-300 text-gray-900',
}

export function GameRow({ word, length, evaluation, isActive, shake }: Props) {
  const tiles = Array.from({ length }, (_, i) => ({
    letter: word[i] ?? '',
    state: (evaluation?.[i] ?? 'empty') as LetterState,
  }))

  return (
    <div className={`flex gap-1.5 ${shake ? 'row-shake' : ''}`}>
      {tiles.map((tile, i) => (
        <div
          key={i}
          className={`
            w-12 h-12 border-2 flex items-center justify-center
            text-xl font-bold uppercase rounded
            transition-colors duration-500
            ${TILE_CLASSES[tile.state]}
            ${isActive && tile.letter ? 'tile-pop' : ''}
          `}
        >
          {tile.letter}
        </div>
      ))}
    </div>
  )
}
