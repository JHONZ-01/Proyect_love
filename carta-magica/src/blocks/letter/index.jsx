import './letter.css'
import EnvelopeScene from './components/envelope/EnvelopeScene'
import Letter from './components/letter/Letter'
import { useAnimationState } from './hooks/useAnimationState'
import { useAudio } from '../../core/AudioProvider'

/** Bloque 1: sobre que se abre y carta con invitación. */
export default function LetterBlock() {
    const { stage, startOpening } = useAnimationState()
    const { startMusic } = useAudio()

    const handleOpen = () => {
        startMusic()
        startOpening()
    }

    return (
        <>
            {stage === 'envelope' && <EnvelopeScene onOpen={handleOpen} />}
            {(stage === 'opening' || stage === 'letter') && <Letter stage={stage} />}
        </>
    )
}
