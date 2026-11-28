import { motion, useReducedMotion } from 'framer-motion'
import { useGoogleFont } from '../../../shared/useGoogleFont'
import Icon from './Icon'
import { DEDICATION } from '../content'

// Letra manuscrita solo para la firma.
const SIGNATURE_FONT = 'https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap'

/**
 * Dedicatoria y firma: una nota de papel con un sello de lacre, separada del calendario pero en la
 * misma escena. Aparece suavemente la primera vez que llega a la vista (dentro del contenedor que se
 * desplaza, `scrollRoot`). Texto y nombre en content.js (DEDICATION).
 */
export default function Dedication({ scrollRoot }) {
    useGoogleFont(SIGNATURE_FONT)
    const reduce = useReducedMotion()

    return (
        <motion.section
            className="advent-dedication"
            aria-label="Dedicatoria"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28, rotate: -1.5 }}
            whileInView={{ opacity: 1, y: 0, rotate: -0.6 }}
            viewport={{ root: scrollRoot, once: true, amount: 0.4 }}
            transition={reduce ? { duration: 0.3 } : { type: 'spring', duration: 0.9, bounce: 0.12 }}
        >
            {/* Ramita de acebo: dos hojas y tres bayas (dibujo propio) */}
            <svg className="advent-dedication__holly" viewBox="0 0 64 40" aria-hidden="true">
                <path className="advent-dedication__leaf" d="M32 24C27 14 15 9 4 12c3 3 3 7 1 10 4 0 7 2 8 6 3-2 7-2 10 1 1-4 5-6 9-5z" />
                <path className="advent-dedication__leaf" d="M32 24c5-10 17-15 28-12-3 3-3 7-1 10-4 0-7 2-8 6-3-2-7-2-10 1-1-4-5-6-9-5z" />
                <path className="advent-dedication__vein" d="M30 23C23 17 14 14 8 14M34 23c7-6 16-9 22-9" />
                <circle className="advent-dedication__berry" cx="28.5" cy="27" r="3.6" />
                <circle className="advent-dedication__berry" cx="35.5" cy="27" r="3.6" />
                <circle className="advent-dedication__berry" cx="32" cy="21.5" r="3.6" />
            </svg>
            <p className="advent-dedication__text">{DEDICATION.text}</p>
            <p className="advent-dedication__by">{DEDICATION.signedBy}</p>
            <p className="advent-dedication__name">
                {DEDICATION.name}
                <svg className="advent-dedication__underline" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M3 8c40-6 90-7 140-3 20 1.6 38 1 54-3" />
                </svg>
            </p>
            <span className="advent-dedication__seal" aria-hidden="true">
                <Icon name="heart" />
            </span>
        </motion.section>
    )
}
