"use client";

let audioCtx: AudioContext | null = null;

function getCtx() {
  if (typeof window === "undefined") {
    return null;
  }

  const Ctx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) {
    return null;
  }

  if (!audioCtx) {
    audioCtx = new Ctx();
  }
  return audioCtx;
}

function playTone(frequency: number, duration = 0.1, type: OscillatorType = "sine", gainValue = 0.03) {
  const ctx = getCtx();
  if (!ctx) {
    return;
  }

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gainNode.gain.value = gainValue;

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  const start = ctx.currentTime;
  const end = start + duration;

  gainNode.gain.setValueAtTime(gainValue, start);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, end);

  oscillator.start(start);
  oscillator.stop(end);
}

export function playToggleSfx() {
  playTone(620, 0.08, "triangle", 0.025);
}

export function playLoginSfx() {
  playTone(420, 0.08, "square", 0.03);
  setTimeout(() => playTone(580, 0.1, "square", 0.03), 90);
}

export function playXpSfx(levelUp = false) {
  if (levelUp) {
    playTone(500, 0.08, "triangle", 0.04);
    setTimeout(() => playTone(700, 0.1, "triangle", 0.04), 80);
    setTimeout(() => playTone(950, 0.12, "triangle", 0.04), 170);
    return;
  }

  playTone(760, 0.07, "sine", 0.03);
}
