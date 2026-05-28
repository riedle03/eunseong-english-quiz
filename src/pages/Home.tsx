import { useState, useEffect } from 'react'
import type { Topic } from '../types'

interface Props {
  onStart: (topics: Topic[]) => void
}

const TOPICS: { id: Topic; label: string; emoji: string }[] = [
  { id: 'hobby',   label: '취미',  emoji: '🎮' },
  { id: 'travel',  label: '여행',  emoji: '✈️' },
  { id: 'animals', label: '동물',  emoji: '🐾' },
]

function todayKey() {
  return `streak-${new Date().toISOString().slice(0, 10)}`
}

export function Home({ onStart }: Props) {
  const [selected, setSelected] = useState<Topic[]>(['hobby'])
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    setStreak(Number(localStorage.getItem(todayKey()) ?? 0))
  }, [])

  const toggleTopic = (topic: Topic) => {
    setSelected(prev =>
      prev.includes(topic)
        ? prev.length > 1 ? prev.filter(t => t !== topic) : prev
        : [...prev, topic]
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-6">
      <div className="text-6xl mb-3">🎓</div>
      <h1 className="text-3xl font-bold text-gray-800 mb-1">은성이 영어퀴즈</h1>
      <p className="text-gray-400 mb-8">Wordle 스타일 단어 맞추기!</p>

      {streak > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-2 mb-6 text-sm font-medium">
          🔥 오늘 <span className="font-bold text-orange-600">{streak}단어</span> 클리어!
        </div>
      )}

      <div className="mb-8 w-full max-w-xs">
        <p className="text-sm font-semibold text-gray-500 mb-3 text-center">주제 선택</p>
        <div className="flex gap-3 justify-center">
          {TOPICS.map(t => (
            <button
              key={t.id}
              onClick={() => toggleTopic(t.id)}
              className={`
                flex-1 py-3 rounded-xl border-2 font-semibold text-sm
                transition-all duration-200
                ${selected.includes(t.id)
                  ? 'bg-blue-500 border-blue-500 text-white shadow-md scale-105'
                  : 'bg-white border-gray-200 text-gray-500 hover:border-blue-300'
                }
              `}
            >
              <div className="text-2xl mb-1">{t.emoji}</div>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => onStart(selected)}
        className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-bold py-4 px-12 rounded-2xl text-lg shadow-lg transition-all"
      >
        시작하기 →
      </button>
    </div>
  )
}
