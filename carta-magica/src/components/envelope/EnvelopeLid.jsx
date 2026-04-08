import { motion } from 'framer-motion'

/**
 * Tapa del sobre: triángulo dorado que rota con animación.
 * Recibe el controlador de animación de framer-motion.
 */
export default function EnvelopeLid({ controls }) {
    return (
        <motion.div
            animate={controls}
            initial={{ rotateX: 0 }}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 0,
                height: 0,
                borderLeft: '144px solid transparent',
                borderRight: '144px solid transparent',
                borderTop: '96px solid #d4af37',
                transformOrigin: 'top center',
                zIndex: 30,
            }}
        />
    )
}
