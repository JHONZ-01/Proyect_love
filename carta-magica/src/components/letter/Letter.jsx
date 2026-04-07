import { motion } from 'framer-motion'
import LetterHeader from './LetterHeader'
import LetterBody from './LetterBody'
import LetterSignature from './LetterSignature'
import InvitationButtons from '../invitation/InvitationButtons'

export default function Letter({ stage, onReady }) {
    return (
        <motion.div
            initial={{ y: 500, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={onReady}
            className="will-change-transform relative z-20 max-w-lg w-full parchment-bg p-8 md:p-12 rounded-sm border-l-[6px] border-[#C8A96E]"
            style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.4)' }}
        >
            <LetterHeader />
            <LetterBody />
            <LetterSignature />

            {stage === 'letter' && (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <InvitationButtons />
                </motion.div>
            )}
        </motion.div>
    )
}