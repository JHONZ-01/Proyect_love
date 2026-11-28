/**
 * Cabecera en tres zonas: reloj (inicio), título y estado (centro) y reproductor (final).
 * En pantallas anchas van en una fila; en móvil, el centro arriba y reloj y música debajo, en una fila.
 * Las zonas laterales se omiten si están vacías.
 */
export default function AdventHeader({ art, title, line, sub, countdown, goLabel, onGo, countText, previewText, start, end }) {
    return (
        <header className="advent-head">
            <div className="advent-head__main">
                {art}
                <h1 className="advent-head__title">{title}</h1>
                <p className="advent-head__line">{line}</p>
                <p className="advent-head__sub">{sub}</p>
                {countdown}
                {goLabel && (
                    <button type="button" className="advent-head__go" onClick={onGo}>
                        {goLabel}
                    </button>
                )}
                {countText && <p className="advent-head__count">{countText}</p>}
                {previewText && <p className="advent-head__preview">{previewText}</p>}
            </div>
            {start && <div className="advent-head__side advent-head__side--start">{start}</div>}
            {end && <div className="advent-head__side advent-head__side--end">{end}</div>}
        </header>
    )
}
