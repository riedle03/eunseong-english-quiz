# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"은성이 영어퀴즈" — Wordle-style English vocabulary quiz for a Korean student (은성이).
Targets B1→B2 vocabulary (intermediate to upper-intermediate).
Topics: 취미/엔터테인먼트 🎮, 여행/세계 ✈️, 동물/자연 🐾.

## Commands

```bash
npm run dev       # Dev server → http://localhost:5173
npm run build     # TypeScript check + Vite production build → dist/
npm run test:run  # Run all tests once (vitest)
npm run test      # Watch mode
```

## Architecture

Two-page app (Home ↔ Game) with a `page` state in `App.tsx` — no router needed.

Key files:
- `src/hooks/useGame.ts` — game state machine: guesses, evaluations, status, addLetter/deleteLetter/submitGuess
- `src/utils/evaluateGuess.ts` — Wordle green/yellow/gray logic (two-pass algorithm)
- `src/utils/wordUtils.ts` — `getRandomWord(topics)`, `getKeyboardState(guesses, evals)`
- `src/data/*.json` — word banks (hobby / travel / animals), each 12 words
- `src/pages/Game.tsx` — physical keyboard handler lives here (not in the hook)
- `src/components/` — HintBox, GameRow, GameBoard, Keyboard, ResultModal

localStorage key: `streak-YYYY-MM-DD` → integer count of words solved today.

## Adding Words

Append to the relevant `src/data/{hobby|travel|animals}.json`:
```json
{ "word": "EXAMPLE", "emoji": "✨", "sentence": "This is an ___ sentence.", "korean": "예시", "level": 2 }
```
Rules: UPPERCASE, max 8 letters, exactly one `___` in sentence, level 1-3.
