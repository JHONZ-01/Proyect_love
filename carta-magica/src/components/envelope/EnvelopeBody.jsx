import { motion } from 'framer-motion'

/**
 * Cuerpo del sobre: el rectángulo dorado con triángulos laterales.
 * Se renderiza dentro de EnvelopeScene.
 */
export default function EnvelopeBody({ isHovered, children }) {
    return (
        <div className="absolute bottom-0 left-0 w-full h-full bg-[#C8A96E] rounded-b-md z-10">

            {/* Triángulo izquierdo */}
            <div style={{
                position: 'absolute', bottom: 0, left: 0,
                width: 0, height: 0,
                borderLeft: '144px solid #b38b59',
                borderTop: '96px solid transparent',
                zIndex: 20,
            }} />

            {/* Triángulo derecho */}
            <div style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 0, height: 0,
                borderRight: '144px solid #b38b59',
                borderTop: '96px solid transparent',
                zIndex: 20,
            }} />

            {/* Texto interior — visible al hover */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center z-5"
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3, delay: isHovered ? 0.3 : 0 }}
            >
                <p className="font-['Great_Vibes'] text-[#004280] text-2xl text-center leading-relaxed px-4">
                    Hay algo<br />especial<br />para ti...
                </p>
            </motion.div>

            {children}
        </div>
    )
}
