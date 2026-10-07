import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useSound } from '../shared/useSound'

const noop = () => { }
const AudioContext = createContext({
    isPlaying: false,
    startMusic: noop,
    stopMusic: noop,
    toggleMusic: noop,
})

/**
 * Música de fondo del bloque activo, controlada por el shell.
 * El bloque pide `startMusic()` desde un gesto del usuario (los navegadores
 * bloquean el audio automático). Al desmontarse el bloque, la música se detiene.
 */
export function AudioProvider({ src, volume = 0.6, children }) {
    const { play, resume, pause, stop } = useSound(src, { loop: true, volume })
    const [isPlaying, setIsPlaying] = useState(false)

    useEffect(() => stop, [stop])

    const startMusic = useCallback(() => {
        play()
        setIsPlaying(true)
    }, [play])

    const stopMusic = useCallback(() => {
        stop()
        setIsPlaying(false)
    }, [stop])

    const toggleMusic = useCallback(() => {
        if (isPlaying) {
            pause()
            setIsPlaying(false)
        } else {
            resume()
            setIsPlaying(true)
        }
    }, [isPlaying, pause, resume])

    const value = useMemo(
        () => ({ isPlaying, startMusic, stopMusic, toggleMusic }),
        [isPlaying, startMusic, stopMusic, toggleMusic]
    )

    return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
}

export const useAudio = () => useContext(AudioContext)
