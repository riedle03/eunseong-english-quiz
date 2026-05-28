import type { LetterState } from '../types'

interface Props {
  keyState: Record<string, LetterState>
  onLetter: (letter: string) => void
  onDelete: () => void
  onEnter: () => void
}

const ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['ENTER','Z','X','C','V','B','N','M','⌫'],
]

const KEY_CLASSES: Record<LetterState, string> = {
  correct: 'bg-correct text-white',
  present: 'bg-present text-white',
  absent:  'bg-absent  text-white',
  empty:   'bg-gray-200 text-gray-900',
}

export function Keyboard({ keyState, onLetter, onDelete, onEnter }: Props) {
  const handleKey = (key: string) => {
    if (key === '⌫')          onDelete()
    else if (key === 'ENTER') onEnter()
    else                      onLetter(key)
  }

  return (
    <div className="flex flex-col gap-1.5 items-center select-none">
      {ROWS.map((row, ri) => (
        <div key={ri} className="flex gap-1">
          {row.map(key => {
            const state = keyState[key] ?? 'empty'
            const wide = key === 'ENTER' || key === '⌫'
            return (
              <button
                key={key}
                onPointerDown={e => { e.preventDefault(); handleKey(key) }}
                className={`
                  h-14 rounded font-bold text-sm
                  active:opacity-70 transition-opacity
                  ${wide ? 'px-2.5 text-xs' : 'w-9'}
                  ${KEY_CLASSES[state]}
                `}
              >
                {key}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
