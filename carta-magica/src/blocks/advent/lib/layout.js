/**
 * Composición de las puertas (lógica pura): la forma de cada puerta y su sitio en la cuadrícula.
 *
 * Está diseñada a mano para tres anchos: móvil (4 columnas), tableta y portátil (6 columnas) y
 * pantallas grandes (10 columnas, escena panorámica). Cada puerta conserva su forma en todas;
 * solo cambia dónde va (y, en la panorámica, el tamaño de Nochebuena y Navidad). El orden de lectura
 * (fila a fila, de izquierda a derecha) sigue el orden de los números: así el tabulador y los
 * lectores de pantalla recorren las puertas de la 1 a la 25.
 *
 * layout.test.js comprueba que no haya solapes ni huecos, que todo quepa y que el orden se respete.
 * Si cambias una posición, ejecuta `npm test`.
 */

/** Formas: columnas × filas que ocupa cada una. La final ocupa todas las columnas. */
export const SHAPES = {
    small: { cols: 1, rows: 1 }, // ventanita: mensajes, pistas, retos
    tall: { cols: 1, rows: 2 }, // puerta con arco: fotos
    wide: { cols: 2, rows: 1 }, // contraventanas: canciones, vales
    large: { cols: 2, rows: 2 }, // doble puerta: regalos, vídeos, momentos grandes
    banner: { cols: 4, rows: 1 }, // franja con guirnalda: Nochebuena
    final: { cols: 'all', rows: 2 }, // el regalo de Navidad
}

/** Forma de cada puerta (no cambia con el tamaño de pantalla). */
export const DOOR_SHAPES = {
    1: 'large', 2: 'small', 3: 'tall', 4: 'wide', 5: 'small',
    6: 'small', 7: 'small', 8: 'small', 9: 'large', 10: 'small',
    11: 'tall', 12: 'small', 13: 'small', 14: 'small', 15: 'small',
    16: 'wide', 17: 'tall', 18: 'large', 19: 'small', 20: 'small',
    21: 'small', 22: 'small', 23: 'wide', 24: 'banner', 25: 'final',
}

/** Fechas destacadas: aspecto exclusivo (medallón, destellos y estallido al abrir). */
export const FEATURED_DAYS = [1, 24, 25]

/**
 * Posición de la esquina superior izquierda de cada puerta: [columna, fila], empezando en 1.
 * `decor`: casillas con un adorno (no son puertas) para que no queden huecos.
 */
export const LAYOUTS = {
    mobile: {
        columns: 4,
        doors: {
            1: [1, 1], 2: [3, 1], 3: [4, 1],
            4: [1, 3], 5: [3, 3], 6: [4, 3],
            7: [1, 4], 8: [2, 4], 9: [3, 4],
            10: [1, 5], 11: [2, 5],
            12: [1, 6], 13: [3, 6], 14: [4, 6],
            15: [1, 7], 16: [2, 7], 17: [4, 7],
            18: [1, 8], 19: [3, 8],
            20: [3, 9], 21: [4, 9],
            22: [1, 10], 23: [2, 10],
            24: [1, 11],
            25: [1, 12],
        },
        spans: {},
        decor: [
            { at: [3, 2], icon: 'star' },
            { at: [4, 10], icon: 'snowflake' },
        ],
    },
    wide: {
        columns: 6,
        doors: {
            1: [1, 1], 2: [3, 1], 3: [4, 1], 4: [5, 1],
            5: [3, 2], 6: [5, 2], 7: [6, 2],
            8: [1, 3], 9: [2, 3], 10: [4, 3], 11: [5, 3], 12: [6, 3],
            13: [1, 4], 14: [4, 4], 15: [6, 4],
            16: [1, 5], 17: [3, 5], 18: [4, 5], 19: [6, 5],
            20: [1, 6], 21: [2, 6], 22: [6, 6],
            23: [1, 7], 24: [3, 7],
            25: [1, 8],
        },
        spans: {},
        decor: [],
    },
    // Pantallas grandes: escena panorámica de 10 columnas. Las grandes bajan en diagonal
    // (1 a la izquierda, 9 al centro, 18 a la derecha) y Nochebuena y Navidad cierran la escena
    // a todo el ancho, una junto a otra.
    xl: {
        columns: 10,
        doors: {
            1: [1, 1], 2: [3, 1], 3: [4, 1], 4: [5, 1], 5: [7, 1], 6: [8, 1], 7: [9, 1], 8: [10, 1],
            9: [5, 2], 10: [7, 2], 11: [8, 2], 12: [9, 2], 13: [10, 2],
            14: [1, 3], 15: [2, 3], 16: [3, 3], 17: [7, 3], 18: [9, 3],
            19: [1, 4], 20: [2, 4], 21: [3, 4], 22: [4, 4], 23: [5, 4],
            24: [1, 5], 25: [5, 5],
        },
        spans: { 24: [4, 2], 25: [6, 2] }, // en esta escena, Nochebuena y Navidad ocupan dos filas
        decor: [
            { at: [3, 2], icon: 'star' },
            { at: [8, 4], icon: 'snowflake' },
        ],
    },
}

