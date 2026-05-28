import { useState } from 'react'
import { Home } from './pages/Home'
import { Game } from './pages/Game'
import type { Topic } from './types'

export default function App() {
  const [page, setPage] = useState<'home' | 'game'>('home')
  const [topics, setTopics] = useState<Topic[]>(['hobby'])

  if (page === 'game') {
    return <Game topics={topics} onHome={() => setPage('home')} />
  }

  return (
    <Home
      onStart={selected => {
        setTopics(selected)
        setPage('game')
      }}
    />
  )
}
