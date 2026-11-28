import { test } from 'node:test'
import assert from 'node:assert/strict'
import { themeFromSearch, resolveThemeId, searchWithoutTheme, sortThemes } from './themes.js'

const IDS = ['vino-champagne', 'noche-dorada', 'kawaii-lazo']

test('themeFromSearch acepta solo estilos existentes', () => {
    assert.equal(themeFromSearch('?estilo=kawaii-lazo', IDS), 'kawaii-lazo')
    assert.equal(themeFromSearch('?preview=2026-12-05&estilo=noche-dorada', IDS), 'noche-dorada')
    assert.equal(themeFromSearch('?estilo=no-existe', IDS), null)
    assert.equal(themeFromSearch('?estilo=', IDS), null)
    assert.equal(themeFromSearch('', IDS), null)
    assert.equal(themeFromSearch(undefined, IDS), null)
})

test('resolveThemeId: URL antes que lo guardado, y lo guardado antes que el de por defecto', () => {
    const base = { ids: IDS, fallback: 'vino-champagne' }
    assert.equal(resolveThemeId({ ...base, fromUrl: 'kawaii-lazo', stored: 'noche-dorada' }), 'kawaii-lazo')
    assert.equal(resolveThemeId({ ...base, fromUrl: null, stored: 'noche-dorada' }), 'noche-dorada')
    assert.equal(resolveThemeId({ ...base, fromUrl: null, stored: null }), 'vino-champagne')
})

test('resolveThemeId ignora valores desconocidos o dañados', () => {
    const base = { ids: IDS, fallback: 'vino-champagne' }
    assert.equal(resolveThemeId({ ...base, fromUrl: 'viejo', stored: '{roto' }), 'vino-champagne')
    assert.equal(resolveThemeId({ ids: IDS, fallback: 'tampoco', fromUrl: null, stored: null }), 'vino-champagne') // el primero
    assert.equal(resolveThemeId({ ids: [], fallback: 'x', fromUrl: null, stored: null }), null)
})

test('searchWithoutTheme quita ?estilo= y conserva lo demás', () => {
    assert.equal(searchWithoutTheme('?estilo=kawaii-lazo'), '')
    assert.equal(searchWithoutTheme('?preview=2026-12-05&estilo=kawaii-lazo'), '?preview=2026-12-05')
    assert.equal(searchWithoutTheme('?preview=2026-12-05'), '?preview=2026-12-05')
    assert.equal(searchWithoutTheme(''), '')
})

test('sortThemes ordena por order y luego por id', () => {
    const sorted = sortThemes([{ id: 'b', order: 2 }, { id: 'a', order: 2 }, { id: 'z', order: 1 }, { id: 'sin-orden' }])
    assert.deepEqual(sorted.map((t) => t.id), ['z', 'a', 'b', 'sin-orden'])
})
