import { motion, AnimatePresence } from 'framer-motion'
import LetterHeader from './LetterHeader'
import LetterBody from './LetterBody'
import LetterSignature from './LetterSignature'
import InvitationButtons from '../invitation/InvitationButtons'

export default function Letter({ stage }) {
    const isOpen = stage === 'opening' || stage === 'letter'
    const showContent = stage === 'letter'

    return (
        <div className="relative flex flex-col items-center">
            <div className={`envelope-3d ${isOpen ? 'open' : ''}`}>

                {/* Tapa — rota hacia atrás al abrirse via CSS */}
                <div className="flap-top" />

                {/* Frente del sobre */}
                <div className="flap-front" />

                {/* La carta que sube */}
                <div className="letter-physical shadow-2xl rounded-sm border-l-4 border-[#C8A96E] parchment-bg">
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 2.5, duration: 0.8 }}
                            >
                                <LetterHeader />
                                <LetterBody />
                                <LetterSignature />

                                {showContent && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4, duration: 0.6 }}
                                        className="mt-6"
                                    >
                                        <InvitationButtons />
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    )
}