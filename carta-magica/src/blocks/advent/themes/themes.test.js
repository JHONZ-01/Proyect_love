// Coherencia de los estilos: cada carpeta trae su ficha y su CSS, y todos definen las mismas variables.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const DEFAULT_THEME_ID = 'vino-champagne'
const DECOR = ['bow', 'hearts', 'dots', 'twinkle']

const folders = readdirSync(HERE).filter((f) => statSync(join(HERE, f)).isDirectory())
const varsOf = (css) => new Set([...css.matchAll(/(--adv-[a-z0-9-]+)\s*:/g)].map((m) => m[1]))

test('hay al menos dos estilos y existe el de por defecto', () => {
    assert.ok(folders.length >= 2, folders.join(', '))
    assert.ok(folders.includes(DEFAULT_THEME_ID))
})

test('cada estilo tiene una ficha válida con su mismo id', async () => {
    const ids = new Set()
    const orders = new Set()
    for (const folder of folders) {
        const meta = (await import(pathToFileURL(join(HERE, folder, 'theme.js')).href)).default
        assert.equal(meta.id, folder, `${folder}: el id debe ser el nombre de la carpeta`)
        assert.ok(typeof meta.name === 'string' && meta.name.trim(), `${folder}: falta name`)
        assert.ok(typeof meta.description === 'string' && meta.description.trim(), `${folder}: falta description`)
        assert.ok(meta.fontUrl.startsWith('https://fonts.googleapis.com/css2?'), `${folder}: fontUrl debe ser de Google Fonts`)
        assert.ok(Number.isInteger(meta.order), `${folder}: order debe ser un entero`)
        assert.ok(Array.isArray(meta.decor) && meta.decor.every((d) => DECOR.includes(d)), `${folder}: decor desconocido`)
        assert.ok(!orders.has(meta.order), `${folder}: order repetido`)
        ids.add(meta.id)
        orders.add(meta.order)
    }
    assert.equal(ids.size, folders.length)
})

test('cada CSS se acota a su propio estilo', () => {
    for (const folder of folders) {
        const css = readFileSync(join(HERE, folder, 'theme.css'), 'utf8')
        assert.ok(css.includes(`[data-adv-theme="${folder}"]`), `${folder}: el selector debe ser [data-adv-theme="${folder}"]`)
        const selectors = [...css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{/g)].map((m) => m[1].trim())
        assert.deepEqual(selectors, [`[data-adv-theme="${folder}"]`], `${folder}: solo debe haber un bloque de variables`)
    }
})

test('todos los estilos definen exactamente las mismas variables que el de por defecto', () => {
    const reference = varsOf(readFileSync(join(HERE, DEFAULT_THEME_ID, 'theme.css'), 'utf8'))
    assert.ok(reference.size > 50, `solo ${reference.size} variables en el estilo por defecto`)
    for (const folder of folders) {
        const vars = varsOf(readFileSync(join(HERE, folder, 'theme.css'), 'utf8'))
        const missing = [...reference].filter((v) => !vars.has(v))
        const extra = [...vars].filter((v) => !reference.has(v))
        assert.deepEqual({ missing, extra }, { missing: [], extra: [] }, folder)
    }
})
