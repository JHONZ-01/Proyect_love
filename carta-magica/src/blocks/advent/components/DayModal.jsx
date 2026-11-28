import { useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Icon, { ICON_FOR_TYPE } from './Icon'
import DayContent from './DayContent'
import { CLOSE_LABEL, dayCounter } from '../content'
import { useDialogA11y } from '../hooks/useDialogA11y'

const SPARKS = 18
// Cuánto del camino desde la puerta recorre la tarjeta al aparecer: sugiere de dónde sale sin un zoom exagerado.
const FROM_DOOR = 0.35

/** Cabecera visual del modal: la foto o el vídeo del día, o la «ventana encendida» con el icono del tipo. */
function Hero({ entry }) {
    if (entry.type === 'video' && entry.video) {
        return (
            <div className="advent-sheet__video">
                <video src={entry.video} controls playsInline preload="metadata" aria-label={entry.title} />
            </div>
        )
    }
    if (entry.type === 'foto' && entry.image) {
        return (
            <div className="advent-sheet__photo">
                <img src={entry.image} alt={entry.alt ?? entry.title} />
            </div>
        )
    }
    const kind = entry.type === 'foto' ? ' advent-sheet__hero--photo' : ''
    return (
        <div className={`advent-sheet__hero${kind}`} aria-hidden="true">
            <Icon name={ICON_FOR_TYPE[entry.type]} />
        </div>
    )
}

/** Chispas del final: un solo estallido al abrir la última puerta (posiciones fijas, no al azar). */
function Sparks() {
    return Array.from({ length: SPARKS }, (_, i) => {
        const angle = (i / SPARKS) * Math.PI * 2
        const dist = 70 + (i % 3) * 30
        return (
            <i
                key={i}
                className="advent-spark"
                aria-hidden="true"
                style={{ '--adv-dx': `${Math.round(Math.cos(angle) * dist)}px`, '--adv-dy': `${Math.round(Math.sin(angle) * dist)}px` }}
            />
        )
    })
}

/**
 * Modal con el contenido de un día. Accesible (useDialogA11y): foco al botón cerrar al abrir,
 * Tab no sale del modal, Escape o tocar fuera lo cierran (quien lo abre devuelve el foco a la puerta).
 * `origin` ({ x, y }: centro de la puerta respecto al centro de la pantalla) hace que la tarjeta nazca
 * desde la puerta abierta y vuelva a ella al cerrarse.
 */
export default function DayModal({ entry, total, origin, onClose }) {
    const reduce = useReducedMotion()
    const sheetRef = useRef(null)
    const closeRef = useRef(null)
    const isFinal = entry.type === 'final'

    useDialogA11y(sheetRef, closeRef, onClose)

    const fromDoor = { opacity: 0, x: (origin?.x ?? 0) * FROM_DOOR, y: (origin?.y ?? 18) * FROM_DOOR, scale: 0.9 }

    return (
        <motion.div
            className="advent-backdrop"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
        >
            <motion.div
                ref={sheetRef}
                className={`advent-sheet${isFinal ? ' advent-sheet--final' : ''}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="advent-sheet-title"
                onClick={(e) => e.stopPropagation()}
                initial={reduce ? { opacity: 0 } : fromDoor}
                animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { ...fromDoor, transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] } }}
                transition={reduce ? { duration: 0.15 } : { type: 'spring', duration: 0.5, bounce: 0.18 }}
            >
                <button ref={closeRef} type="button" className="advent-sheet__close" aria-label={CLOSE_LABEL} onClick={onClose}>
                    ×
                </button>
                <Hero entry={entry} />
                {isFinal && !reduce && <Sparks />}
                <div className="advent-sheet__body">
                    <p className="advent-sheet__day">{dayCounter(entry.day, total)}</p>
                    <h2 id="advent-sheet-title" className="advent-sheet__title">{entry.title}</h2>
                    <DayContent entry={entry} />
                </div>
            </motion.div>
        </motion.div>
    )
}
