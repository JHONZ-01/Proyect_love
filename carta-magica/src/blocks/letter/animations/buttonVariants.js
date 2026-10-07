// Variantes de animación para botones (Framer Motion)

export const declineButtonDodge = {
    // El botón "no" se escapa del cursor
    getRandomOffset: () => ({
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 100,
    }),
}
