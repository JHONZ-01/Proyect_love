// Textos y configuración del calendario de adviento.
// Sin imports de Vite (import.meta.glob, assets) para poder probarlo con node --test.
// El contenido de cada día está en days.data.js.

import { dateParts, doorDate } from './lib/calendar.js'

export const ADVENT_TITLE = 'Calendario de adviento'
export const FINAL_NAME = 'Navidad' // nombre de la última puerta
export const FINAL_GREETING = 'Feliz Navidad'

// Cambia aquí cuándo empieza y cuántas puertas tiene. Las fechas son 'AAAA-MM-DD' del
// calendario local de quien abre la página.
export const ADVENT_CONFIG = Object.freeze({
    startDate: '2026-12-01',
    totalDays: 25,
})

// Letra del estilo por defecto (Vino y champán). Cuando haya varios estilos, cada uno traerá la suya.
export const ADVENT_FONT_URL =
    'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Figtree:wght@500;600;700;800&display=swap'

const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

/** '2026-12-05' -> '5 de diciembre'. */
export function longDate(text) {
    const p = dateParts(text)
    if (!p) throw new RangeError(`Fecha no válida: ${String(text)}`)
    return `${p.day} de ${MONTHS[p.month - 1]}`
}

/**
 * Textos de la cabecera según la fase (de getPhase) y si la puerta de hoy ya se abrió.
 * Devuelve { line, sub }: la frase principal y la secundaria.
 */
export function headerText({ phase, daysUntilStart, todayDay }, { today, todayOpened }, config = ADVENT_CONFIG) {
    if (phase === 'before') {
        return {
            line: daysUntilStart === 1 ? 'Falta 1 día' : `Faltan ${daysUntilStart} días`,
            sub: `La primera puerta se abre el ${longDate(config.startDate)}.`,
        }
    }
    if (phase === 'during') {
        const isLast = todayDay === config.totalDays
        const line = isLast ? `Hoy es ${FINAL_NAME}` : `Hoy es ${longDate(today)}`
        if (!todayOpened) return { line, sub: `Te espera la puerta ${todayDay}.` }
        return { line, sub: isLast ? 'Ya abriste la última puerta.' : `La de hoy ya está abierta. Mañana, la ${todayDay + 1}.` }
    }
    return { line: FINAL_GREETING, sub: 'Ya puedes abrir todas las puertas, cuando quieras.' }
}

/** Nombre accesible de una puerta (lo lee el lector de pantalla). */
export function doorLabel(day, status, config = ADVENT_CONFIG) {
    if (status === 'locked') return `Puerta ${day}, se abre el ${longDate(doorDate(day, config))}`
    if (status === 'today') return `Puerta ${day}, disponible hoy`
    if (status === 'available') return `Puerta ${day}, sin abrir`
    return `Puerta ${day}, abierta`
}

/** Aviso al tocar una puerta bloqueada. */
export function lockedHint(day, config = ADVENT_CONFIG) {
    return `La puerta ${day} se abre el ${longDate(doorDate(day, config))}.`
}
