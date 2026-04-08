import { motion } from 'framer-motion'
import { ACCEPT_MESSAGE } from '../../constants/letterText'
import { confettiPop } from '../../animations/letterVariants'

/**
 * Respuesta de aceptación: se muestra cuando el usuario acepta la invitación.
 * Incluye confeti emoji y mensaje de felicidad.
 */
export default function AcceptResponse() {
    const confettiEmojis = ['🎉', '💖', '✨', '🥳', '💫', '🌟', '💝', '🎊']

    return (
        <motion.div
            {...confettiPop}
            className="text-center py-6"
        >
            {/* Confeti de emojis */}
            <div className="relative mb-4">
                {confettiEmojis.map((emoji, i) => (
                    <motion.span
                        key={i}
                        className="absolute text-2xl"
                        style={{
                            left: `${10 + (i * 11)}%`,
                            top: '-10px',
                        }}
                        animate={{
                            y: [0, -30, 10],
                            opacity: [0, 1, 0],
                            rotate: [0, Math.random() * 360],
                        }}
                        transition={{
                            duration: 1.5,
                            delay: i * 0.1,
                            repeat: Infinity,
                            repeatDelay: 2,
                        }}
                    >
                        {emoji}
                    </motion.span>
                ))}
            </div>

            <motion.span
                className="text-6xl block mb-4"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1.5 }}
            >
                {ACCEPT_MESSAGE.emoji}
            </motion.span>

            <h3 className="font-['Great_Vibes'] text-3xl text-[#8b5e3c] mb-2">
                {ACCEPT_MESSAGE.title}
            </h3>
            <p className="font-['Playfair_Display'] text-[#4a3f35] italic">
                {ACCEPT_MESSAGE.subtitle}
            </p>
        </motion.div>
    )
}
