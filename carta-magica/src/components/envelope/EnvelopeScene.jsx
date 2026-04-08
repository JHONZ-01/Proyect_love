import { motion, useAnimation } from 'framer-motion'
import { useState } from 'react'

export default function EnvelopeScene({ onOpen }) {
    const [isHovered, setIsHovered] = useState(false)
    const lidControls = useAnimation()

    const handleMouseEnter = async () => {
        setIsHovered(true)
        await lidControls.start({
            rotateX: -140,
            transition: { duration: 0.5, ease: 'easeOut' }
        })
    }

    const handleMouseLeave = async () => {
        setIsHovered(false)
        await lidControls.start({
            rotateX: 0,
            transition: { duration: 0.4, ease: 'easeIn' }
        })
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">

            {/* Sobre flotante */}
            <motion.div
                className="relative cursor-pointer"
                animate={{ y: [0, -18, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ perspective: 600 }}
            >

                {/* Wrapper con perspectiva para la tapa */}
                <div className="relative w-72 h-48" style={{ perspective: '600px' }}>

                    {/* Tapa del sobre — rota hacia arriba en hover */}
                    <motion.div
                        animate={lidControls}
                        initial={{ rotateX: 0 }}
                        style={{
                            position: 'absolute',
                            top: 0, left: 0,
                            width: 0, height: 0,
                            borderLeft: '144px solid transparent',
                            borderRight: '144px solid transparent',
                            borderTop: '96px solid #d4af37',
                            transformOrigin: 'top center',
                            zIndex: 30,
                        }}
                    />

                    {/* Cuerpo del sobre */}
                    <div className="absolute bottom-0 left-0 w-full h-full bg-[#C8A96E] rounded-b-md z-10">

                        {/* Triángulos laterales */}
                        <div style={{
                            position: 'absolute', bottom: 0, left: 0,
                            width: 0, height: 0,
                            borderLeft: '144px solid #b38b59',
                            borderTop: '96px solid transparent',
                            zIndex: 20,
                        }} />
                        <div style={{
                            position: 'absolute', bottom: 0, right: 0,
                            width: 0, height: 0,
                            borderRight: '144px solid #b38b59',
                            borderTop: '96px solid transparent',
                            zIndex: 20,
                        }} />

                        {/* Texto interior — solo visible cuando la tapa se abre */}
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center z-5"
                            animate={{ opacity: isHovered ? 1 : 0 }}
                            transition={{ duration: 0.3, delay: isHovered ? 0.3 : 0 }}
                        >
                            <p className="font-['Great_Vibes'] text-[#004280] text-2xl text-center leading-relaxed px-4">
                                Hay algo<br />especial<br />para ti...
                            </p>
                        </motion.div>

                    </div>

                    {/* Sello de lacre — visible cuando está cerrado */}
                    <motion.div
                        className="absolute left-1/2 -translate-x-1/2 w-11 h-11 bg-red-800 rounded-full shadow-lg flex items-center justify-center text-xl border-2 border-[#d4af37] z-40"
                        style={{ top: '38%' }}
                        animate={{ opacity: isHovered ? 0 : 1, scale: isHovered ? 0.5 : 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        💌
                    </motion.div>

                    {/* Corazones flotantes */}
                    <motion.div
                        className="absolute inset-0 pointer-events-none z-50"
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="hearts">
                            <div className="one" />
                            <div className="two" />
                            <div className="three" />
                            <div className="four" />
                            <div className="five" />
                        </div>
                    </motion.div>

                </div>

                {/* Sombra dinámica */}
                <motion.div
                    className="w-72 rounded-full bg-black/20 blur-md mx-auto mt-4"
                    animate={{ height: isHovered ? 12 : 20, opacity: isHovered ? 0.15 : 0.25 }}
                    transition={{ duration: 0.3 }}
                />

            </motion.div>

            {/* Botón */}
            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpen}
                className="mt-16 px-10 py-3 bg-[#C8A96E] text-[#004280] font-['Playfair_Display'] font-bold rounded-full shadow-xl hover:bg-[#E8D5B7] transition-all duration-300 z-50"
            >
                Abrir Carta
            </motion.button>

        </div>
    )
}