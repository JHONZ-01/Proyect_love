import Icon from './Icon'
import { STYLE_BUTTON_ARIA, STYLE_BUTTON_LABEL } from '../content'

/** Botón flotante para abrir el selector de estilos (abajo a la derecha). */
export default function StyleButton({ expanded, onClick }) {
    return (
        <button
            type="button"
            className="advent-stylebtn"
            aria-haspopup="dialog"
            aria-expanded={expanded}
            aria-label={STYLE_BUTTON_ARIA}
            onClick={onClick}
        >
            <Icon name="palette" />
            <span aria-hidden="true">{STYLE_BUTTON_LABEL}</span>
        </button>
    )
}
