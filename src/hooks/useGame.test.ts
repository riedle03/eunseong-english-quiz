import { renderHook, act } from '@testing-library/react'
import { useGame } from './useGame'
import type { WordEntry } from '../types'

const mockWord: WordEntry = {
  word: 'WHALE',
  emoji: '🐋',
  sentence: 'The blue ___ is the largest animal.',
  korean: '고래',
  level: 2,
}

describe('useGame', () => {
  it('starts in playing status with empty guesses', () => {
    const { result } = renderHook(() => useGame(mockWord))
    expect(result.current.status).toBe('playing')
    expect(result.current.guesses).toHaveLength(0)
    expect(result.current.currentGuess).toBe('')
  })

  it('addLetter appends uppercase letter to currentGuess', () => {
    const { result } = renderHook(() => useGame(mockWord))
    act(() => result.current.addLetter('w'))
    act(() => result.current.addLetter('H'))
    expect(result.current.currentGuess).toBe('WH')
  })

  it('addLetter does not exceed word length', () => {
    const { result } = renderHook(() => useGame(mockWord))
    'WHALES'.split('').forEach(l => act(() => result.current.addLetter(l)))
    expect(result.current.currentGuess).toBe('WHALE') // capped at 5
  })

  it('deleteLetter removes the last letter', () => {
    const { result } = renderHook(() => useGame(mockWord))
    act(() => result.current.addLetter('W'))
    act(() => result.current.addLetter('H'))
    act(() => result.current.deleteLetter())
    expect(result.current.currentGuess).toBe('W')
  })

  it('submitGuess with correct word sets status to won', () => {
    const { result } = renderHook(() => useGame(mockWord))
    'WHALE'.split('').forEach(l => act(() => result.current.addLetter(l)))
    act(() => result.current.submitGuess())
    expect(result.current.status).toBe('won')
    expect(result.current.guesses).toEqual(['WHALE'])
    expect(result.current.currentGuess).toBe('')
  })

  it('submitGuess ignores incomplete guess', () => {
    const { result } = renderHook(() => useGame(mockWord))
    act(() => result.current.addLetter('W'))
    act(() => result.current.submitGuess())
    expect(result.current.guesses).toHaveLength(0)
  })

  it('sets status to lost after 6 wrong guesses', () => {
    const { result } = renderHook(() => useGame(mockWord))
    for (let i = 0; i < 6; i++) {
      'EAGLE'.split('').forEach(l => act(() => result.current.addLetter(l)))
      act(() => result.current.submitGuess())
    }
    expect(result.current.status).toBe('lost')
    expect(result.current.guesses).toHaveLength(6)
  })

  it('does not accept input after game is over', () => {
    const { result } = renderHook(() => useGame(mockWord))
    'WHALE'.split('').forEach(l => act(() => result.current.addLetter(l)))
    act(() => result.current.submitGuess())
    act(() => result.current.addLetter('X'))
    expect(result.current.currentGuess).toBe('')
  })
})
