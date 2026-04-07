import { motion } from 'framer-motion'

export default function EnvelopeScene({ onOpen }) {
    return (
        <div className="flex flex-col items-center justify-center">

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
                className="relative"
            >
                <div className="w-64 h-44 bg-[#C8A96E] rounded-md shadow-2xl relative flex items-center justify-center border-2 border-[#E8D5B7]/20">

                    {/* Sello */}
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 bg-red-800 rounded-full shadow-lg flex items-center justify-center text-white text-2xl border-2 border-[#C8A96E]">
                        💌
                    </div>

                    <span className="font-['Great_Vibes'] text-[#004280] text-2xl">
                        Para ti
                    </span>
                </div>
            </motion.div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpen}
                className="mt-12 px-8 py-3 bg-[#C8A96E] text-[#004280] font-['Playfair_Display'] font-semibold rounded-full shadow-xl hover:bg-[#E8D5B7] transition-all duration-300"
            >
                Abrir Carta
            </motion.button>
        </div>
    )
}