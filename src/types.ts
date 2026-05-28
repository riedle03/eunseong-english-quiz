export type Topic = 'hobby' | 'travel' | 'animals'
export type GameStatus = 'playing' | 'won' | 'lost'
export type LetterState = 'correct' | 'present' | 'absent' | 'empty'

export interface WordEntry {
  word: string      // always UPPERCASE, max 8 letters
  emoji: string
  sentence: string        // contains exactly one "___" placeholder
  sentenceKorean: string  // Korean translation of the sentence (with answer filled in)
  korean: string
  level: 1 | 2 | 3
}
