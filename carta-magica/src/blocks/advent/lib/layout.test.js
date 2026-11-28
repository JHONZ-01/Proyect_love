import { test } from 'node:test'
import assert from 'node:assert/strict'
import { DOOR_SHAPES, FEATURED_DAYS, LAYOUTS, SHAPES, layoutProblems, placementOf, spanOf } from './layout.js'
import { ADVENT_CONFIG } from '../content.js'

const TOTAL = ADVENT_CONFIG.totalDays

for (const name of Object.keys(LAYOUTS)) {
    test(`composición «${name}»: sin solapes, sin huecos, todo dentro y en orden de lectura`, () => {
        assert.deepEqual(layoutProblems(name, TOTAL), [])
    })
}

test('cada puerta tiene una forma conocida y hay variedad de tamaños', () => {
    assert.equal(Object.keys(DOOR_SHAPES).length, TOTAL)
    for (const [day, shape] of Object.entries(DOOR_SHAPES)) assert.ok(SHAPES[shape], `puerta ${day}: forma «${shape}»`)
    const counts = Object.values(DOOR_SHAPES).reduce((acc, s) => ({ ...acc, [s]: (acc[s] ?? 0) + 1 }), {})
    assert.ok(counts.small >= 8, 'debe haber bastantes pequeñas')
    assert.ok(counts.large >= 2 && counts.tall >= 2 && counts.wide >= 2, JSON.stringify(counts))
    assert.equal(DOOR_SHAPES[TOTAL], 'final')
})

// Casillas de borde que comparten dos rectángulos que se tocan (0 si no se tocan o solo por una esquina).
function sharedEdge(a, b) {
    const overlap = (s1, l1, s2, l2) => Math.max(0, Math.min(s1 + l1, s2 + l2) - Math.max(s1, s2))
    if (a.row + a.rows === b.row || b.row + b.rows === a.row) return overlap(a.col, a.cols, b.col, b.cols)
    if (a.col + a.cols === b.col || b.col + b.cols === a.col) return overlap(a.row, a.rows, b.row, b.rows)
    return 0
}

test('las puertas grandes no forman un bloque (como mucho se rozan en una casilla)', () => {
    for (const name of Object.keys(LAYOUTS)) {
        const big = Object.keys(DOOR_SHAPES).map(Number).filter((d) => DOOR_SHAPES[d] === 'large')
        for (let i = 0; i < big.length; i++) {
            for (let j = i + 1; j < big.length; j++) {
                const shared = sharedEdge(placementOf(big[i], name), placementOf(big[j], name))
                assert.ok(shared <= 1, `${name}: las puertas ${big[i]} y ${big[j]} comparten ${shared} casillas de borde`)
            }
        }
    }
})

test('las fechas destacadas existen e incluyen la última', () => {
    assert.ok(FEATURED_DAYS.every((d) => d >= 1 && d <= TOTAL))
    assert.ok(FEATURED_DAYS.includes(TOTAL))
})

test('spanOf y placementOf', () => {
    assert.deepEqual(spanOf('final', 4), { cols: 4, rows: 2 })
    assert.deepEqual(spanOf('final', 6), { cols: 6, rows: 2 })
    assert.deepEqual(placementOf(9, 'wide'), { col: 2, row: 3, cols: 2, rows: 2 })
    assert.throws(() => spanOf('rara', 4), RangeError)
    assert.throws(() => placementOf(99, 'wide'), RangeError)
})

test('layoutProblems detecta un solape y un hueco', () => {
    const original = LAYOUTS.wide.doors[2]
    LAYOUTS.wide.doors[2] = [1, 1] // encima de la puerta 1
    try {
        const problems = layoutProblems('wide', TOTAL)
        assert.ok(problems.some((p) => p.includes('se solapa')), problems.join('\n'))
        assert.ok(problems.some((p) => p.startsWith('hueco')), problems.join('\n'))
    } finally {
        LAYOUTS.wide.doors[2] = original
    }
})
