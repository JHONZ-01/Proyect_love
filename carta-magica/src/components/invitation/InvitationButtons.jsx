import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import AcceptResponse from './AcceptResponse'
import DeclineResponse from './DeclineResponse'
import { BUTTON_LABELS } from '../../constants/letterText'
import { declineButtonDodge } from '../../animations/buttonVariants'

/**
 * Botones de invitación: "Sí" y "No".
 * El botón "No" huye del cursor de forma juguetona.
 * Muestra respuesta de aceptación o declinación.
 */
export default function InvitationButtons() {
    const [response, setResponse] = useState(null) // null | 'accept' | 'decline'
    const [dodgeOffset, setDodgeOffset] = useState({ x: 0, y: 0 })
    const [dodgeCount, setDodgeCount] = useState(0)

    const handleDeclineHover = useCallback(() => {
        // Después de 3 intentos, deja que lo presione
        if (dodgeCount < 3) {
            const offset = declineButtonDodge.getRandomOffset()
            setDodgeOffset(offset)
            setDodgeCount(prev => prev + 1)
        }
    }, [dodgeCount])

    const handleAccept = () => setResponse('accept')
    const handleDecline = () => setResponse('decline')
    const handleReconsider = () => {
        setResponse(null)
        setDodgeCount(0)
        setDodgeOffset({ x: 0, y: 0 })
    }

    if (response === 'accept') return <AcceptResponse />
    if (response === 'decline') return <DeclineResponse onReconsider={handleReconsider} />

    return (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4 relative">
            {/* Botón Aceptar */}
            <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                    boxShadow: [
                        '0 0 0 0 rgba(200, 169, 110, 0.4)',
                        '0 0 0 10px rgba(200, 169, 110, 0)',
                    ],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                onClick={handleAccept}
                className="px-8 py-3 bg-[#C8A96E] text-[#004280] font-['Playfair_Display'] font-bold rounded-full shadow-xl hover:bg-[#E8D5B7] transition-colors duration-300 text-lg"
                id="accept-btn"
            >
                {BUTTON_LABELS.accept}
            </motion.button>

            {/* Botón Declinar — se escapa del cursor las primeras 3 veces */}
            <motion.button
                animate={{
                    x: dodgeOffset.x,
                    y: dodgeOffset.y,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={handleDeclineHover}
                onClick={handleDecline}
                className="px-6 py-2 bg-transparent border-2 border-[#C8A96E] text-[#C8A96E] font-['Playfair_Display'] rounded-full hover:bg-[#C8A96E]/10 transition-colors duration-300"
                id="decline-btn"
            >
                {BUTTON_LABELS.decline}
            </motion.button>
        </div>
    )
}
