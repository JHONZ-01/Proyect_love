// Variantes de animación para la carta (Framer Motion)

export const letterFadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { delay: 2.5, duration: 0.8 },
}

export const letterContentSlide = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.4, duration: 0.6 },
}

export const signatureFadeUp = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 2.5, duration: 1 },
}

export const confettiPop = {
    initial: { scale: 0, opacity: 0 },
    animate: {
        scale: [0, 1.2, 1],
        opacity: [0, 1, 1],
    },
    transition: { duration: 0.6, ease: 'easeOut' },
}
