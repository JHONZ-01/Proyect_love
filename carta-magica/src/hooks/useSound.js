import { useRef, useCallback } from 'react'

export function useSound(src, options = {}) {
    const { loop = false, volume = 0.7 } = options
    const audioRef = useRef(null)

    const getAudio = useCallback(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio(src)
            audioRef.current.loop = loop
            audioRef.current.volume = volume
        }
        return audioRef.current
    }, [src, loop, volume])

    const play = useCallback(() => {
        const audio = getAudio()
        audio.currentTime = 0
        audio.play().catch(() => { })
    }, [getAudio])

    const stop = useCallback(() => {
        if (!audioRef.current) return
        audioRef.current.pause()
        audioRef.current.currentTime = 0
    }, [])

    const pause = useCallback(() => {
        if (!audioRef.current) return
        audioRef.current.pause()
    }, [])

    return { play, stop, pause }
}
