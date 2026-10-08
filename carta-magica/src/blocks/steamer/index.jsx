import './steamer.css'
import { useGoogleFont } from '../../shared/useGoogleFont'
import Dumpling from './components/Dumpling'
import {
    STEAMER_TITLE,
    STEAMER_LIFT_LABEL,
    STEAMER_CAPTION_CLOSED,
    STEAMER_CAPTION_OPEN,
    STEAMER_FONT_URL,
} from './content'

/**
 * Bloque 3: cesto de vapor con bolitas. Toda la interacción es CSS:
 * el checkbox oculto abre la tapa (selector :checked + hermanos).
 * La estructura (input, label.steamer, h1, p.caption) debe mantenerse en ese orden.
 */
export default function SteamerBlock() {
    useGoogleFont(STEAMER_FONT_URL)

    return (
        <div className="steamer-block">
            <main className="scene">
                <input className="lid-toggle visually-hidden" type="checkbox" id="lid-toggle" />
                <label className="steamer" htmlFor="lid-toggle">
                    <span className="visually-hidden">{STEAMER_LIFT_LABEL}</span>
                    <span className="table-shadow" />
                    <span className="basket-rim" />
                    <span className="basket-inner-wall" />
                    <span className="basket-floor" />
                    <span className="dumplings">
                        <Dumpling variant="left" mouth="smile" />
                        <Dumpling variant="middle" mouth="grin" />
                        <Dumpling variant="right" mouth="smile" />
                    </span>
                    <span className="basket-front">
                        <span className="basket-line basket-line-top" />
                        <span className="basket-line basket-line-seam" />
                        <span className="basket-line basket-line-bottom" />
                        <span className="basket-overlap" />
                        <span className="basket-tie" />
                    </span>
                    <span className="lid">
                        <span className="lid-body">
                            <span className="lid-side">
                                <span className="lid-side-line" />
                            </span>
                            <span className="lid-top" />
                        </span>
                    </span>
                    <span className="steam">
                        <span className="puff puff-far-left" />
                        <span className="puff puff-left" />
                        <span className="puff puff-right" />
                        <span className="puff puff-far-right" />
                    </span>
                    <span className="snore" aria-hidden="true">
                        <span className="snore-letter">z</span>
                        <span className="snore-letter">z</span>
                        <span className="snore-letter">z</span>
                    </span>
                </label>
                <h1 className="title">{STEAMER_TITLE}</h1>
                <p className="caption">
                    <span className="caption-closed">{STEAMER_CAPTION_CLOSED}</span>
                    <span className="caption-open">{STEAMER_CAPTION_OPEN}</span>
                </p>
            </main>
        </div>
    )
}
