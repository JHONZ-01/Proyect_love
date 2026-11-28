import { useNow } from '../hooks/useNow'
import { nextOpening, splitDuration } from '../lib/clock'
import { countdownText } from '../content'

/** Cuenta atrás en vivo hasta la próxima puerta (o la primera). No se muestra si ya no queda ninguna. */
export default function Countdown({ today, config }) {
    const now = useNow()
    const next = nextOpening(now, today, config)
    const text = countdownText(next, next ? splitDuration(next.ms) : null)
    if (!text) return null
    return <p className="advent-head__countdown">{text}</p>
}
