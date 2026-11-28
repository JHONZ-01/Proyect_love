import { test } from 'node:test'
import assert from 'node:assert/strict'
import { clockParts, splitDuration, nextOpening } from './clock.js'

const CFG = { startDate: '2026-12-01', totalDays: 25 }
const H = 3600000

test('clockParts: horas, minutos y segundos con dos cifras y formato de 24 h', () => {
    const p = clockParts(new Date(2026, 11, 5, 8, 5, 9))
    assert.deepEqual([p.hours, p.minutes, p.seconds], ['08', '05', '09'])
    const n = clockParts(new Date(2026, 11, 5, 23, 59, 0))
    assert.deepEqual([n.hours, n.minutes], ['23', '59'])
    assert.equal(clockParts(new Date(2026, 11, 5, 0, 0, 0)).hours, '00') // medianoche, no «24»
})

test('clockParts: la fecha en español con el día de la semana', () => {
    assert.equal(clockParts(new Date(2026, 11, 5, 12)).dateLabel, 'sábado, 5 de diciembre')
    assert.equal(clockParts(new Date(2026, 10, 27, 12)).dateLabel, 'viernes, 27 de noviembre')
})

test('splitDuration reparte en días, horas, minutos y segundos', () => {
    assert.deepEqual(splitDuration(0), { days: 0, hours: 0, minutes: 0, seconds: 0 })
    assert.deepEqual(splitDuration(90061000), { days: 1, hours: 1, minutes: 1, seconds: 1 })
    assert.deepEqual(splitDuration(-5000), { days: 0, hours: 0, minutes: 0, seconds: 0 })
})

test('nextOpening antes de empezar: días completos más lo que queda de hoy', () => {
    const r = nextOpening(new Date(2026, 10, 24, 20, 0, 0), '2026-11-24', CFG)
    assert.equal(r.kind, 'first')
    assert.equal(r.day, 1)
    assert.deepEqual(splitDuration(r.ms), { days: 6, hours: 4, minutes: 0, seconds: 0 })
})

test('nextOpening durante diciembre: la puerta de mañana a medianoche', () => {
    const r = nextOpening(new Date(2026, 11, 5, 18, 30, 0), '2026-12-05', CFG)
    assert.deepEqual({ kind: r.kind, day: r.day }, { kind: 'next', day: 6 })
    assert.equal(r.ms, 5.5 * H)
})

test('nextOpening el último día y después ya no espera nada', () => {
    assert.equal(nextOpening(new Date(2026, 11, 25, 10), '2026-12-25', CFG), null)
    assert.equal(nextOpening(new Date(2027, 0, 3, 10), '2027-01-03', CFG), null)
})
