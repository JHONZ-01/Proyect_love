// Estrellas que destellan: [x %, y %, retraso s, duración s, tamaño px]. Repartidas a mano (no al azar)
// para que el cielo se vea igual en cada visita, y cada una con su propio ritmo: ninguna parpadea a la vez.
const STARS = [
    [8, 12, 0, 4.2, 9], [22, 6, 1.2, 5.6, 7], [37, 15, 2.4, 3.6, 8], [55, 8, 0.6, 6.4, 6],
    [71, 13, 1.8, 4.8, 9], [88, 7, 3, 3.9, 7], [14, 34, 2.1, 5.1, 6], [93, 30, 0.9, 4.4, 8],
    [5, 58, 1.5, 6.1, 7], [96, 62, 2.7, 3.7, 9], [10, 84, 0.3, 5.3, 6], [90, 88, 1.1, 4.6, 8],
    [47, 3, 2.9, 5.8, 5], [63, 24, 0.4, 3.3, 5],
]

/** Estrellas que destellan suavemente (estilos «twinkle»). Solo opacidad y escala; con «reducir movimiento» quedan quietas. */
export default function Twinkles() {
    return (
        <div className="advent-twinkles" aria-hidden="true">
            {STARS.map(([x, y, delay, dur, size], i) => (
                <i
                    key={i}
                    style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, animationDelay: `${delay}s`, animationDuration: `${dur}s` }}
                />
            ))}
        </div>
    )
}
