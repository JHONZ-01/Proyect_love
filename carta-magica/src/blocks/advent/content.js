// Textos y configuración del calendario de adviento.
// Sin imports de Vite (import.meta.glob, assets) para poder probarlo con node --test.
// El contenido de cada día está en days.data.js.

import { dateParts, doorDate } from './lib/calendar.js'

export const ADVENT_TITLE = 'Calendario de adviento'
// Nombre que se muestra en las puertas destacadas (y que lee el lector de pantalla).
export const DAY_NAMES = { 1: 'Primera puerta', 24: 'Nochebuena', 25: 'Navidad' }
export const FINAL_NAME = DAY_NAMES[25] // nombre de la última puerta
export const FINAL_GREETING = 'Feliz Navidad'

// Cambia aquí cuándo empieza y cuántas puertas tiene. Las fechas son 'AAAA-MM-DD' del
// calendario local de quien abre la página.
export const ADVENT_CONFIG = Object.freeze({
    startDate: '2026-12-01',
    totalDays: 25,
})

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
    const name = DAY_NAMES[day] ? `Puerta ${day} (${DAY_NAMES[day]})` : `Puerta ${day}`
    if (status === 'locked') return `${name}, se abre el ${longDate(doorDate(day, config))}`
    if (status === 'today') return `${name}, disponible hoy`
    if (status === 'available') return `${name}, sin abrir`
    return `${name}, abierta. Volver a verla`
}

/** Encabezado del modal: «Día 5 de 25». */
export const dayCounter = (day, total = ADVENT_CONFIG.totalDays) => `Día ${day} de ${total}`

// Textos fijos del modal.
export const COUPON_NOTE = 'Canjeable cuando quieras'
export const LISTEN_LABEL = 'Escuchar'
export const WATCH_LABEL = 'Ver el vídeo'
export const NEW_TAB_NOTE = ' (se abre en otra pestaña)'
export const REVEAL_LABEL = 'Mostrar la respuesta'
export const CLOSE_LABEL = 'Cerrar'

// Selector de estilos.
export const STYLE_BUTTON_LABEL = 'Estilo'
export const STYLE_BUTTON_ARIA = 'Cambiar el estilo del calendario'
export const PICKER_TITLE = 'Elige un estilo'
export const PICKER_HINT = 'Las puertas que ya abriste se mantienen.'
export const IN_USE_LABEL = 'En uso'

// Reloj y reproductor.
export const CLOCK_LABEL = 'Hora local'
export const MUSIC_PLAY = 'Reproducir la música'
export const MUSIC_PAUSE = 'Pausar la música'
export const MUSIC_PLAYING = 'Sonando'
export const MUSIC_PAUSED = 'En pausa'
export const MUSIC_VOLUME = 'Volumen'
export const MUSIC_FALLBACK_TITLE = 'Música navideña'
// Solo lo ve quien prepara el calendario (en vista previa), nunca quien lo recibe.
export const MUSIC_MISSING = 'Sin música: pon un .mp3 en assets/music'
export const MUSIC_NEXT = 'Siguiente canción'
// Los navegadores no dejan sonar música sin un gesto de la persona. Con true, la música empieza con
// su primer toque en la página (abrir una puerta, por ejemplo); con false, solo con el botón ▶.
export const MUSIC_ON_FIRST_TOUCH = true

// Dedicatoria final: cambia aquí el texto y la firma.
export const DEDICATION = Object.freeze({
    text: 'Cada día es una pequeña sorpresa, cada detalle guarda un momento especial y cada puerta es una razón más para sonreír.',
    signedBy: 'Creado con cariño por',
    name: 'Jhon Paucar',
})

const two = (n) => String(n).padStart(2, '0')

/**
 * Texto de la cuenta atrás a partir de nextOpening() y splitDuration() (lib/clock.js):
 *   antes de empezar -> 'La primera puerta se abre en 3 d 04 h 12 min'
 *   el último día    -> 'La primera puerta se abre en 04:12:09' (si falta menos de un día)
 *   durante          -> 'La puerta 6 se abre en 05:12:33'
 */
export function countdownText(next, parts) {
    if (!next) return null
    const clock = `${two(parts.hours)}:${two(parts.minutes)}:${two(parts.seconds)}`
    if (next.kind === 'first') {
        return parts.days >= 1
            ? `La primera puerta se abre en ${parts.days} d ${two(parts.hours)} h ${two(parts.minutes)} min`
            : `La primera puerta se abre en ${clock}`
    }
    return `La puerta ${next.day} se abre en ${clock}`
}

/** Aviso al tocar una puerta bloqueada. */
export function lockedHint(day, config = ADVENT_CONFIG) {
    return `La puerta ${day} se abre el ${longDate(doorDate(day, config))}.`
}
