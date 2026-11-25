import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
    DEFAULT_CONFIG,
    isValidDate,
    formatDate,
    addDays,
    daysBetween,
    doorDate,
    getDoorState,
    getDoorStatus,
    dateParts,
    getPhase,
    parsePreview,
    previewFromSearch,
    resolveToday,
    msUntilNextDay,
} from './calendar.js'

const CFG = { startDate: '2026-12-01', totalDays: 25 }
const allStates = (today) => Array.from({ length: CFG.totalDays }, (_, i) => getDoorState(i + 1, today, CFG))

test('la configuración por defecto son 25 puertas desde el 1 de diciembre de 2026', () => {
    assert.deepEqual({ ...DEFAULT_CONFIG }, CFG)
})

test('isValidDate acepta fechas reales y rechaza imposibles o mal escritas', () => {
    assert.equal(isValidDate('2026-12-01'), true)
    assert.equal(isValidDate('2028-02-29'), true) // año bisiesto
    for (const bad of ['2026-02-30', '2027-02-29', '2026-13-01', '2026-00-10', '2026-12-32', '2026-1-1', '26-12-01', '', 'hola', '2026/12/01']) {
        assert.equal(isValidDate(bad), false, bad)
    }
    for (const bad of [null, undefined, 20261201, {}, []]) assert.equal(isValidDate(bad), false)
})

test('formatDate usa el día del calendario LOCAL y rellena con ceros', () => {
    assert.equal(formatDate(new Date(2026, 11, 1, 23, 59, 59)), '2026-12-01') // último segundo del 1
    assert.equal(formatDate(new Date(2026, 11, 2, 0, 0, 0)), '2026-12-02') // medianoche: ya es el 2
    assert.equal(formatDate(new Date(2026, 0, 5, 12)), '2026-01-05')
})

test('addDays cruza mes, año y bisiestos', () => {
    assert.equal(addDays('2026-12-01', 24), '2026-12-25')
    assert.equal(addDays('2026-12-31', 1), '2027-01-01')
    assert.equal(addDays('2026-12-01', -1), '2026-11-30')
    assert.equal(addDays('2028-02-28', 1), '2028-02-29')
    assert.equal(addDays('2027-02-28', 1), '2027-03-01')
    assert.equal(addDays('2026-12-05', 0), '2026-12-05')
    assert.throws(() => addDays('2026-02-30', 1), RangeError)
})

test('daysBetween cuenta días enteros con signo', () => {
    assert.equal(daysBetween('2026-11-24', '2026-12-01'), 7)
    assert.equal(daysBetween('2026-12-01', '2026-12-01'), 0)
    assert.equal(daysBetween('2026-12-25', '2026-12-01'), -24)
    assert.equal(daysBetween('2026-12-31', '2027-01-01'), 1)
    assert.throws(() => daysBetween('x', '2026-12-01'), RangeError)
})

test('doorDate: la puerta 1 es el 1 y la 25 es el 25; fuera de rango falla', () => {
    assert.equal(doorDate(1, CFG), '2026-12-01')
    assert.equal(doorDate(25, CFG), '2026-12-25')
    for (const bad of [0, 26, -1, 1.5, '3', null, NaN]) assert.throws(() => doorDate(bad, CFG), RangeError, String(bad))
})

test('un día de diciembre: pasadas disponibles, hoy y futuras bloqueadas', () => {
    const today = '2026-12-05'
    assert.equal(getDoorState(4, today, CFG), 'available')
    assert.equal(getDoorState(5, today, CFG), 'today')
    assert.equal(getDoorState(6, today, CFG), 'locked')
    assert.equal(getDoorState(25, today, CFG), 'locked')
})

test('antes del 1 de diciembre todo está bloqueado', () => {
    for (const today of ['2026-11-24', '2026-11-30', '2025-12-10']) {
        assert.ok(allStates(today).every((s) => s === 'locked'), today)
    }
})

test('el 1 de diciembre solo la puerta 1 es «hoy»', () => {
    const s = allStates('2026-12-01')
    assert.equal(s[0], 'today')
    assert.ok(s.slice(1).every((x) => x === 'locked'))
})

test('el 25 de diciembre la 25 es «hoy» y las demás están disponibles', () => {
    const s = allStates('2026-12-25')
    assert.equal(s[24], 'today')
    assert.ok(s.slice(0, 24).every((x) => x === 'available'))
})

