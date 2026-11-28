// Posiciones fijas (en %) de las estrellas que destellan en el cielo: repartidas a mano, no al azar,
// para que el cielo se vea igual en cada visita.
const STARS = [
    [8, 12, 0], [22, 6, 1.2], [37, 15, 2.4], [55, 8, .6], [71, 13, 1.8], [88, 7, 3],
    [14, 34, 2.1], [93, 30, .9], [5, 58, 1.5], [96, 62, 2.7], [10, 84, .3], [90, 88, 1.1],
]

/** Estrellas que destellan suavemente (estilos «twinkle»). Solo opacidad; con «reducir movimiento» quedan quietas. */
export default function Twinkles() {
    return (
        <div className="advent-twinkles" aria-hidden="true">
            {STARS.map(([x, y, delay], i) => (
                <i key={i} style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${delay}s` }} />
            ))}
        </div>
    )
}
