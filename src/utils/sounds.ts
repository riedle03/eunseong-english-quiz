let _ctx: AudioContext | null = null

function ctx(): AudioContext {
  if (!_ctx) _ctx = new AudioContext()
  if (_ctx.state === 'suspended') _ctx.resume()
  return _ctx
}

export function playTypeClick(): void {
  try {
    const c = ctx()
    const duration = 0.04
    const buf = c.createBuffer(1, Math.floor(c.sampleRate * duration), c.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3)
    }
    const src = c.createBufferSource()
    const filter = c.createBiquadFilter()
    const gain = c.createGain()
    filter.type = 'highpass'
    filter.frequency.value = 900
    gain.gain.value = 0.25
    src.buffer = buf
    src.connect(filter)
    filter.connect(gain)
    gain.connect(c.destination)
    src.start()
  } catch (_) {}
}

export function playCorrect(): void {
  try {
    const c = ctx()
    const notes = [523, 659, 784, 1047]
    notes.forEach((freq, i) => {
      const osc = c.createOscillator()
      const gain = c.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      const t = c.currentTime + i * 0.12
      gain.gain.setValueAtTime(0.25, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25)
      osc.connect(gain)
      gain.connect(c.destination)
      osc.start(t)
      osc.stop(t + 0.25)
    })
  } catch (_) {}
}

export function playWrong(): void {
  try {
    const c = ctx()
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(220, c.currentTime)
    osc.frequency.exponentialRampToValueAtTime(80, c.currentTime + 0.35)
    gain.gain.setValueAtTime(0.18, c.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.35)
    osc.connect(gain)
    gain.connect(c.destination)
    osc.start()
    osc.stop(c.currentTime + 0.35)
  } catch (_) {}
}
