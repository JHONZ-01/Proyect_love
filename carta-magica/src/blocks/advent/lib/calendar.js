/**
 * Lógica pura del calendario de adviento (sin React, sin import.meta, sin reloj propio).
 *
 * Las fechas viajan como texto 'AAAA-MM-DD' y representan el día del CALENDARIO LOCAL
 * de quien abre la página. Se comparan como texto (con 4+2+2 dígitos el orden
 * alfabético es el cronológico) y los cálculos de días usan Date.UTC sobre año/mes/día:
 * así no intervienen husos horarios ni el cambio de horario de verano.
 *
 * El "ahora" (new Date()) lo aporta quien llama; aquí nada lee el reloj, y por eso todo
 * se puede probar con node --test.
 */

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/

/** Configuración por defecto: 25 puertas desde el 1 de diciembre de 2026. */
export const DEFAULT_CONFIG = Object.freeze({ startDate: '2026-12-01', totalDays: 25 })

const pad = (n, len = 2) => String(n).padStart(len, '0')

/** 'AAAA-MM-DD' -> [año, mes, día], o null si no es una fecha real (p. ej. 2026-02-30). */
function parts(text) {
    if (typeof text !== 'string') return null
    const match = DATE_RE.exec(text)
    if (!match) return null
    const y = Number(match[1])
    const m = Number(match[2])
    const d = Number(match[3])
    const check = new Date(Date.UTC(y, m - 1, d))
    // Date.UTC "corrige" las fechas imposibles (30 de febrero -> marzo): se detecta comparando.
    if (check.getUTCFullYear() !== y || check.getUTCMonth() !== m - 1 || check.getUTCDate() !== d) return null
    return [y, m, d]
}

const mustParts = (text, name) => {
    const p = parts(text)
    if (!p) throw new RangeError(`${name} no es una fecha válida AAAA-MM-DD: ${String(text)}`)
    return p
}

/** ¿Es un texto 'AAAA-MM-DD' que existe en el calendario? */
export const isValidDate = (text) => parts(text) !== null

/** Date -> 'AAAA-MM-DD' usando el día del calendario LOCAL (no el UTC). */
export function formatDate(date) {
    return `${pad(date.getFullYear(), 4)}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** Suma (o resta, con n negativo) días a una fecha 'AAAA-MM-DD'. */
export function addDays(text, n) {
    const [y, m, d] = mustParts(text, 'text')
    const t = new Date(Date.UTC(y, m - 1, d + n))
    return `${pad(t.getUTCFullYear(), 4)}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`
}

/** Días enteros entre dos fechas (positivo si `to` es posterior a `from`). */
export function daysBetween(from, to) {
    const [fy, fm, fd] = mustParts(from, 'from')
    const [ty, tm, td] = mustParts(to, 'to')
    return Math.round((Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)) / 86400000)
}

/** Fecha en la que se abre la puerta `day` (1 = startDate). */
export function doorDate(day, config = DEFAULT_CONFIG) {
    if (!Number.isInteger(day) || day < 1 || day > config.totalDays) {
        throw new RangeError(`La puerta debe ser un entero de 1 a ${config.totalDays}: ${String(day)}`)
    }
    return addDays(config.startDate, day - 1)
}

/**
 * Estado de una puerta según la fecha de hoy:
 *  - 'locked'    aún no es su día
 *  - 'today'     es hoy
 *  - 'available' su día ya pasó (se puede abrir: el calendario no castiga)
 * Un año anterior deja todo bloqueado y uno posterior, todo disponible.
 */
export function getDoorState(day, today, config = DEFAULT_CONFIG) {
    mustParts(today, 'today')
    const door = doorDate(day, config)
    if (door > today) return 'locked'
    if (door === today) return 'today'
    return 'available'
}

/**
 * Fase del calendario según la fecha de hoy:
 *  - before: falta para la primera puerta (daysUntilStart > 0)
 *  - during: estamos dentro de las fechas (todayDay = número de la puerta de hoy)
 *  - after:  ya pasó la última puerta
 */
export function getPhase(today, config = DEFAULT_CONFIG) {
    mustParts(today, 'today')
    const last = doorDate(config.totalDays, config)
    if (today < config.startDate) {
        return { phase: 'before', daysUntilStart: daysBetween(today, config.startDate), todayDay: null }
    }
    if (today > last) return { phase: 'after', daysUntilStart: 0, todayDay: null }
    return { phase: 'during', daysUntilStart: 0, todayDay: daysBetween(config.startDate, today) + 1 }
}

/** 'AAAA-MM-DD' -> { year, month, day }, o null si no es una fecha real. */
export function dateParts(text) {
    const p = parts(text)
    return p ? { year: p[0], month: p[1], day: p[2] } : null
}

/**
 * Estado visual de una puerta: combina el estado por fecha con si ya se abrió.
 * Una puerta bloqueada nunca cuenta como abierta (aunque quedara guardada de una vista previa).
 * Devuelve 'locked' | 'today' | 'available' | 'open'.
 */
export function getDoorStatus(state, isOpened) {
    return state !== 'locked' && isOpened ? 'open' : state
}

/** Valida un valor de vista previa: devuelve la fecha limpia 'AAAA-MM-DD' o null si no sirve. */
export function parsePreview(value) {
    if (typeof value !== 'string') return null
    const clean = value.trim()
    return isValidDate(clean) ? clean : null
}

/** Lee `?preview=AAAA-MM-DD` de una cadena de búsqueda (location.search). Valor inválido -> null. */
export function previewFromSearch(search) {
    return parsePreview(new URLSearchParams(search ?? '').get('preview'))
}

/** «Hoy»: la fecha de vista previa si es válida; si no, el día local de `now`. */
export function resolveToday({ now, preview }) {
    return parsePreview(preview) ?? formatDate(now)
}

/**
 * Milisegundos hasta la próxima medianoche local (mínimo 1 s), para reprogramar el cambio
 * de «hoy». Se construye la medianoche con año/mes/día locales, así que respeta el horario de verano.
 */
export function msUntilNextDay(now) {
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0)
    return Math.max(1000, next.getTime() - now.getTime())
}
