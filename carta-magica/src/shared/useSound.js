import { useCallback, useEffect, useRef } from 'react'

/**
 * Un `Audio` del navegador creado la primera vez que se usa.
 * `play` y `resume` devuelven una promesa con `true` si empezó a sonar y `false` si el navegador
 * lo bloqueó (por ejemplo, sin un gesto del usuario). `onStateChange(sonando)` avisa de cada
 * cambio real (también si se pausa desde los controles del sistema) y `onEnded()` cuando termina
 * una canción que no se repite. Si cambia `src`, el audio anterior se detiene y se descarta.
 */
export function useSound(src, options = {}) {
    const { loop = false, volume = 0.7, onStateChange, onEnded } = options
    const audioRef = useRef(null)
    const volumeRef = useRef(volume)
    const onChangeRef = useRef(onStateChange)
    const onEndedRef = useRef(onEnded)
    onChangeRef.current = onStateChange
    onEndedRef.current = onEnded

    // Al cambiar de canción (o al desmontar), se para y se suelta el audio anterior.
    useEffect(() => () => {
        const audio = audioRef.current
        if (audio) {
            audio.pause()
            audioRef.current = null
        }
    }, [src])

    const getAudio = useCallback(() => {
        if (!audioRef.current) {
            const audio = new Audio(src)
            audio.loop = loop
            audio.volume = volumeRef.current
            audio.addEventListener('play', () => onChangeRef.current?.(true))
            audio.addEventListener('pause', () => onChangeRef.current?.(false))
            audio.addEventListener('ended', () => {
                onChangeRef.current?.(false)
                onEndedRef.current?.()
            })
            audioRef.current = audio
        }
        return audioRef.current
    }, [src, loop])

    const play = useCallback(() => {
        const audio = getAudio()
        audio.currentTime = 0
        return audio.play().then(() => true, () => false)
    }, [getAudio])

    // Continúa desde donde se pausó (play reinicia desde el principio).
    const resume = useCallback(() => getAudio().play().then(() => true, () => false), [getAudio])

    const stop = useCallback(() => {
        if (!audioRef.current) return
        audioRef.current.pause()
        audioRef.current.currentTime = 0
    }, [])

    const pause = useCallback(() => {
        if (!audioRef.current) return
        audioRef.current.pause()
    }, [])

    /** Volumen entre 0 y 1. En iPhone/iPad el navegador lo ignora (manda el botón físico). */
    const setVolume = useCallback((value) => {
        const v = Math.min(1, Math.max(0, Number(value) || 0))
        volumeRef.current = v
        if (audioRef.current) audioRef.current.volume = v
    }, [])

    return { play, resume, stop, pause, setVolume }
}
