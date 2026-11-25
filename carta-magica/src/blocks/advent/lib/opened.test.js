import { test } from 'node:test'
import assert from 'node:assert/strict'
import { openedKey, parseOpened, serializeOpened } from './opened.js'

test('openedKey separa un calendario de otro por su fecha de inicio', () => {
    assert.equal(openedKey('2026-12-01'), 'advent:opened:2026-12-01')
    assert.notEqual(openedKey('2026-12-01'), openedKey('2027-12-01'))
})

test('parseOpened lee una lista válida', () => {
    assert.deepEqual([...parseOpened('[1,2,5]', 25)], [1, 2, 5])
    assert.equal(parseOpened('[]', 25).size, 0)
})

test('parseOpened sin datos guardados devuelve un conjunto vacío', () => {
    assert.equal(parseOpened(null, 25).size, 0)
    assert.equal(parseOpened(undefined, 25).size, 0)
    assert.equal(parseOpened('', 25).size, 0)
})

test('parseOpened ignora contenido dañado o que no es una lista', () => {
    for (const raw of ['{', 'hola', '{"a":1}', '5', 'null', '"1,2"']) {
        assert.equal(parseOpened(raw, 25).size, 0, raw)
    }
})

test('parseOpened descarta lo que no es una puerta válida', () => {
    assert.deepEqual([...parseOpened('[0,1,26,2.5,"3",null,25,-4]', 25)].sort((a, b) => a - b), [1, 25])
    assert.deepEqual([...parseOpened('[1,1,1]', 25)], [1]) // sin repetidos
})

test('serializeOpened ordena y es reversible con parseOpened', () => {
    const text = serializeOpened(new Set([5, 1, 12]))
    assert.equal(text, '[1,5,12]')
    assert.deepEqual([...parseOpened(text, 25)], [1, 5, 12])
    assert.equal(serializeOpened(new Set()), '[]')
})
