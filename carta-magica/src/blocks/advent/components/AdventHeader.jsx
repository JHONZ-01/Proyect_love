/** Cabecera: título, estado según la fecha, botón a la puerta de hoy y progreso. */
export default function AdventHeader({ art, title, line, sub, goLabel, onGo, countText, previewText }) {
    return (
        <header className="advent-head">
            {art}
            <h1 className="advent-head__title">{title}</h1>
            <p className="advent-head__line">{line}</p>
            <p className="advent-head__sub">{sub}</p>
            {goLabel && (
                <button type="button" className="advent-head__go" onClick={onGo}>
                    {goLabel}
                </button>
            )}
            {countText && <p className="advent-head__count">{countText}</p>}
            {previewText && <p className="advent-head__preview">{previewText}</p>}
        </header>
    )
}
