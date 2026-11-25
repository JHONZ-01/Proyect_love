import { useRef } from 'react'
import Icon, { ICON_FOR_TYPE } from './Icon'

const SHAKE = [
    { transform: 'translateX(0)' },
    { transform: 'translateX(-5px)' },
    { transform: 'translateX(5px)' },
    { transform: 'translateX(-3px)' },
    { transform: 'translateX(3px)' },
    { transform: 'translateX(0)' },
]

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Una puerta. `status`: 'locked' | 'today' | 'available' | 'open'.
 * El nombre accesible lo da `label`; el dibujo interior es decorativo (aria-hidden).
 * Las bloqueadas usan aria-disabled (siguen enfocables y avisan al tocarlas) en vez de disabled.
 */
export default function Door({ day, status, type, label, isFinal, finalName, lockedNote, onActivate }) {
    const ref = useRef(null)
    const locked = status === 'locked'

    const handleClick = () => {
        if (locked && !prefersReducedMotion()) ref.current?.animate(SHAKE, { duration: 420, easing: 'ease' })
        onActivate(day, status)
    }

    return (
        <button
            ref={ref}
            type="button"
            id={`advent-door-${day}`}
            className={`advent-door${isFinal ? ' advent-door--final' : ''}`}
            data-state={status}
            aria-label={label}
            aria-disabled={locked || undefined}
            onClick={handleClick}
        >
            {/* La ventana encendida que hay detrás: solo se ve con la puerta abierta */}
            <span className="advent-door__inside" aria-hidden="true">
                <Icon name={ICON_FOR_TYPE[type]} />
                <b>{day}</b>
            </span>

            <span className="advent-door__face" aria-hidden="true">
                {isFinal ? (
                    <>
                        <span className="advent-ribbon" />
                        <span className="advent-door__tag">
                            {locked && <Icon name="lock" className="advent-door__lock" />}
                            {status === 'today' && <span className="advent-door__pill advent-door__pill--inline">Hoy</span>}
                            <span className="advent-door__num">{day}</span>
                            <span className="advent-door__name">{finalName}</span>
                            {locked && <span className="advent-door__note">{lockedNote}</span>}
                        </span>
                    </>
                ) : (
                    <>
                        {status === 'today' && <span className="advent-door__pill">Hoy</span>}
                        {status === 'available' && <span className="advent-door__dot" />}
                        {locked && <Icon name="lock" className="advent-door__lock" />}
                        <span className="advent-door__num">{day}</span>
                    </>
                )}
            </span>
        </button>
    )
}
