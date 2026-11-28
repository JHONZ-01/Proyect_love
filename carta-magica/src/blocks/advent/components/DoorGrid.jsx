import { useEffect, useRef } from 'react'
import Door from './Door'
import Icon from './Icon'

const MAX_TILT = 5 // grados de inclinación máxima de una puerta pequeña al pasar el ratón
const LIFT = 'translateY(-3px)'
const clamp01 = (n) => Math.min(1, Math.max(0, n))

/**
 * Composición asimétrica de puertas (posiciones en lib/layout.js, aplicadas por CSS Grid).
 * También gestiona la interacción de ratón: la puerta bajo el cursor se eleva, se inclina hacia él y
 * se ilumina donde está el puntero. Se hace con un solo manejador para toda la cuadrícula y
 * escribiendo `transform` directamente en el elemento (sin re-renderizar React), una vez por frame.
 * Solo con ratón y sin «reducir movimiento»; en táctil no hay hover.
 */
export default function DoorGrid({ doors, decor, onActivate }) {
    const active = useRef(null)
    const point = useRef(null)
    const frame = useRef(0)
    const enabled = useRef(false)

    useEffect(() => {
        const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
        const update = () => { enabled.current = fine.matches && !reduce.matches }
        update()
        fine.addEventListener('change', update)
        reduce.addEventListener('change', update)
        return () => {
            fine.removeEventListener('change', update)
            reduce.removeEventListener('change', update)
            cancelAnimationFrame(frame.current)
        }
    }, [])

    const reset = (door) => {
        const body = door?.querySelector('.advent-door__body')
        if (!body) return
        body.style.transform = ''
        delete body.dataset.lit
    }

    const apply = () => {
        frame.current = 0
        const door = active.current
        const p = point.current
        if (!door || !p) return
        const body = door.querySelector('.advent-door__body')
        const shine = door.querySelector('.advent-door__shine i')
        const r = door.getBoundingClientRect()
        const x = clamp01((p.x - r.left) / r.width)
        const y = clamp01((p.y - r.top) / r.height)
        // Las puertas grandes se inclinan menos (un mueble grande no se mueve como uno pequeño).
        const size = Math.max(r.width, r.height)
        const max = door.dataset.state === 'locked' ? 2 : MAX_TILT * Math.min(1, Math.max(0.35, 160 / size))
        body.style.transform = `${LIFT} rotateX(${((0.5 - y) * max).toFixed(2)}deg) rotateY(${((x - 0.5) * max).toFixed(2)}deg)`
        if (shine) shine.style.transform = `translate(${(x * r.width).toFixed(1)}px, ${(y * r.height).toFixed(1)}px)`
        body.dataset.lit = 'true'
    }

    const onPointerMove = (e) => {
        if (!enabled.current || e.pointerType !== 'mouse') return
        const door = e.target.closest?.('.advent-door') ?? null
        if (door !== active.current) {
            reset(active.current)
            active.current = door
        }
        if (!door) return
        point.current = { x: e.clientX, y: e.clientY }
        if (!frame.current) frame.current = requestAnimationFrame(apply)
    }

    const onPointerLeave = () => {
        reset(active.current)
        active.current = null
    }

    return (
        <div className="advent-gridwrap">
            <section className="advent-grid" aria-label="Puertas del calendario" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
                {doors.map((door) => (
                    <Door key={door.day} {...door} onActivate={onActivate} />
                ))}
                {decor.map((d) => (
                    <span
                        key={`${d.layout}-${d.at.join('-')}`}
                        className={`advent-ornament advent-ornament--${d.layout}`}
                        style={{ '--o-col': d.at[0], '--o-row': d.at[1] }}
                        aria-hidden="true"
                    >
                        <Icon name={d.icon} />
                    </span>
                ))}
            </section>
        </div>
    )
}
