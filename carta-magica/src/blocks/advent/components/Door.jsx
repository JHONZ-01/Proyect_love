import { useEffect, useRef, useState } from 'react'
import Icon, { ICON_FOR_TYPE } from './Icon'
import Bow from './Bow'

const SHAKE = [
    { transform: 'translateX(0)' },
    { transform: 'translateX(-5px)' },
    { transform: 'translateX(5px)' },
    { transform: 'translateX(-3px)' },
    { transform: 'translateX(3px)' },
    { transform: 'translateX(0)' },
]

const DOUBLE_LEAF = new Set(['wide', 'large', 'banner']) // se abren como contraventanas, desde el centro
const SNOWY = new Set(['large', 'final']) // llevan nieve en el dintel (la de Nochebuena lleva guirnalda)
const OPENING_MS = 1000 // lo que dura el destello de apertura
const BULBS = 11
const BURST = 12

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Posición en la cuadrícula para móvil (--m-*), tableta/portátil (--w-*) y pantallas grandes (--x-*); el CSS elige según el ancho. */
const placementStyle = ({ mobile, wide, xl }, index) => ({
    '--x-col': xl.col,
    '--x-row': xl.row,
    '--x-cs': xl.cols,
    '--x-rs': xl.rows,
    '--m-col': mobile.col,
    '--m-row': mobile.row,
    '--m-cs': mobile.cols,
    '--m-rs': mobile.rows,
    '--w-col': wide.col,
    '--w-row': wide.row,
    '--w-cs': wide.cols,
    '--w-rs': wide.rows,
    '--i': index,
})

/** Guirnalda de luces (puerta de Nochebuena). */
function Lights() {
    return (
        <span className="advent-lights" aria-hidden="true">
            {Array.from({ length: BULBS }, (_, i) => <i key={i} style={{ '--b': i }} />)}
        </span>
    )
}

/** Cuatro destellos que parpadean alrededor de las puertas destacadas. */
function Sparkles() {
    return (
        <span className="advent-door__sparkles" aria-hidden="true">
            <i /><i /><i /><i />
        </span>
    )
}

/** Estallido de chispas al abrir una puerta destacada (una sola vez). */
function Burst() {
    return (
        <span className="advent-door__burst" aria-hidden="true">
            {Array.from({ length: BURST }, (_, i) => {
                const angle = (i / BURST) * Math.PI * 2
                const dist = 55 + (i % 3) * 22
                return <i key={i} style={{ '--adv-dx': `${Math.round(Math.cos(angle) * dist)}px`, '--adv-dy': `${Math.round(Math.sin(angle) * dist)}px` }} />
            })}
        </span>
    )
}

/**
 * Una puerta del calendario. `status`: 'locked' | 'today' | 'available' | 'open'.
 * `shape` (lib/layout.js) decide su forma y cómo se abre: una hoja (small, tall), dos hojas desde el
 * centro (wide, large, banner) o envoltorio de regalo (final). El nombre accesible lo da `label`;
 * todo el dibujo es decorativo (aria-hidden). Las bloqueadas usan aria-disabled (siguen enfocables
 * y avisan al tocarlas) en vez de disabled.
 */
export default function Door({ day, status, type, shape, featured, name, placement, index, label, lockedNote, onActivate }) {
    const ref = useRef(null)
    const [opening, setOpening] = useState(false)
    const locked = status === 'locked'
    const isFinal = shape === 'final'
    const isDouble = DOUBLE_LEAF.has(shape)

    useEffect(() => {
        if (!opening) return undefined
        const timer = setTimeout(() => setOpening(false), OPENING_MS)
        return () => clearTimeout(timer)
    }, [opening])

    const handleClick = () => {
        if (locked) {
            if (!prefersReducedMotion()) ref.current?.animate(SHAKE, { duration: 420, easing: 'ease' })
        } else if (status !== 'open') {
            setOpening(true)
        }
        onActivate(day, status, ref.current)
    }

    return (
        <button
            ref={ref}
            type="button"
            id={`advent-door-${day}`}
            className="advent-door"
            data-shape={shape}
            data-state={status}
            data-featured={featured ? 'true' : undefined}
            data-opening={opening ? 'true' : undefined}
            style={placementStyle(placement, index)}
            aria-label={label}
            aria-disabled={locked || undefined}
            onClick={handleClick}
        >
            <span className="advent-door__body">
                {/* La ventana encendida que hay detrás: se ve al abrir (o al asomarse con el ratón) */}
                <span className="advent-door__inside" aria-hidden="true">
                    <Icon name={ICON_FOR_TYPE[type] ?? 'heart'} />
                    <b>{day}</b>
                </span>

                {isFinal ? (
                    <span className="advent-door__wrap" aria-hidden="true">
                        <span className="advent-ribbon advent-ribbon--v" />
                        <span className="advent-ribbon advent-ribbon--h" />
                        <Bow className="advent-door__bow" />
                    </span>
                ) : isDouble ? (
                    <>
                        <span className="advent-door__leaf advent-door__leaf--l" aria-hidden="true" />
                        <span className="advent-door__leaf advent-door__leaf--r" aria-hidden="true" />
                    </>
                ) : (
                    <span className="advent-door__leaf" aria-hidden="true" />
                )}

                {/* Luz que sigue al cursor (la mueve DoorGrid) */}
                <span className="advent-door__shine" aria-hidden="true"><i /></span>

                <span className="advent-door__plate" aria-hidden="true">
                    {status === 'today' && <span className="advent-door__pill">Hoy</span>}
                    {status === 'available' && <span className="advent-door__dot" />}
                    {locked && <Icon name="lock" className="advent-door__lock" />}
                    <span className="advent-door__num">{day}</span>
                    {name && shape !== 'large' && shape !== 'small' && <span className="advent-door__name">{name}</span>}
                    {isFinal && locked && <span className="advent-door__note">{lockedNote}</span>}
                </span>

                {SNOWY.has(shape) && <span className="advent-door__snow" aria-hidden="true" />}
                {shape === 'banner' && <Lights />}
                {featured && <Sparkles />}
                {featured && opening && <Burst />}
            </span>
        </button>
    )
}
