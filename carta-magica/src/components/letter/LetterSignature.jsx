import { motion } from 'framer-motion'
import { LETTER_SIGNATURE } from '../../constants/letterText'
import { signatureFadeUp } from '../../animations/letterVariants'

export default function LetterSignature() {
    return (
        <motion.div
            {...signatureFadeUp}
            className="mt-12 text-center"
        >
            <div className="h-px w-16 bg-[#b38b59] mx-auto mb-6 opacity-50" />
            <p className="font-['Great_Vibes'] text-4xl text-[#8b5e3c]">
                {LETTER_SIGNATURE}
            </p>
        </motion.div>
    )
}