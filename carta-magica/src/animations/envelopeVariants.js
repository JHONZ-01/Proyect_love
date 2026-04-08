// Variantes de animación para el sobre (Framer Motion)

export const envelopeFloat = {
    animate: {
        y: [0, -18, 0],
    },
    transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
    },
}

export const lidOpen = {
    rotateX: -140,
    transition: { duration: 0.5, ease: 'easeOut' },
}

export const lidClose = {
    rotateX: 0,
    transition: { duration: 0.4, ease: 'easeIn' },
}

export const sealVariants = {
    visible: { opacity: 1, scale: 1 },
    hidden: { opacity: 0, scale: 0.5 },
}

export const peekTextVariants = {
    visible: { opacity: 1, transition: { duration: 0.3, delay: 0.3 } },
    hidden: { opacity: 0, transition: { duration: 0.3, delay: 0 } },
}

export const shadowVariants = {
    hover: { height: 12, opacity: 0.15 },
    idle: { height: 20, opacity: 0.25 },
}
