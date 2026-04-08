import { motion } from 'framer-motion';

export default function ParticleBackground() {
    // Creamos un array de 30 partículas con posiciones aleatorias
    const particles = Array.from({ length: 30 });

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {particles.map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-white rounded-full opacity-20"
                    style={{
                        width: Math.random() * 4 + 2 + 'px',
                        height: Math.random() * 4 + 2 + 'px',
                        left: Math.random() * 100 + '%',
                        top: Math.random() * 100 + '%',
                        filter: 'blur(1px)',
                        boxShadow: '0 0 10px white',
                    }}
                    animate={{
                        y: [0, -100, 0],
                        opacity: [0.1, 0.5, 0.1],
                        scale: [1, 1.5, 1],
                    }}
                    transition={{
                        duration: Math.random() * 5 + 5,
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 5,
                    }}
                />
            ))}

            {/* Añadimos un degradado radial para que el centro sea más claro que los bordes */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,66,128,0)_0%,rgba(0,20,40,0.5)_100%)]" />
        </div>
    );
}