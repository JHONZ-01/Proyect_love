/** Utilidades de texto puras para el contenido de los días. */

/** Divide un texto en párrafos por líneas en blanco. Sin texto -> lista vacía. */
export function paragraphs(text) {
    if (typeof text !== 'string') return []
    return text
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)
}

/**
 * ¿Es un enlace seguro para un botón «Escuchar»? Solo http(s) con dominio.
 * Evita que un error en el archivo de datos (p. ej. «javascript:…») se convierta en un enlace peligroso.
 */
export function isSafeLink(url) {
    if (typeof url !== 'string' || url.trim() === '') return false
    try {
        const u = new URL(url.trim())
        return (u.protocol === 'https:' || u.protocol === 'http:') && u.hostname.length > 0
    } catch {
        return false
    }
}
