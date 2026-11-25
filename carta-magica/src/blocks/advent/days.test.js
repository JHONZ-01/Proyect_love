import { test } from 'node:test'
import assert from 'node:assert/strict'
import { DAYS, DAY_TYPES } from './days.data.js'
import { ADVENT_CONFIG } from './content.js'

test('hay exactamente un contenido por puerta, numerados de 1 a N en orden', () => {
    assert.equal(DAYS.length, ADVENT_CONFIG.totalDays)
    DAYS.forEach((d, i) => assert.equal(d.day, i + 1, `la entrada ${i + 1} dice day: ${d.day}`))
})

test('cada día tiene un tipo válido, título y texto no vacíos', () => {
    for (const d of DAYS) {
        assert.ok(DAY_TYPES.includes(d.type), `día ${d.day}: tipo «${d.type}» no válido`)
        assert.ok(typeof d.title === 'string' && d.title.trim() !== '', `día ${d.day}: título vacío`)
        assert.ok(typeof d.text === 'string' && d.text.trim() !== '', `día ${d.day}: texto vacío`)
    }
})

test('solo el último día es el final', () => {
    assert.equal(DAYS.at(-1).type, 'final')
    assert.ok(DAYS.slice(0, -1).every((d) => d.type !== 'final'))
})

test('los tipos de contenido se reparten (no es todo lo mismo)', () => {
    const used = new Set(DAYS.map((d) => d.type))
    assert.ok(used.size >= 4, `solo se usan ${used.size} tipos`)
})
