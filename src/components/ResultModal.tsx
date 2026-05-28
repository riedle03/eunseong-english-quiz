import type { GameStatus, WordEntry } from '../types'

interface Props {
  status: GameStatus
  wordEntry: WordEntry
  attempts: number
  onNext: () => void
}

export function ResultModal({ status, wordEntry, attempts, onNext }: Props) {
  if (status === 'playing') return null

  const won = status === 'won'
  const filledSentence = wordEntry.sentence.replace('___', wordEntry.word.toLowerCase())

  const handleShare = () => {
    const text = won
      ? `은성이 영어퀴즈 🎉\n${wordEntry.word} (${wordEntry.korean})\n${attempts}/6번 만에 맞췄어!`
      : `은성이 영어퀴즈 😢\n정답은 "${wordEntry.word}" (${wordEntry.korean}) 였어!`
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full text-center bounce-in">
        <div className="text-5xl mb-3">{won ? '🎉' : '😢'}</div>
        <h2 className="text-2xl font-bold mb-1">{won ? '정답!' : '아쉬워!'}</h2>
        <p className="text-xl font-bold text-gray-800 mb-0.5">{wordEntry.word}</p>
        <p className="text-base text-gray-500 mb-4">{wordEntry.korean} {wordEntry.emoji}</p>

        <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-700 mb-4 text-left">
          <span className="font-semibold">예문: </span>{filledSentence}
        </div>

        {won && (
          <p className="text-sm text-gray-500 mb-4">{attempts}번 만에 맞췄어! ⭐</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onNext}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors"
          >
            다음 단어 →
          </button>
          <button
            onClick={handleShare}
            className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-colors"
            title="결과 클립보드 복사"
          >
            📤
          </button>
        </div>
      </div>
    </div>
  )
}
