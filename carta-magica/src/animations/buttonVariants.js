// Variantes de animación para botones (Framer Motion)

export const buttonAppear = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.8, duration: 0.6 },
}

export const buttonHover = {
    scale: 1.05,
    boxShadow: '0 8px 25px rgba(200, 169, 110, 0.5)',
}

export const buttonTap = {
    scale: 0.95,
}

export const acceptButtonPulse = {
    animate: {
        boxShadow: [
            '0 0 0 0 rgba(200, 169, 110, 0.4)',
            '0 0 0 10px rgba(200, 169, 110, 0)',
        ],
    },
    transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
    },
}

export const declineButtonDodge = {
    // El botón "no" se escapa del cursor
    getRandomOffset: () => ({
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 100,
    }),
}
