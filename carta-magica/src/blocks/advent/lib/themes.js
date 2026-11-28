/**
 * Elección de estilo (funciones puras). El estilo se decide por, en este orden:
 *  1. ?estilo=<id> en la dirección (para mandar el calendario ya vestido de un estilo),
 *  2. la última elección guardada en el dispositivo,
 *  3. el estilo por defecto.
 * Un id desconocido se ignora siempre (un enlace viejo o mal escrito no rompe nada).
 */

export const THEME_PARAM = 'estilo'
export const THEME_STORAGE_KEY = 'advent:theme'

/** Lee ?estilo= y lo devuelve solo si es un estilo existente. */
export function themeFromSearch(search, ids) {
    const value = new URLSearchParams(search ?? '').get(THEME_PARAM)
    return value !== null && ids.includes(value) ? value : null
}

/** Estilo a usar según la URL, lo guardado y el de por defecto. */
export function resolveThemeId({ fromUrl, stored, ids, fallback }) {
    if (ids.includes(fromUrl)) return fromUrl
    if (ids.includes(stored)) return stored
    if (ids.includes(fallback)) return fallback
    return ids[0] ?? null
}

/** Quita ?estilo= de una cadena de búsqueda conservando el resto (p. ej. ?preview=). */
export function searchWithoutTheme(search) {
    const params = new URLSearchParams(search ?? '')
    params.delete(THEME_PARAM)
    const rest = params.toString()
    return rest ? `?${rest}` : ''
}

/** Ordena los estilos por su campo `order` (y por id si empatan). */
export function sortThemes(list) {
    return [...list].sort((a, b) => (a.order ?? 99) - (b.order ?? 99) || a.id.localeCompare(b.id))
}
