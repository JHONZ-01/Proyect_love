/**
 * Aviso breve al tocar una puerta bloqueada («La puerta 12 se abre el 12 de diciembre.»).
 * La región aria-live existe siempre, para que el lector de pantalla anuncie el cambio de texto.
 */
export default function LockedHint({ text }) {
    return (
        <div className="advent-toast" role="status" aria-live="polite" data-show={text ? 'true' : 'false'}>
            {text}
        </div>
    )
}
