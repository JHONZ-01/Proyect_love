import { useAudio } from '../../../core/AudioProvider'

/** Botón flotante para pausar o reanudar la música de fondo. */
export default function MusicToggle() {
    const { isPlaying, toggleMusic } = useAudio()

    return (
        <button
            type="button"
            onClick={toggleMusic}
            aria-pressed={isPlaying}
            className="fixed top-4 right-4 z-40 px-4 py-2 rounded-full bg-[#C8A96E] text-[#004280] font-['Playfair_Display'] font-bold shadow-lg hover:bg-[#E8D5B7] transition-colors"
        >
            {isPlaying ? '🔊 Música' : '🔇 Música'}
        </button>
    )
}
