import { useState, useCallback } from 'react'

export function useAnimationState() {
    const [stage, setStage] = useState('envelope')

    const startOpening = useCallback(() => {
        setStage('opening')
        setTimeout(() => {
            setStage('letter')
        }, 1200)
    }, [])

    const reset = useCallback(() => {
        setStage('envelope')
    }, [])

    return {
        stage,
        startOpening,
        reset,
        isEnvelope: stage === 'envelope',
        isOpening: stage === 'opening',
        isLetter: stage === 'letter',
    }
}