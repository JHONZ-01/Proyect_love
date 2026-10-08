import { motion } from 'framer-motion'
import { LETTER_SIGNATURE } from '../../content'
import { signatureFadeUp } from '../../animations/letterVariants'

export default function LetterSignature() {
    return (
        <motion.div
            {...signatureFadeUp}
            className="mt-12 text-center"
        >
            <div className="h-px w-16 bg-gold-deep mx-auto mb-6 opacity-50" />
            <p className="font-script text-4xl text-sepia">
                {LETTER_SIGNATURE}
            </p>
        </motion.div>
    )
}