import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ADVENT_CONFIG, headerText, doorLabel, lockedHint, longDate, dayCounter, countdownText, DEDICATION } from './content.js'
import { getPhase, isValidDate } from './lib/calendar.js'

const header = (today, todayOpened = false) => headerText(getPhase(today, ADVENT_CONFIG), { today, todayOpened })

test('la configuración del bloque es una fecha real y un número de puertas válido', () => {
    assert.equal(isValidDate(ADVENT_CONFIG.startDate), true)
    assert.ok(Number.isInteger(ADVENT_CONFIG.totalDays) && ADVENT_CONFIG.totalDays > 0)
})

test('longDate escribe la fecha en español', () => {
    assert.equal(longDate('2026-12-05'), '5 de diciembre')
    assert.equal(longDate('2027-01-01'), '1 de enero')
    assert.throws(() => longDate('hola'), RangeError)
})

test('cabecera antes de empezar: singular y plural', () => {
    assert.deepEqual(header('2026-11-24'), { line: 'Faltan 7 días', sub: 'La primera puerta se abre el 1 de diciembre.' })
    assert.equal(header('2026-11-30').line, 'Falta 1 día')
})

test('cabecera durante el calendario: puerta de hoy sin abrir o ya abierta', () => {
    assert.deepEqual(header('2026-12-05', false), { line: 'Hoy es 5 de diciembre', sub: 'Te espera la puerta 5.' })
    assert.deepEqual(header('2026-12-05', true), { line: 'Hoy es 5 de diciembre', sub: 'La de hoy ya está abierta. Mañana, la 6.' })
})

test('cabecera el último día', () => {
    assert.deepEqual(header('2026-12-25', false), { line: 'Hoy es Navidad', sub: 'Te espera la puerta 25.' })
    assert.deepEqual(header('2026-12-25', true), { line: 'Hoy es Navidad', sub: 'Ya abriste la última puerta.' })
})

test('cabecera al terminar', () => {
    assert.equal(header('2026-12-26').line, 'Feliz Navidad')
    assert.equal(header('2027-12-05').line, 'Feliz Navidad')
})

test('doorLabel describe cada estado y la fecha de las bloqueadas', () => {
    assert.equal(doorLabel(12, 'locked'), 'Puerta 12, se abre el 12 de diciembre')
    assert.equal(doorLabel(5, 'today'), 'Puerta 5, disponible hoy')
    assert.equal(doorLabel(4, 'available'), 'Puerta 4, sin abrir')
    assert.equal(doorLabel(1, 'open'), 'Puerta 1 (Primera puerta), abierta. Volver a verla')
    assert.equal(doorLabel(24, 'locked'), 'Puerta 24 (Nochebuena), se abre el 24 de diciembre')
})

test('lockedHint dice cuándo se abre la puerta', () => {
    assert.equal(lockedHint(12), 'La puerta 12 se abre el 12 de diciembre.')
    assert.equal(lockedHint(25), 'La puerta 25 se abre el 25 de diciembre.')
})

test('dayCounter numera el día sobre el total', () => {
    assert.equal(dayCounter(5), 'Día 5 de 25')
    assert.equal(dayCounter(25, 25), 'Día 25 de 25')
})

test('countdownText antes de empezar y durante diciembre', () => {
    const p = (days, hours, minutes, seconds) => ({ days, hours, minutes, seconds })
    assert.equal(countdownText({ kind: 'first', day: 1 }, p(3, 4, 12, 9)), 'La primera puerta se abre en 3 d 04 h 12 min')
    assert.equal(countdownText({ kind: 'first', day: 1 }, p(0, 4, 12, 9)), 'La primera puerta se abre en 04:12:09')
    assert.equal(countdownText({ kind: 'next', day: 6 }, p(0, 5, 2, 33)), 'La puerta 6 se abre en 05:02:33')
    assert.equal(countdownText(null, p(0, 0, 0, 0)), null)
})

test('la dedicatoria tiene texto, firma y nombre', () => {
    for (const key of ['text', 'signedBy', 'name']) assert.ok(DEDICATION[key].trim(), key)
})
