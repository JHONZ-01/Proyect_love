import { useState, useCallback } from 'react';

export function useAnimationState() {
    const [stage, setStage] = useState('envelope'); // 'envelope', 'opening', 'letter'

    const startOpening = useCallback(() => {
        setStage('opening');

        // Esperamos a que la animación del sobre termine antes de mostrar la carta
        setTimeout(() => {
            setStage('letter');
        }, 1200); // Ajusta este tiempo según dure tu animación de apertura
    }, []);

    return {
        stage,
        startOpening,
        isEnvelope: stage === 'envelope',
        isOpening: stage === 'opening',
        isLetter: stage === 'letter'
    };
}
