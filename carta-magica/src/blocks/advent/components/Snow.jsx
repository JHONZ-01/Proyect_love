import { useState } from 'react'

const COUNT = 18

// Valores al azar fijados una sola vez al montar (no cambian en cada pintado).
const makeFlakes = () =>
    Array.from({ length: COUNT }, () => ({
        left: Math.random() * 100,
        size: 2 + Math.random() * 3,
        duration: 9 + Math.random() * 10,
        delay: -Math.random() * 18,
        drift: Math.round(Math.random() * 60 - 30),
    }))

/** Nieve suave, solo CSS. Con «reducir movimiento» se oculta (ver advent.css). */
export default function Snow() {
    const [flakes] = useState(makeFlakes)

    return (
        <div className="advent-snow" aria-hidden="true">
            {flakes.map((f, i) => (
                <i
                    key={i}
                    style={{
                        left: `${f.left}%`,
                        width: f.size,
                        height: f.size,
                        animationDuration: `${f.duration}s`,
                        animationDelay: `${f.delay}s`,
                        '--adv-drift': `${f.drift}px`,
                    }}
                />
            ))}
        </div>
    )
}
