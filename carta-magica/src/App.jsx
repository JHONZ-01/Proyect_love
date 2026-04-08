import { useState, useRef } from 'react'
import EnvelopeScene from './components/envelope/EnvelopeScene'
import Letter from './components/letter/Letter'
import ParticleBackground from './components/ui/ParticleBackground'
import { useSound } from './hooks/useSound'
import { useAnimationState } from './hooks/useAnimationState'

// Importando el archivo de audio correctamente para que Vite lo procese
import bgMusic from './assets/sounds/Jesse Baez, LATIN MAFIA - Persona Favorita.mp3'

export default function App() {
    const { stage, startOpening } = useAnimationState()
    const { play } = useSound(bgMusic, {
        loop: true,
        volume: 0.6,
    })

    const handleOpen = () => {
        play()
        startOpening()
    }

    return (
        <div className="relative min-h-screen w-full flex flex-col overflow-x-hidden overflow-y-auto bg-[#004280]">
            <ParticleBackground />

            {/* Este contenedor usa flex-1 y py-20 para asegurar que, si el contenido crece mucho, pueda scrollear sin cortar la parte superior */}
            <div className="flex-1 w-full flex flex-col items-center justify-center py-24 mb-32 z-10">
                {stage === 'envelope' && (
                    <EnvelopeScene onOpen={handleOpen} />
                )}

                {(stage === 'opening' || stage === 'letter') && (
                    <Letter stage={stage} />
                )}
            </div>
        </div>
    )
}