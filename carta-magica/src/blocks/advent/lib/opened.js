/**
 * Puertas abiertas: lectura y escritura del texto que se guarda en localStorage (funciones puras).
 * Se guarda una lista JSON de números de puerta, p. ej. "[1,2,5]".
 * Si el contenido está dañado, o trae números que no son puertas, se ignora en lugar de fallar.
 */

/** Clave de almacenamiento: una por calendario (según su fecha de inicio), para no mezclar años. */
export const openedKey = (startDate) => `advent:opened:${startDate}`

/** Texto guardado -> Set de puertas válidas (1..totalDays). Cualquier error da un Set vacío. */
export function parseOpened(raw, totalDays) {
    try {
        const data = JSON.parse(raw ?? '[]')
        if (!Array.isArray(data)) return new Set()
        return new Set(data.filter((n) => Number.isInteger(n) && n >= 1 && n <= totalDays))
    } catch {
        return new Set()
    }
}

/** Set de puertas -> texto para guardar (ordenado, para que sea estable). */
export const serializeOpened = (set) => JSON.stringify([...set].sort((a, b) => a - b))
