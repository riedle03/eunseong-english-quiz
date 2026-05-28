import { useRef } from 'react'
import type { WordEntry } from '../types'

interface Props {
  wordEntry: WordEntry
  revealed: boolean
}

export function HintBox({ wordEntry, revealed }: Props) {
  const parts = wordEntry.sentence.split('___')
  const audioRef = useRef<HTMLAudioElement | null>(null)

  function playAudio() {
    audioRef.current?.pause()
    const a = new Audio(`/audio/${wordEntry.word.toLowerCase()}.mp3`)
    audioRef.current = a
    a.play().catch(() => {})
  }

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
      <button
        onClick={playAudio}
        className="mt-3 px-4 py-1 text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition-colors"
        aria-label="발음 듣기"
        title="발음 듣기"
      >
        🔊 듣기
      </button>
      {revealed && (
        <>
          <p className="mt-2 text-xs text-gray-500 italic">{wordEntry.sentenceKorean}</p>
          <p className="mt-1 text-base font-semibold text-gray-800">{wordEntry.korean}</p>
        </>
      )}
    </div>
  )
}
