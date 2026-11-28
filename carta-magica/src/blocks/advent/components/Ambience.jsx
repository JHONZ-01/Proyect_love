import { useEffect, useRef } from 'react'
import Snow from './Snow'
import Twinkles from './Twinkles'

// Luces cálidas desenfocadas (bokeh): posición, tamaño y duración de la deriva, cada una distinta
// para que nada se mueva al mismo ritmo.
const GLOWS = [
    { x: 8, y: 22, size: 340, dur: 38, tone: 'warm' },
    { x: 88, y: 14, size: 280, dur: 46, tone: 'accent' },
    { x: 78, y: 72, size: 420, dur: 53, tone: 'warm' },
    { x: 18, y: 86, size: 300, dur: 61, tone: 'ribbon' },
]

// Guirnalda: bombillas a lo largo de una curva que cuelga (y = 4·caída·t·(1−t)).
const BULBS = 18
const SAG = 26
const BULB_TIMES = [2.1, 3.4, 2.7, 3.9, 2.4, 3.1] // segundos: ritmos distintos, nunca a la vez

function Garland() {
    return (
        <div className="advent-garland" aria-hidden="true">
            <svg viewBox={`0 0 100 ${SAG + 6}`} preserveAspectRatio="none">
                <path d={`M0,0 Q50,${SAG * 2} 100,0`} vectorEffect="non-scaling-stroke" />
            </svg>
            {Array.from({ length: BULBS }, (_, i) => {
                const t = (i + 0.5) / BULBS
                return (
                    <i
                        key={i}
                        style={{
                            left: `${t * 100}%`,
                            top: `${4 * SAG * t * (1 - t)}px`,
                            animationDuration: `${BULB_TIMES[i % BULB_TIMES.length]}s`,
                            animationDelay: `${-(i * 0.37).toFixed(2)}s`,
                        }}
                    />
                )
            })}
        </div>
    )
}

/**
 * Ambiente en planos: al fondo, luces cálidas y estrellas; en medio, la nieve; arriba, la guirnalda.
 * Con ratón, los planos se desplazan un poco en sentido contrario al puntero (paralaje): el fondo
 * menos que la nieve, lo que da profundidad. Se escribe el transform directamente en cada plano,
 * una vez por frame. Sin paralaje en táctil ni con «reducir movimiento».
 */
export default function Ambience({ twinkle = false, hearts = false }) {
    const far = useRef(null)
    const mid = useRef(null)

    useEffect(() => {
        const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
        let frame = 0
        let last = null
        const apply = () => {
            frame = 0
            if (!last) return
            const nx = last.x / window.innerWidth - 0.5
            const ny = last.y / window.innerHeight - 0.5
            if (far.current) far.current.style.transform = `translate3d(${(-nx * 8).toFixed(1)}px, ${(-ny * 8).toFixed(1)}px, 0)`
            if (mid.current) mid.current.style.transform = `translate3d(${(-nx * 18).toFixed(1)}px, ${(-ny * 18).toFixed(1)}px, 0)`
        }
        const onMove = (e) => {
            if (!fine.matches || reduce.matches || e.pointerType !== 'mouse') return
            last = { x: e.clientX, y: e.clientY }
            if (!frame) frame = requestAnimationFrame(apply)
        }
        window.addEventListener('pointermove', onMove, { passive: true })
        return () => {
            window.removeEventListener('pointermove', onMove)
            cancelAnimationFrame(frame)
        }
    }, [])

    return (
        <>
            <div ref={far} className="advent-plane advent-plane--far" aria-hidden="true">
                {GLOWS.map((g, i) => (
                    <span
                        key={i}
                        className={`advent-glow advent-glow--${g.tone}`}
                        style={{ left: `${g.x}%`, top: `${g.y}%`, width: g.size, height: g.size, animationDuration: `${g.dur}s` }}
                    />
                ))}
                {twinkle && <Twinkles />}
            </div>
            <div ref={mid} className="advent-plane advent-plane--mid" aria-hidden="true">
                <Snow hearts={hearts} />
            </div>
            <Garland />
        </>
    )
}
