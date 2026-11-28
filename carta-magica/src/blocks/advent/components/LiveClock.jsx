import { useNow } from '../hooks/useNow'
import { clockParts } from '../lib/clock'
import { CLOCK_LABEL } from '../content'

/**
 * Reloj con la hora del dispositivo: horas y minutos luminosos, segundos discretos y la fecha debajo.
 * Para el lector de pantalla es un texto estable («Hora local 18:05, sábado…»), no algo que se
 * anuncie cada segundo.
 */
export default function LiveClock() {
    const now = useNow()
    const { hours, minutes, seconds, dateLabel } = clockParts(now)

    return (
        <time className="advent-clock" dateTime={now.toISOString()} aria-label={`${CLOCK_LABEL}: ${hours}:${minutes}, ${dateLabel}`}>
            <span className="advent-clock__time" aria-hidden="true">
                <span>{hours}</span>
                <span className="advent-clock__sep">:</span>
                <span>{minutes}</span>
                <span className="advent-clock__sec">{seconds}</span>
            </span>
            <span className="advent-clock__date" aria-hidden="true">{dateLabel}</span>
        </time>
    )
}
