import { useRef, useState } from 'react'
import { paragraphs, isSafeLink } from '../lib/text'
import { COUPON_NOTE, LISTEN_LABEL, NEW_TAB_NOTE, REVEAL_LABEL, WATCH_LABEL } from '../content'

function Paragraphs({ text }) {
    return paragraphs(text).map((p, i) => (
        <p key={i} className="advent-sheet__text">{p}</p>
    ))
}

function Coupon({ coupon }) {
    return (
        <div className="advent-coupon">
            <p>{coupon}</p>
            <small>{COUPON_NOTE}</small>
        </div>
    )
}

function Song({ song }) {
    return (
        <div className="advent-song">
            <p className="advent-song__title">{song.title}</p>
            <p className="advent-song__artist">{song.artist}</p>
            {isSafeLink(song.url) && (
                <a className="advent-btn" href={song.url.trim()} target="_blank" rel="noopener noreferrer">
                    {LISTEN_LABEL}
                    <span className="advent-vh">{NEW_TAB_NOTE}</span>
                </a>
            )}
        </div>
    )
}

/** Vídeo sin archivo propio: botón a un enlace https (si lo hay). Con archivo, el vídeo va arriba (DayModal). */
function VideoLink({ entry }) {
    if (entry.video || !isSafeLink(entry.url)) return null
    return (
        <div className="advent-song">
            <a className="advent-btn" href={entry.url.trim()} target="_blank" rel="noopener noreferrer">
                {WATCH_LABEL}
                <span className="advent-vh">{NEW_TAB_NOTE}</span>
            </a>
        </div>
    )
}

/** La respuesta aparece al tocar el botón; el foco pasa a la respuesta para que no se pierda. */
function Riddle({ answer }) {
    const [shown, setShown] = useState(false)
    const answerRef = useRef(null)

    const reveal = () => {
        setShown(true)
        requestAnimationFrame(() => answerRef.current?.focus())
    }

    return (
        <div className="advent-riddle">
            {!shown && (
                <button type="button" className="advent-btn" onClick={reveal}>
                    {REVEAL_LABEL}
                </button>
            )}
            <p ref={answerRef} className="advent-riddle__answer" tabIndex={-1} aria-live="polite">
                {shown ? answer : ''}
            </p>
        </div>
    )
}

/** Cuerpo del modal según el tipo de contenido del día. */
export default function DayContent({ entry }) {
    return (
        <>
            {entry.type === 'cancion' && <Song song={entry.song} />}
            {entry.type === 'video' && <VideoLink entry={entry} />}
            <Paragraphs text={entry.text} />
            {entry.type === 'vale' && <Coupon coupon={entry.coupon} />}
            {entry.type === 'reto' && <Riddle answer={entry.answer} />}
        </>
    )
}
