import { motion, useReducedMotion } from 'framer-motion'

// Posición (% del sobre), tamaño (px) y retardo de cada destello.
const SPARKLES = [
    { x: 78, y: 12, size: 14, delay: 0 },
    { x: 66, y: 40, size: 10, delay: 0.6 },
    { x: 30, y: 62, size: 8, delay: 1.1 },
    { x: 54, y: 82, size: 12, delay: 0.3 },
    { x: 92, y: 70, size: 8, delay: 1.5 },
    { x: 8, y: 30, size: 10, delay: 0.9 },
]

/** Destellos dorados sobre el sobre. Solo transform/opacity (baratos en móvil). */
export default function Sparkles() {
    const reduce = useReducedMotion()

    return (
        <div className="absolute inset-0 pointer-events-none z-5" aria-hidden="true">
            {SPARKLES.map(({ x, y, size, delay }) => (
                <motion.svg
                    key={`${x}-${y}`}
                    viewBox="0 0 24 24"
                    className="absolute"
                    style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }}
                    initial={{ opacity: reduce ? 0.8 : 0, scale: 0.4 }}
                    animate={reduce ? undefined : { opacity: [0, 1, 0], scale: [0.4, 1, 0.4] }}
                    transition={{ duration: 2.4, repeat: Infinity, delay, ease: 'easeInOut' }}
                >
                    <path d="M12 0 14 10 24 12 14 14 12 24 10 14 0 12 10 10Z" fill="var(--color-gold-light)" />
                </motion.svg>
            ))}
        </div>
    )
}
