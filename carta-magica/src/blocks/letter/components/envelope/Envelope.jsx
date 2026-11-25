import { motion } from 'framer-motion'
import kraft from '../../assets/kraft.webp'
import waxSeal from '../../assets/wax-seal.png'

/*
 * Sobre escalable: todo va en porcentajes, así que ocupa el ancho que le dé el
 * contenedor (proporción 8:5). Las solapas son polígonos con clip-path (no
 * triángulos de borde en px). Todas comparten la misma textura kraft sobre la caja
 * completa del sobre, así el papel se ve continuo y solo cambia la luz de cada cara.
 * La punta de la solapa y el sello caen en el mismo punto: 50% / 56%.
 */
const TIP = '50% 56%'
const LID = 'polygon(0 0, 100% 0, 50% 100%)'
const LEFT = `polygon(0 0, ${TIP}, 0 100%)`
const RIGHT = `polygon(100% 0, 100% 100%, ${TIP})`
const BOTTOM = `polygon(0 100%, ${TIP}, 100% 100%)`

const hidden = { backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }
const lidSpring = { type: 'spring', stiffness: 90, damping: 16 }

/** Textura kraft con una capa de luz/sombra encima. */
const paper = (light) => ({
    backgroundImage: `${light}, url(${kraft})`,
    backgroundSize: '100% 100%',
})

/** Cara del sobre: el contenedor lleva la sombra (el clip-path la recortaría). */
function Face({ clip, shadow, bg }) {
    return (
        <div className="absolute inset-0 z-2" style={{ filter: shadow }}>
            <div className="absolute inset-0" style={{ clipPath: clip, ...bg }} />
        </div>
    )
}

function Seal({ open }) {
    return (
        <motion.img
            src={waxSeal}
            width={360}
            height={360}
            alt=""
            draggable={false}
            className="absolute z-4 w-[22%] h-auto -translate-x-1/2 -translate-y-1/2 select-none"
            style={{ left: '50%', top: '56%', filter: 'drop-shadow(0 5px 6px rgba(0,0,0,0.45))' }}
            animate={{ opacity: open ? 0 : 1, scale: open ? 0.4 : 1 }}
            transition={{ duration: 0.3 }}
        />
    )
}

/** `open` levanta la solapa y deja asomar la hoja (children). */
export default function Envelope({ open = false, children }) {
    return (
        <div className="relative w-full aspect-8/5" style={{ perspective: 900 }}>
            {/* Interior (se ve al abrir la solapa) */}
            <div
                className="absolute inset-0 rounded-[3px] shadow-[0_22px_40px_-12px_rgba(0,0,0,0.55)]"
                style={paper('linear-gradient(rgba(45,25,5,0.5), rgba(45,25,5,0.5))')}
            />

            {/* Hoja que asoma por detrás de las solapas frontales */}
            <motion.div
                className="absolute inset-x-[7%] top-[8%] h-[80%] z-1 parchment-bg rounded-sm shadow-md flex items-center justify-center"
                animate={{ y: open ? '-24%' : '0%' }}
                transition={{ type: 'spring', stiffness: 80, damping: 15 }}
            >
                {children}
            </motion.div>

            {/* Solapas frontales: laterales en penumbra, la de abajo recibe más luz */}
            <Face clip={LEFT} shadow="drop-shadow(1px 0 2px rgba(0,0,0,0.25))" bg={paper('linear-gradient(100deg, rgba(60,35,10,0.42), rgba(60,35,10,0.1))')} />
            <Face clip={RIGHT} shadow="drop-shadow(-1px 0 2px rgba(0,0,0,0.25))" bg={paper('linear-gradient(260deg, rgba(60,35,10,0.42), rgba(60,35,10,0.1))')} />
            <Face clip={BOTTOM} shadow="drop-shadow(0 -2px 3px rgba(0,0,0,0.3))" bg={paper('linear-gradient(0deg, rgba(255,240,205,0.3), rgba(255,240,205,0))')} />

            {/* Solapa superior: cara dorada al frente, cara interior al abrirse */}
            <motion.div
                className="absolute left-0 top-0 w-full h-[56%]"
                style={{ transformOrigin: 'top', transformStyle: 'preserve-3d' }}
                animate={{ rotateX: open ? -180 : 0, zIndex: open ? 0 : 3 }}
                transition={{ rotateX: lidSpring, zIndex: { duration: 0, delay: open ? 0.2 : 0.35 } }}
            >
                <div className="absolute inset-0" style={{ ...hidden, filter: 'drop-shadow(0 3px 3px rgba(0,0,0,0.3))' }}>
                    <div
                        className="absolute inset-0"
                        style={{
                            clipPath: LID,
                            backgroundImage: `linear-gradient(165deg, rgba(244,213,126,0.9), rgba(224,176,79,0.9)), url(${kraft})`,
                            backgroundSize: 'cover',
                        }}
                    />
                </div>
                <div className="absolute inset-0" style={{ ...hidden, transform: 'rotateX(180deg)' }}>
                    <div
                        className="absolute inset-0"
                        style={{
                            clipPath: LID,
                            backgroundImage: `linear-gradient(rgba(45,25,5,0.35), rgba(45,25,5,0.1)), url(${kraft})`,
                            backgroundSize: 'cover',
                        }}
                    />
                </div>
            </motion.div>

            <Seal open={open} />
        </div>
    )
}
