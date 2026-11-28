/**
 * Reloj y cuenta atrás (lógica pura). La hora es la del dispositivo: `Date` usa la zona horaria
 * local del navegador, así que no hay que convertir nada. El «ahora» lo aporta quien llama.
 */
import { getPhase, msUntilNextDay } from './calendar.js'

const DAY_MS = 86400000
const formatters = new Map()

/** Los Intl.DateTimeFormat son caros de crear: se crean una vez por idioma y se reutilizan. */
function formattersFor(locale) {
    if (!formatters.has(locale)) {
        formatters.set(locale, {
            time: new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }),
            date: new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long' }),
        })
    }
    return formatters.get(locale)
}

/** Partes del reloj: { hours: '08', minutes: '05', seconds: '09', dateLabel: 'sábado, 5 de diciembre' }. */
export function clockParts(date, locale = 'es-ES') {
    const { time, date: dateFormat } = formattersFor(locale)
    const parts = time.formatToParts(date)
    const get = (type) => parts.find((p) => p.type === type)?.value ?? '00'
    return { hours: get('hour'), minutes: get('minute'), seconds: get('second'), dateLabel: dateFormat.format(date) }
}

/** Milisegundos -> { days, hours, minutes, seconds } (nunca negativo). */
export function splitDuration(ms) {
    const total = Math.max(0, Math.floor(ms / 1000))
    return {
        days: Math.floor(total / 86400),
        hours: Math.floor((total % 86400) / 3600),
        minutes: Math.floor((total % 3600) / 60),
        seconds: total % 60,
    }
}

/**
 * Cuánto falta para que se abra la próxima puerta:
 *  - antes de empezar: { kind: 'first', day: 1, ms }
 *  - durante (salvo el último día): { kind: 'next', day: mañana, ms }
 *  - el último día y después: null (ya no hay más puertas que esperar)
 * `today` es el día del calendario ('AAAA-MM-DD', o el de la vista previa); `now`, la hora real.
 */
export function nextOpening(now, today, config) {
    const phase = getPhase(today, config)
    if (phase.phase === 'before') {
        return { kind: 'first', day: 1, ms: (phase.daysUntilStart - 1) * DAY_MS + msUntilNextDay(now) }
    }
    if (phase.phase === 'during' && phase.todayDay < config.totalDays) {
        return { kind: 'next', day: phase.todayDay + 1, ms: msUntilNextDay(now) }
    }
    return null
}
