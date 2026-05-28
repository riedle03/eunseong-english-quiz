import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

interface WordEntry {
  word: string
  sentence: string
}

const API_KEY      = process.env.ELEVENLABS_API_KEY ?? ''
const VOICE_FEMALE = process.env.ELEVENLABS_VOICE_FEMALE ?? '21m00Tcm4TlvDq8ikWAM'
const VOICE_MALE   = process.env.ELEVENLABS_VOICE_MALE   ?? 'pNInz6obpgDQGcFmaJgB'
const MODEL        = 'eleven_multilingual_v2'
const OUT_DIR      = join(process.cwd(), 'public', 'audio')

const dryRun = process.argv.includes('--dry-run')
const force  = process.argv.includes('--force')

function buildText(entry: WordEntry): string {
  const wordTitle = entry.word[0] + entry.word.slice(1).toLowerCase()
  const sentence  = entry.sentence.replace('___', entry.word.toLowerCase())
  return `${wordTitle}! ${sentence}`
}

async function synthesize(text: string, voiceId: string): Promise<Buffer> {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: MODEL,
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  })
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`)
  return Buffer.from(await res.arrayBuffer())
}

async function main() {
  if (!API_KEY && !dryRun) {
    console.error('❌ ELEVENLABS_API_KEY not set in .env.local')
    process.exit(1)
  }

  mkdirSync(OUT_DIR, { recursive: true })

  const topics = ['hobby', 'travel', 'animals'] as const
  const allWords: WordEntry[] = []

  for (const topic of topics) {
    const entries: WordEntry[] = JSON.parse(
      readFileSync(join(process.cwd(), 'src', 'data', `${topic}.json`), 'utf-8')
    )
    for (const e of entries) allWords.push(e)
  }

  let synthesized = 0
  let skipped = 0

  for (let i = 0; i < allWords.length; i++) {
    const entry   = allWords[i]
    const voiceId = i % 2 === 0 ? VOICE_FEMALE : VOICE_MALE
    const text    = buildText(entry)
    const outPath = join(OUT_DIR, `${entry.word.toLowerCase()}.mp3`)

    if (!force && existsSync(outPath)) {
      console.log(`⏭  skip   ${entry.word.toLowerCase()}.mp3`)
      skipped++
      continue
    }

    const gender = i % 2 === 0 ? 'female' : 'male'
    console.log(`🔊 ${dryRun ? '[dry-run] ' : ''}${entry.word.toLowerCase()}.mp3  [${gender}]`)
    console.log(`   "${text}"`)

    if (!dryRun) {
      const audio = await synthesize(text, voiceId)
      writeFileSync(outPath, audio)
      synthesized++
    }
  }

  console.log(`\n✅ 완료 — 합성: ${synthesized}개, 건너뜀: ${skipped}개`)
}

main().catch(err => { console.error(err); process.exit(1) })
