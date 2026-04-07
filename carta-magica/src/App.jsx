import { useState, useRef } from 'react'
import EnvelopeScene from './components/envelope/EnvelopeScene'
import Letter from './components/letter/Letter'
import ParticleBackground from './components/ui/ParticleBackground'

export default function App() {
    const [stage, setStage] = useState('envelope')
    const audioRef = useRef(null)

    const handleOpen = () => {
        if (audioRef.current) {
            audioRef.current.loop = true
            audioRef.current.play().catch(() => { })
        }
        setStage('opening')
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-[#004280]">
            <audio ref={audioRef} src="/assets/sounds/Álvaro Díaz, Cazzu, Caleb Calloway - Deportivo (Official Video).mp3" preload="none" />
            <ParticleBackground />

            {stage === 'envelope' && (
                <EnvelopeScene onOpen={handleOpen} />
            )}

            {(stage === 'opening' || stage === 'letter') && (
                <Letter stage={stage} onReady={() => setStage('letter')} />
            )}
        </div>
    )
}