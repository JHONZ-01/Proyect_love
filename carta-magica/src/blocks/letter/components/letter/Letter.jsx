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
                    
                    {/* Líneas simulando el doblez en 3 */}
                    <div className="absolute top-1/3 left-0 w-full h-[1px] bg-black/10 shadow-[0_1px_2px_rgba(255,255,255,0.5)] z-0" />
                    <div className="absolute top-2/3 left-0 w-full h-[1px] bg-black/10 shadow-[0_1px_2px_rgba(255,255,255,0.5)] z-0" />

                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, scaleY: 0.3, originY: 0.5 }}
                                animate={{ opacity: 1, scaleY: 1 }}
                                transition={{ 
                                    delay: 1.2, /* Espera a que salga un poco del sobre */
                                    duration: 1.5,
                                    type: 'spring',
                                    stiffness: 70 
                                }}
                                className="relative z-10 w-full h-full flex flex-col justify-between"
                            >
                                <div className="h-1/3 flex flex-col justify-center">
                                    <LetterHeader />
                                </div>
                                <div className="h-auto min-h-[33%] flex items-center justify-center">
                                    <LetterBody />
                                </div>
                                <div className="h-1/3 flex flex-col justify-center pb-4">
                                    <LetterSignature />
                                    {showContent && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 2.5, duration: 0.6 }}
                                            className="mt-6"
                                        >
                                            <InvitationButtons />
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    )
}