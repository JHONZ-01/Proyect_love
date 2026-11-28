/** Lista de canciones (lógica pura). */
import { titleFromFile } from './text.js'

const idOf = (path) => path.split(/[\\/]/).pop().replace(/\.[^.]+$/, '')

/**
 * Entradas [ruta, url] (las de import.meta.glob) -> canciones ordenadas por nombre de archivo:
 * [{ id, src, title }]. `titles` permite dar un título propio por id (nombre sin extensión);
 * si no, el título sale del nombre del archivo.
 */
export function buildTracks(entries, titles = {}) {
    return [...entries]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([path, src]) => {
            const id = idOf(path)
            return { id, src, title: titles[id] ?? titleFromFile(path) ?? 'Música' }
        })
}

/** Índice de la canción siguiente, volviendo a la primera al final. */
export const nextIndex = (index, count) => (count > 0 ? (index + 1) % count : 0)