test('después del 25 y en años posteriores todo está disponible', () => {
    for (const today of ['2026-12-26', '2027-01-03', '2027-12-05']) {
        assert.ok(allStates(today).every((s) => s === 'available'), today)
    }
})

test('getDoorState rechaza un «hoy» inválido en lugar de adivinar', () => {
    assert.throws(() => getDoorState(1, '2026-02-30', CFG), RangeError)
    assert.throws(() => getDoorState(1, undefined, CFG), RangeError)
})

test('getPhase: antes, durante y después', () => {
    assert.deepEqual(getPhase('2026-11-24', CFG), { phase: 'before', daysUntilStart: 7, todayDay: null })
    assert.deepEqual(getPhase('2026-11-30', CFG), { phase: 'before', daysUntilStart: 1, todayDay: null })
    assert.deepEqual(getPhase('2026-12-01', CFG), { phase: 'during', daysUntilStart: 0, todayDay: 1 })
    assert.deepEqual(getPhase('2026-12-13', CFG), { phase: 'during', daysUntilStart: 0, todayDay: 13 })
    assert.deepEqual(getPhase('2026-12-25', CFG), { phase: 'during', daysUntilStart: 0, todayDay: 25 })
    assert.deepEqual(getPhase('2026-12-26', CFG), { phase: 'after', daysUntilStart: 0, todayDay: null })
    assert.deepEqual(getPhase('2027-12-05', CFG), { phase: 'after', daysUntilStart: 0, todayDay: null })
})

test('parsePreview limpia espacios y descarta lo inválido', () => {
    assert.equal(parsePreview('2026-12-05'), '2026-12-05')
    assert.equal(parsePreview('  2026-12-05 '), '2026-12-05')
    for (const bad of ['2026-02-30', 'hola', '', '5-12-2026', null, undefined, 5]) assert.equal(parsePreview(bad), null, String(bad))
})

test('previewFromSearch lee ?preview= de la URL', () => {
    assert.equal(previewFromSearch('?preview=2026-12-05'), '2026-12-05')
    assert.equal(previewFromSearch('?a=1&preview=2026-12-10&b=2'), '2026-12-10')
    assert.equal(previewFromSearch('?preview=hola'), null)
    assert.equal(previewFromSearch('?preview=2026-02-30'), null)
    assert.equal(previewFromSearch('?otro=1'), null)
    assert.equal(previewFromSearch(''), null)
    assert.equal(previewFromSearch(undefined), null)
})

test('resolveToday usa la vista previa si es válida y, si no, el día local', () => {
    const now = new Date(2026, 11, 3, 10, 30)
    assert.equal(resolveToday({ now, preview: '2026-12-20' }), '2026-12-20')
    assert.equal(resolveToday({ now, preview: 'basura' }), '2026-12-03')
    assert.equal(resolveToday({ now, preview: null }), '2026-12-03')
    assert.equal(resolveToday({ now }), '2026-12-03')
})

test('msUntilNextDay: segundos para la medianoche, con mínimo de 1 s', () => {
    assert.equal(msUntilNextDay(new Date(2026, 11, 1, 23, 59, 30, 0)), 30000)
    assert.equal(msUntilNextDay(new Date(2026, 11, 1, 23, 59, 59, 900)), 1000) // quedan 100 ms: se pide 1 s
    const full = msUntilNextDay(new Date(2026, 11, 1, 0, 0, 0, 0))
    assert.ok(full >= 23 * 3600e3 && full <= 25 * 3600e3, String(full)) // un día (±1 h por horario de verano)
})

test('getDoorStatus: abierta solo si la puerta no está bloqueada', () => {
    assert.equal(getDoorStatus('today', false), 'today')
    assert.equal(getDoorStatus('today', true), 'open')
    assert.equal(getDoorStatus('available', false), 'available')
    assert.equal(getDoorStatus('available', true), 'open')
    assert.equal(getDoorStatus('locked', false), 'locked')
    assert.equal(getDoorStatus('locked', true), 'locked') // guardada de una vista previa: sigue bloqueada
})

test('dateParts descompone una fecha real y devuelve null si no lo es', () => {
    assert.deepEqual(dateParts('2026-12-05'), { year: 2026, month: 12, day: 5 })
    assert.equal(dateParts('2026-02-30'), null)
    assert.equal(dateParts('hola'), null)
    assert.equal(dateParts(undefined), null)
})
