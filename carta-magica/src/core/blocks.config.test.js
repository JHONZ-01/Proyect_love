import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseFlag, resolveBlock } from './blocks.config.js'

const registry = [
    { id: 'letter', flag: 'A' },
    { id: 'gallery', flag: 'B' },
]

test('parseFlag normaliza true/false y detecta valores inválidos', () => {
    assert.equal(parseFlag('true'), true)
    assert.equal(parseFlag(' TRUE '), true)
    assert.equal(parseFlag('false'), false)
    assert.equal(parseFlag('False'), false)
    assert.equal(parseFlag(undefined), undefined)
    assert.equal(parseFlag(''), undefined)
    assert.equal(parseFlag('si'), null)
    assert.equal(parseFlag('1'), null)
})

test('sin banderas se usa el primer bloque', () => {
    const r = resolveBlock({}, registry)
    assert.equal(r.status, 'ok')
    assert.equal(r.block.id, 'letter')
    assert.deepEqual(r.warnings, [])
})

test('una bandera vacía cuenta como no definida', () => {
    assert.equal(resolveBlock({ A: '' }, registry).block.id, 'letter')
})

test('A=true muestra la carta', () => {
    assert.equal(resolveBlock({ A: 'true' }, registry).block.id, 'letter')
})

test('A=false y B=true muestra la galería', () => {
    const r = resolveBlock({ A: 'false', B: 'true' }, registry)
    assert.equal(r.status, 'ok')
    assert.equal(r.block.id, 'gallery')
})

test('solo B=true (A sin definir) muestra la galería', () => {
    assert.equal(resolveBlock({ B: 'true' }, registry).block.id, 'gallery')
})

test('varios activos: gana el primero y se emite un aviso', () => {
    const r = resolveBlock({ A: 'true', B: 'true' }, registry)
    assert.equal(r.status, 'ok')
    assert.equal(r.block.id, 'letter')
    assert.equal(r.warnings.length, 1)
})

test('todas en false es un error NO_ACTIVE_BLOCK', () => {
    const r = resolveBlock({ A: 'false', B: 'false' }, registry)
    assert.equal(r.status, 'error')
    assert.equal(r.code, 'NO_ACTIVE_BLOCK')
})

test('un valor inválido es un error INVALID_FLAG', () => {
    const r = resolveBlock({ A: 'si' }, registry)
    assert.equal(r.status, 'error')
    assert.equal(r.code, 'INVALID_FLAG')
    assert.match(r.message, /A="si"/)
})

test('un valor inválido tiene prioridad sobre otras banderas válidas', () => {
    assert.equal(resolveBlock({ A: 'true', B: 'quizas' }, registry).code, 'INVALID_FLAG')
})
