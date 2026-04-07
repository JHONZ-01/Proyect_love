import { motion } from 'framer-motion'

export default function LetterSignature() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 1 }}
            className="mt-12 text-center"
        >
            <div className="h-px w-16 bg-[#b38b59] mx-auto mb-6 opacity-50" />
            <p className="font-vibes text-4xl text-[#8b5e3c]">
                Con cariño...
            </p>
        </motion.div>
    )
}