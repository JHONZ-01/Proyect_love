import { useState } from 'react'
import EnvelopeScene from './components/envelope/EnvelopeScene'
import Letter from './components/letter/Letter'
import ParticleBackground from './components/ui/ParticleBackground'

// Estado global de la experiencia
// 'envelope' → 'opening' → 'letter'
export default function App() {
    const [stage, setStage] = useState('envelope')

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-[#004280]">

            {/* Partículas de fondo (siempre visibles) */}
            <ParticleBackground />

            {/* Escena del sobre */}
            {stage === 'envelope' && (
                <EnvelopeScene onOpen={() => setStage('opening')} />
            )}

            {/* Carta completa */}
            {(stage === 'opening' || stage === 'letter') && (
                <Letter
                    stage={stage}
                    onReady={() => setStage('letter')}
                />
            )}

        </div>
    )
}