import { test } from 'node:test'
import assert from 'node:assert/strict'
import { paragraphs, isSafeLink } from './text.js'

test('paragraphs separa por líneas en blanco y limpia espacios', () => {
    assert.deepEqual(paragraphs('Hola'), ['Hola'])
    assert.deepEqual(paragraphs('Uno\n\nDos'), ['Uno', 'Dos'])
    assert.deepEqual(paragraphs('  Uno  \n   \n\n Dos\nsigue '), ['Uno', 'Dos\nsigue'])
    assert.deepEqual(paragraphs(''), [])
    assert.deepEqual(paragraphs(undefined), [])
})

test('isSafeLink acepta enlaces http(s) normales', () => {
    assert.equal(isSafeLink('https://open.spotify.com/track/abc'), true)
    assert.equal(isSafeLink('https://www.youtube.com/watch?v=xyz'), true)
    assert.equal(isSafeLink('http://example.com'), true)
})

test('isSafeLink rechaza vacíos y protocolos peligrosos o raros', () => {
    for (const bad of ['', '   ', null, undefined, 'javascript:alert(1)', 'JAVASCRIPT:alert(1)', 'data:text/html,hola', 'mailto:a@b.c', 'ftp://x.com', 'no es un enlace', '//example.com']) {
        assert.equal(isSafeLink(bad), false, String(bad))
    }
})
