import { motion } from 'framer-motion'

/*
 * Sobre escalable: todo va en porcentajes, así que ocupa el ancho que le dé el
 * contenedor (proporción 8:5). Las solapas son polígonos con clip-path (no
 * triángulos de borde en px), lo que permite degradados y no se rompe en móvil.
 * La punta de la solapa y el sello caen en el mismo punto: 50% / 56%.
 */
const TIP = '50% 56%'
const LID = 'polygon(0 0, 100% 0, 50% 100%)'
const LEFT = `polygon(0 0, ${TIP}, 0 100%)`
const RIGHT = `polygon(100% 0, 100% 100%, ${TIP})`
const BOTTOM = `polygon(0 100%, ${TIP}, 100% 100%)`

const hidden = { backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }

const lidSpring = { type: 'spring', stiffness: 90, damping: 16 }

function Seal({ open }) {
    return (
        <motion.div
            className="absolute z-4 w-[17%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
                left: '50%',
                top: '56%',
                background: 'radial-gradient(circle at 32% 28%, var(--color-wax-light), var(--color-wax) 70%)',
                boxShadow:
                    '0 4px 10px rgba(0,0,0,.45), inset 0 -3px 4px rgba(0,0,0,.35), inset 0 2px 2px rgba(255,255,255,.25)',
            }}
            animate={{ opacity: open ? 0 : 1, scale: open ? 0.4 : 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="absolute inset-[16%] rounded-full border border-gold/80 shadow-[inset_0_1px_3px_rgba(0,0,0,.4)] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-[55%]" aria-hidden="true">
                    <path
                        d="M12 21s-7.5-4.6-9.5-9.2C1.2 8.7 3 5.5 6.2 5.5c2 0 3.4 1.1 5.8 3.3 2.4-2.2 3.8-3.3 5.8-3.3 3.2 0 5 3.2 3.7 6.3C19.5 16.4 12 21 12 21z"
                        fill="var(--color-wax-light)"
                        stroke="rgba(255,255,255,.35)"
                        strokeWidth="0.6"
                    />
                </svg>
            </div>
        </motion.div>
    )
}

/** `open` levanta la solapa y deja asomar la hoja (children). */
export default function Envelope({ open = false, children }) {
    return (
        <div className="relative w-full aspect-8/5" style={{ perspective: 900 }}>
            {/* Interior */}
            <div className="absolute inset-0 rounded-[3px] bg-kraft-deep shadow-[0_22px_40px_-12px_rgba(0,0,0,0.55)]" />

            {/* Hoja que asoma por detrás de las solapas frontales */}
            <motion.div
                className="absolute inset-x-[7%] top-[8%] h-[80%] z-1 parchment-bg rounded-sm shadow-md flex items-center justify-center"
                animate={{ y: open ? '-24%' : '0%' }}
                transition={{ type: 'spring', stiffness: 80, damping: 15 }}
            >
                {children}
            </motion.div>

            {/* Solapas frontales */}
            <div
                className="absolute inset-0 z-2"
                style={{ clipPath: LEFT, background: 'linear-gradient(100deg, var(--color-kraft-deep), var(--color-kraft))' }}
            />
            <div
                className="absolute inset-0 z-2"
                style={{ clipPath: RIGHT, background: 'linear-gradient(260deg, var(--color-kraft-deep), var(--color-kraft))' }}
            />
            <div
                className="absolute inset-0 z-2"
                style={{ clipPath: BOTTOM, background: 'linear-gradient(0deg, var(--color-kraft-light), var(--color-kraft))' }}
            />

            {/* Solapa superior: cara dorada al frente, cara interior al abrirse */}
            <motion.div
                className="absolute left-0 top-0 w-full h-[56%]"
                style={{ transformOrigin: 'top', transformStyle: 'preserve-3d' }}
                animate={{ rotateX: open ? -180 : 0, zIndex: open ? 0 : 3 }}
                transition={{ rotateX: lidSpring, zIndex: { duration: 0, delay: open ? 0.2 : 0.35 } }}
            >
                <div
                    className="absolute inset-0"
                    style={{
                        ...hidden,
                        clipPath: LID,
                        background: 'linear-gradient(165deg, var(--color-gold-light), var(--color-gold))',
                    }}
                />
                <div
                    className="absolute inset-0"
                    style={{
                        ...hidden,
                        clipPath: LID,
                        transform: 'rotateX(180deg)',
                        background: 'linear-gradient(0deg, var(--color-kraft-deep), var(--color-kraft))',
                    }}
                />
            </motion.div>

            <Seal open={open} />
        </div>
    )
}
