import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Placeholder from './Placeholder'

/** Modal con la foto ampliada. Escape cierra; las flechas del teclado navegan. */
export default function PhotoModal({ photo, total, onClose, onPrev, onNext }) {
    const closeRef = useRef(null)

    useEffect(() => {
        const previous = document.activeElement
        closeRef.current?.focus()
        return () => previous?.focus?.()
    }, [])

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') onClose()
            if (e.key === 'ArrowLeft') onPrev()
            if (e.key === 'ArrowRight') onNext()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [onClose, onPrev, onNext])

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                role="dialog"
                aria-modal="true"
                aria-label={photo.title}
                className="relative w-full max-w-lg max-h-full overflow-y-auto rounded parchment-bg shadow-2xl border border-[#C8A96E]/40 font-['Playfair_Display'] text-[#4a3f35]"
                initial={{ scale: 0.85, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    ref={closeRef}
                    type="button"
                    onClick={onClose}
                    aria-label="Cerrar"
                    className="absolute top-2 right-2 z-10 w-9 h-9 rounded-full bg-black/50 text-white text-xl leading-none hover:bg-black/70"
                >
                    ×
                </button>

                <div className="aspect-[4/3] bg-black/10">
                    {photo.src
                        ? <img src={photo.src} alt={photo.title} className="w-full h-full object-cover" />
                        : <Placeholder day={photo.day} large />}
                </div>

                <div className="p-5 text-center">
                    <p className="text-sm opacity-60 mb-1">Día {photo.day} de {total}</p>
                    <h2 className="font-['Great_Vibes'] text-4xl text-[#8b5e3c] mb-2">{photo.title}</h2>
                    <p className="italic mb-5">{photo.caption}</p>

                    <div className="flex justify-between">
                        <button type="button" onClick={onPrev} className="px-4 py-2 text-[#8b5e3c] hover:underline">← Anterior</button>
                        <button type="button" onClick={onNext} className="px-4 py-2 text-[#8b5e3c] hover:underline">Siguiente →</button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}
