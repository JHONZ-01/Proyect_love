import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DECLINE_MESSAGE } from '../../constants/letterText'

/**
 * Respuesta de declinación mejorada:
 * 1. Pregunta si está segura.
 * 2. Si dice que sí, muestra una "notita" elegante para pedir el motivo.
 * 3. Valida que el motivo no esté vacío y envía a WhatsApp.
 */
export default function DeclineResponse({ onReconsider }) {
    const [step, setStep] = useState('confirm')
    const [reason, setReason] = useState('')

    const isReasonEmpty = reason.trim() === ''

    const handleSendWhatsApp = () => {
        if (isReasonEmpty) return
        const message = encodeURIComponent(`Hola, lamentablemente no puedo aceptar porque: ${reason}`)
        // Abre WhatsApp con el mensaje prellenado
        window.open(`https://wa.me/593963367330?text=${message}`, '_blank')
    }

    return (
        <AnimatePresence mode="wait">
            {step === 'confirm' && (
                <motion.div
                    key="confirm"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4 }}
                    className="text-center py-4 flex flex-col items-center"
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
                    <p className="font-['Playfair_Display'] text-[#4a3f35] italic mb-6">
                        ¿De verdad estás segura de rechazar?
                    </p>

                    <div className="flex flex-col gap-4 items-center">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setStep('reason')}
                            className="px-6 py-2 bg-transparent text-[#8b5e3c] border border-[#8b5e3c] font-['Playfair_Display'] rounded-full hover:bg-[#8b5e3c]/10 transition-colors text-sm"
                        >
                            Sí, estoy segura
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onReconsider}
                            className="px-8 py-3 bg-[#C8A96E] text-[#004280] font-['Playfair_Display'] font-bold rounded-full shadow-lg hover:bg-[#E8D5B7] transition-colors"
                        >
                            Pensarlo de nuevo 💭
                        </motion.button>
                    </div>
                </motion.div>
            )}

            {step === 'reason' && (
                <motion.div
                    key="reason"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    // Estilos de la notita con "parchment-bg" y una "cinta adhesiva" simulada
                    className="mt-2 p-6 parchment-bg rounded shadow-2xl border border-[#C8A96E]/40 w-full max-w-xs flex flex-col relative before:absolute before:-top-3 before:left-1/2 before:-translate-x-1/2 before:w-16 before:h-4 before:bg-white/60 before:rotate-[-3deg] before:shadow-sm"
                >
                    <h4 className="font-['Great_Vibes'] text-3xl text-[#8b5e3c] mb-4 text-center">
                        Cuéntame,<br />¿por qué no?
                    </h4>

                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Escribe tu motivo aquí..."
                        className="w-full bg-transparent border-b-2 border-[#b38b59]/30 outline-none resize-none h-20 font-['Playfair_Display'] text-[#4a3f35] placeholder:text-[#4a3f35]/50 focus:border-[#b38b59] transition-colors mb-6 text-center leading-relaxed"
                    />

                    <div className="flex flex-col gap-3">
                        <motion.button
                            whileHover={!isReasonEmpty ? { scale: 1.03 } : {}}
                            whileTap={!isReasonEmpty ? { scale: 0.97 } : {}}
                            onClick={handleSendWhatsApp}
                            disabled={isReasonEmpty}
                            title={isReasonEmpty ? "Escribe un motivo primero" : "Enviar respuesta"}
                            className={`px-4 py-2.5 font-['Playfair_Display'] font-bold rounded shadow-md transition-all flex items-center justify-center gap-2 ${isReasonEmpty
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
                                    : 'bg-[#25D366] text-white hover:bg-[#1DA851]'
                                }`}
                        >
                            <span>Enviar por WhatsApp</span>
                            {/* Ícono simple de WhatsApp o Envío */}
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                            </svg>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onReconsider}
                            className="px-6 py-2 mt-2 text-[#8b5e3c] font-['Playfair_Display'] text-sm hover:underline"
                        >
                            Pensarlo de nuevo 💭
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
