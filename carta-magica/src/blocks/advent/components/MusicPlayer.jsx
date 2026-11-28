import { useAudio } from '../../../core/AudioProvider'
import Icon from './Icon'
import {
    MUSIC_FALLBACK_TITLE,
    MUSIC_MISSING,
    MUSIC_NEXT,
    MUSIC_PAUSE,
    MUSIC_PAUSED,
    MUSIC_PLAY,
    MUSIC_PLAYING,
    MUSIC_VOLUME,
} from '../content'

/**
 * Reproductor de ambiente: usa el audio que ya gestiona el shell (core/AudioProvider), no crea otro.
 * Reproducir/pausar, pasar a la siguiente canción (si hay más de una), volumen y estado.
 * Sin canción configurada no se muestra a quien recibe el calendario; en vista previa avisa a quien
 * lo prepara de dónde poner el archivo.
 */
export default function MusicPlayer({ showMissing = false }) {
    const { hasMusic, title, tracks, trackIndex, isPlaying, volume, toggleMusic, nextTrack, setVolume } = useAudio()

    if (!hasMusic) {
        return showMissing ? <p className="advent-music advent-music--missing">{MUSIC_MISSING}</p> : null
    }

    const several = tracks.length > 1
    const nextTitle = several ? tracks[(trackIndex + 1) % tracks.length].title : null

    return (
        <div className="advent-music" data-playing={isPlaying ? 'true' : 'false'}>
            <button
                type="button"
                className="advent-music__toggle"
                aria-label={isPlaying ? MUSIC_PAUSE : MUSIC_PLAY}
                onClick={toggleMusic}
            >
                <Icon name={isPlaying ? 'pause' : 'play-solid'} />
            </button>
            <span className="advent-music__info" aria-live="polite">
                <span className="advent-music__title">{title ?? MUSIC_FALLBACK_TITLE}</span>
                <span className="advent-music__state">
                    <span className="advent-music__bars" aria-hidden="true"><i /><i /><i /><i /></span>
                    {isPlaying ? MUSIC_PLAYING : MUSIC_PAUSED}
                    {several && <span className="advent-music__count">· {trackIndex + 1}/{tracks.length}</span>}
                </span>
            </span>
            {several && (
                <button
                    type="button"
                    className="advent-music__next"
                    aria-label={nextTitle ? `${MUSIC_NEXT}: ${nextTitle}` : MUSIC_NEXT}
                    title={nextTitle ?? MUSIC_NEXT}
                    onClick={nextTrack}
                >
                    <Icon name="next" />
                </button>
            )}
            <label className="advent-music__volume">
                <span className="advent-vh">{MUSIC_VOLUME}</span>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                />
            </label>
        </div>
    )
}
