import { useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useGoogleFont } from '../../../shared/useGoogleFont'
import { useDialogA11y } from '../hooks/useDialogA11y'
import Icon from './Icon'
import { CLOSE_LABEL, IN_USE_LABEL, PICKER_HINT, PICKER_TITLE } from '../content'

/** Carga la letra de un estilo mientras el selector está abierto (para que cada tarjeta se vea con la suya). */
function FontLink({ href }) {
    useGoogleFont(href)
    return null
}

/** Cuatro puertas de muestra (abierta, hoy, sin abrir, bloqueada) pintadas con los colores del estilo. */
function MiniDoors() {
    return (
        <span className="advent-pcard__doors" aria-hidden="true">
            <span className="advent-door" data-shape="small" data-state="open">
                <span className="advent-door__body">
                    <span className="advent-door__inside"><Icon name="heart" /></span>
                    <span className="advent-door__leaf" />
                </span>
            </span>
            <span className="advent-door" data-shape="small" data-state="today">
                <span className="advent-door__body">
                    <span className="advent-door__leaf" />
                    <span className="advent-door__plate"><span className="advent-door__num">2</span></span>
                </span>
            </span>
            <span className="advent-door" data-shape="small" data-state="available">
                <span className="advent-door__body">
                    <span className="advent-door__leaf" />
                    <span className="advent-door__plate"><span className="advent-door__dot" /><span className="advent-door__num">3</span></span>
                </span>
            </span>
            <span className="advent-door" data-shape="small" data-state="locked">
                <span className="advent-door__body">
                    <span className="advent-door__leaf" />
                    <span className="advent-door__plate"><Icon name="lock" className="advent-door__lock" /><span className="advent-door__num">4</span></span>
                </span>
            </span>
        </span>
    )
}

/**
 * Hoja inferior para elegir estilo. Cada tarjeta se pinta con su propio estilo (data-adv-theme),
 * así se ve el resultado antes de elegir. Elegir aplica el estilo al momento y la hoja sigue
 * abierta para poder probar otros; se cierra con la ✕, Escape o tocando fuera.
 */
export default function StylePicker({ themes, currentId, onChoose, onClose }) {
    const reduce = useReducedMotion()
    const sheetRef = useRef(null)
    const closeRef = useRef(null)
    useDialogA11y(sheetRef, closeRef, onClose)

    return (
        <motion.div
            className="advent-backdrop advent-backdrop--bottom"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
        >
            {themes.map((t) => <FontLink key={t.id} href={t.fontUrl} />)}
            <motion.div
                ref={sheetRef}
                className="advent-picker"
                role="dialog"
                aria-modal="true"
                aria-labelledby="advent-picker-title"
                onClick={(e) => e.stopPropagation()}
                initial={reduce ? { opacity: 0 } : { y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={reduce ? { opacity: 0 } : { y: 40, opacity: 0 }}
                transition={reduce ? { duration: 0.15 } : { type: 'spring', stiffness: 300, damping: 30 }}
            >
                <div className="advent-picker__top">
                    <div>
                        <h2 id="advent-picker-title" className="advent-picker__title">{PICKER_TITLE}</h2>
                        <p className="advent-picker__hint">{PICKER_HINT}</p>
                    </div>
                    <button ref={closeRef} type="button" className="advent-picker__close" aria-label={CLOSE_LABEL} onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="advent-picker__grid">
                    {themes.map((t) => {
                        const current = t.id === currentId
                        return (
                            <button
                                key={t.id}
                                type="button"
                                className="advent-pcard"
                                data-adv-theme={t.id}
                                aria-pressed={current}
                                onClick={() => onChoose(t.id)}
                            >
                                <span className="advent-pcard__name">{t.name}</span>
                                <span className="advent-pcard__desc">{t.description}</span>
                                <MiniDoors />
                                {current && <span className="advent-pcard__badge">{IN_USE_LABEL}</span>}
                            </button>
                        )
                    })}
                </div>
            </motion.div>
        </motion.div>
    )
}
