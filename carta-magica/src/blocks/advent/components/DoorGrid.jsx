import Door from './Door'

/**
 * Cuadrícula de puertas: 4 columnas en móvil, 6 si hay ancho (container query en advent.css).
 * La última puerta ocupa una fila entera. `doors` ya viene calculado: aquí solo se pinta.
 */
export default function DoorGrid({ doors, finalName, onActivate }) {
    return (
        <section className="advent-grid" aria-label="Puertas del calendario">
            {doors.map((door) => (
                <Door key={door.day} {...door} finalName={finalName} onActivate={onActivate} />
            ))}
        </section>
    )
}
