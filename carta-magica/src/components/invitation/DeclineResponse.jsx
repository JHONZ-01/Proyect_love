import { motion } from 'framer-motion'
import { DECLINE_MESSAGE } from '../../constants/letterText'

/**
 * Respuesta de declinación: se muestra brevemente
 * cuando el usuario dice "no", con un mensaje juguetón.
 */
export default function DeclineResponse({ onReconsider }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center py-6"
        >
            <motion.span
                className="text-5xl block mb-4"
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 2 }}
            >
                {DECLINE_MESSAGE.emoji}
            </motion.span>

            <h3 className="font-['Great_Vibes'] text-3xl text-[#8b5e3c] mb-2">
                {DECLINE_MESSAGE.title}
            </h3>
            <p className="font-['Playfair_Display'] text-[#4a3f35] italic mb-4">
                {DECLINE_MESSAGE.subtitle}
            </p>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onReconsider}
                className="mt-2 px-6 py-2 bg-[#C8A96E] text-[#004280] font-['Playfair_Display'] font-bold rounded-full shadow-lg hover:bg-[#E8D5B7] transition-colors duration-300"
            >
                Pensarlo de nuevo 💭
            </motion.button>
        </motion.div>
    )
}
