import type { WordEntry } from '../types'

interface Props {
  wordEntry: WordEntry
  revealed: boolean
}

export function HintBox({ wordEntry, revealed }: Props) {
  const parts = wordEntry.sentence.split('___')
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 text-center w-full max-w-sm mx-auto">
      <div className="text-5xl mb-2">{wordEntry.emoji}</div>
      <div className="text-sm text-gray-400 mb-2">{wordEntry.word.length}글자</div>
      <p className="text-sm text-gray-700 leading-relaxed">
        {parts[0]}
        {revealed ? (
          <span className="font-bold text-correct">{wordEntry.word.toLowerCase()}</span>
        ) : (
          <span className="inline-block w-14 border-b-2 border-gray-400 align-bottom" />
        )}
        {parts[1]}
      </p>
      {revealed && (
        <p className="mt-2 text-base font-semibold text-gray-800">{wordEntry.korean}</p>
      )}
    </div>
  )
}
