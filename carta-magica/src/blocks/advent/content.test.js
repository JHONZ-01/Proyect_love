import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ADVENT_CONFIG, headerText, doorLabel, lockedHint, longDate } from './content.js'
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
    assert.equal(doorLabel(1, 'open'), 'Puerta 1, abierta')
})

test('lockedHint dice cuándo se abre la puerta', () => {
    assert.equal(lockedHint(12), 'La puerta 12 se abre el 12 de diciembre.')
    assert.equal(lockedHint(25), 'La puerta 25 se abre el 25 de diciembre.')
})
