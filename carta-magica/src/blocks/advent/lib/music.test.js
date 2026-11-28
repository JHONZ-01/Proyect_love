import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildTracks, nextIndex } from './music.js'

test('buildTracks ordena por nombre de archivo y usa los títulos propios', () => {
    const tracks = buildTracks(
        [['./assets/music/02-last-christmas.mp3', '/a/02.mp3'], ['./assets/music/01-lentito-x-last-christmas.mp3', '/a/01.mp3']],
        { '02-last-christmas': 'Last Christmas · Wham!' },
    )
    assert.deepEqual(tracks.map((t) => t.id), ['01-lentito-x-last-christmas', '02-last-christmas'])
    assert.equal(tracks[0].src, '/a/01.mp3')
    assert.equal(tracks[0].title, 'Lentito x last christmas') // sin título propio: sale del archivo
    assert.equal(tracks[1].title, 'Last Christmas · Wham!')
})

test('buildTracks sin canciones devuelve una lista vacía', () => {
    assert.deepEqual(buildTracks([]), [])
})

test('nextIndex avanza y vuelve a empezar', () => {
    assert.equal(nextIndex(0, 2), 1)
    assert.equal(nextIndex(1, 2), 0)
    assert.equal(nextIndex(0, 1), 0)
    assert.equal(nextIndex(3, 0), 0)
})
