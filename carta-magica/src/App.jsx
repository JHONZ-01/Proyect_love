import { useState, useRef } from 'react'
import EnvelopeScene from './components/envelope/EnvelopeScene'
import Letter from './components/letter/Letter'
import ParticleBackground from './components/ui/ParticleBackground'
import { useSound } from './hooks/useSound'
import { useAnimationState } from './hooks/useAnimationState';

export default function App() {
    const { stage, startOpening } = useAnimationState()
    const { play } = useSound('/assets/sounds/Álvaro Díaz, Cazzu, Caleb Calloway - Deportivo (Official Video).mp3', {
        loop: true,
        volume: 0.6,
    })
    const handleOpen = () => {
        play()
        startOpening()
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-[#004280]">
            <ParticleBackground />

            {stage === 'envelope' && (
                <EnvelopeScene onOpen={handleOpen} />
            )}

            {(stage === 'opening' || stage === 'letter') && (
                <Letter stage={stage} />
            )}
        </div>
    )
}