/** Columnas × filas que ocupa una forma en una cuadrícula de `columns` columnas. */
export function spanOf(shape, columns) {
    const s = SHAPES[shape]
    if (!s) throw new RangeError(`Forma desconocida: ${String(shape)}`)
    return { cols: s.cols === 'all' ? columns : s.cols, rows: s.rows }
}

/** Sitio de una puerta en una composición: { col, row, cols, rows }. `spans` de la composición manda sobre la forma. */
export function placementOf(day, layoutName) {
    const layout = LAYOUTS[layoutName]
    const at = layout?.doors[day]
    if (!at) throw new RangeError(`La puerta ${day} no tiene sitio en «${layoutName}»`)
    const override = layout.spans?.[day]
    const span = override ? { cols: override[0], rows: override[1] } : spanOf(DOOR_SHAPES[day], layout.columns)
    return { col: at[0], row: at[1], ...span }
}

/**
 * Revisa una composición y devuelve la lista de problemas (vacía si está bien):
 * puertas sin sitio, fuera de la cuadrícula, solapes, huecos y orden de lectura roto.
 */
export function layoutProblems(layoutName, totalDays) {
    const layout = LAYOUTS[layoutName]
    const problems = []
    const owner = new Map() // 'col,row' -> quién la ocupa
    let lastRow = 0

    const claim = (who, col, row, cols, rows) => {
        if (col < 1 || col + cols - 1 > layout.columns) problems.push(`${who} se sale de las ${layout.columns} columnas`)
        for (let r = row; r < row + rows; r++) {
            for (let c = col; c < col + cols; c++) {
                const key = `${c},${r}`
                if (owner.has(key)) problems.push(`${who} se solapa con ${owner.get(key)} en ${key}`)
                owner.set(key, who)
            }
        }
        lastRow = Math.max(lastRow, row + rows - 1)
    }

    let previous = null
    for (let day = 1; day <= totalDays; day++) {
        if (!DOOR_SHAPES[day]) { problems.push(`la puerta ${day} no tiene forma`); continue }
        if (!layout.doors[day]) { problems.push(`la puerta ${day} no tiene sitio`); continue }
        const p = placementOf(day, layoutName)
        claim(`puerta ${day}`, p.col, p.row, p.cols, p.rows)
        if (previous && (p.row < previous.row || (p.row === previous.row && p.col <= previous.col))) {
            problems.push(`la puerta ${day} va antes que la ${day - 1} al leer`)
        }
        previous = p
    }
    for (const d of layout.decor) claim(`adorno ${d.at}`, d.at[0], d.at[1], 1, 1)

    for (let r = 1; r <= lastRow; r++) {
        for (let c = 1; c <= layout.columns; c++) {
            if (!owner.has(`${c},${r}`)) problems.push(`hueco en ${c},${r}`)
        }
    }
    return problems
}
