import { motion, useReducedMotion } from 'framer-motion'
import Envelope from './Envelope'
import Sparkles from './Sparkles'
import { BUTTON_LABELS, COVER } from '../../content'

function OpenMailIcon() {
    return (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 9.5 12 3l9 6.5V19a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
            <path d="M3 9.5 12 15l9-5.5" />
            <path d="M8 8.5h8M8 11h5" />
        </svg>
    )
}

/** Portada: mensaje, sobre cerrado con sello y botón para abrir. */
export default function EnvelopeScene({ onOpen }) {
    const reduce = useReducedMotion()

    return (
        <div className="w-full max-w-md px-4 flex flex-col items-center text-center">
            <h1 className="font-ui font-extrabold text-white text-2xl sm:text-3xl leading-tight text-balance [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">
                {COVER.title}
            </h1>
            <p className="font-ui text-white/80 mt-2 text-base sm:text-lg text-balance">
                {COVER.subtitle}
            </p>

            {/* El sobre también es clicable; el botón es el control accesible (por teclado) */}
            <motion.div
                className="relative w-[min(78vw,340px)] mt-12 cursor-pointer"
                animate={reduce ? undefined : { y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                onClick={onOpen}
                aria-hidden="true"
            >
                <div className="absolute -inset-[12%] rounded-full bg-gold/15 blur-3xl pointer-events-none" />
                <Envelope />
                <Sparkles />
            </motion.div>

            <motion.button
                type="button"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onOpen}
                className="mt-12 inline-flex items-center gap-2.5 px-10 py-3.5 min-h-12 rounded-full border-2 border-gold-light bg-linear-to-b from-gold-light to-gold text-navy font-ui font-bold text-xl shadow-[0_6px_18px_rgba(0,0,0,0.35),0_0_24px_rgba(224,176,79,0.35)] cursor-pointer"
            >
                <OpenMailIcon />
                {BUTTON_LABELS.open}
            </motion.button>
        </div>
    )
}
