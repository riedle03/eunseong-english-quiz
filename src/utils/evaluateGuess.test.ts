import { evaluateGuess } from './evaluateGuess'

describe('evaluateGuess', () => {
  it('marks all correct when guess equals target', () => {
    expect(evaluateGuess('WHALE', 'WHALE')).toEqual(
      ['correct', 'correct', 'correct', 'correct', 'correct']
    )
  })

  it('marks all absent when no letters match', () => {
    expect(evaluateGuess('ZZZZZ', 'WHALE')).toEqual(
      ['absent', 'absent', 'absent', 'absent', 'absent']
    )
  })

  it('marks present for correct letter in wrong position', () => {
    // W is in WHALE but at position 0, not 3
    const result = evaluateGuess('ZZZWZ', 'WHALE')
    expect(result[3]).toBe('present')
  })

  it('does not double-count duplicate letters in guess', () => {
    // AABCD vs ABCDE: first A is correct (pos 0), second A is absent (A used up)
    const result = evaluateGuess('AABCD', 'ABCDE')
    expect(result[0]).toBe('correct')
    expect(result[1]).toBe('absent')
  })

  it('handles correct taking priority over present for same letter', () => {
    // LLAMA vs LLANO: both L's are correct, A at pos 2 is correct
    const result = evaluateGuess('LLAMA', 'LLANO')
    expect(result[0]).toBe('correct')
    expect(result[1]).toBe('correct')
    expect(result[2]).toBe('correct') // A is in LLANO at pos 2
    expect(result[3]).toBe('absent') // M is not in LLANO
    expect(result[4]).toBe('absent') // Second A already used
  })
})
