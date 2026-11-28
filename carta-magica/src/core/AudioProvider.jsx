import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useSound } from '../shared/useSound'

const noop = () => { }
const AudioContext = createContext({
    hasMusic: false,
    title: null,
    tracks: [],
    trackIndex: 0,
    isPlaying: false,
    volume: 0.6,
    startMusic: noop,
    stopMusic: noop,
    toggleMusic: noop,
    nextTrack: noop,
    selectTrack: noop,
    setVolume: noop,
})

/**
 * Música de fondo del bloque activo, controlada por el shell.
 * Admite una canción (`src` + `title`, como la carta y la galería) o una lista (`tracks`:
 * [{ src, title }]). Con una sola canción, se repite; con varias, al terminar una suena la
 * siguiente y se puede cambiar con `nextTrack()` / `selectTrack(i)`.
 * El bloque pide `startMusic()` o `toggleMusic()` desde un gesto del usuario (los navegadores
 * bloquean el audio automático; aquí no se fuerza). `isPlaying` refleja el estado real del audio.
 * Al desmontarse el bloque, la música se detiene.
 */
export function AudioProvider({ src, title = null, tracks: trackList, volume: initialVolume = 0.6, children }) {
    const tracks = useMemo(
        () => (trackList?.length ? trackList : src ? [{ src, title }] : []),
        [trackList, src, title],
    )
    const [trackIndex, setTrackIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [volume, setVolumeState] = useState(initialVolume)
    const playAfterSwitch = useRef(false) // al cambiar de canción sonando, la nueva empieza sola
    const multi = tracks.length > 1
    const current = tracks[trackIndex] ?? null

    const advance = useCallback(() => {
        if (tracks.length < 2) return
        setTrackIndex((i) => (i + 1) % tracks.length)
    }, [tracks.length])

    const { play, resume, pause, stop, setVolume: setSoundVolume } = useSound(current?.src ?? null, {
        loop: !multi,
        volume: initialVolume,
        onStateChange: setIsPlaying,
        onEnded: () => {
            playAfterSwitch.current = true
            advance()
        },
    })

    // Tras cambiar de canción: si venía sonando, la nueva arranca (el audio anterior ya se paró).
    useEffect(() => {
        if (!playAfterSwitch.current) return
        playAfterSwitch.current = false
        play()
    }, [current?.src, play])

    useEffect(() => stop, [stop])

    const startMusic = useCallback(() => {
        if (!current) return // bloque sin música
        play()
    }, [current, play])

    const stopMusic = useCallback(() => {
        stop()
    }, [stop])

    const toggleMusic = useCallback(() => {
        if (!current) return
        if (isPlaying) pause()
        else resume()
    }, [current, isPlaying, pause, resume])

    const selectTrack = useCallback((index) => {
        if (index === trackIndex || index < 0 || index >= tracks.length) return
        playAfterSwitch.current = isPlaying
        setTrackIndex(index)
    }, [trackIndex, tracks.length, isPlaying])

    const nextTrack = useCallback(() => {
        if (tracks.length < 2) return
        selectTrack((trackIndex + 1) % tracks.length)
    }, [tracks.length, trackIndex, selectTrack])

    const setVolume = useCallback((value) => {
        const v = Math.min(1, Math.max(0, Number(value) || 0))
        setVolumeState(v)
        setSoundVolume(v)
    }, [setSoundVolume])

    const value = useMemo(
        () => ({
            hasMusic: Boolean(current),
            title: current?.title ?? null,
            tracks: tracks.map((t) => ({ title: t.title ?? null })),
            trackIndex,
            isPlaying,
            volume,
            startMusic,
            stopMusic,
            toggleMusic,
            nextTrack,
            selectTrack,
            setVolume,
        }),
        [current, tracks, trackIndex, isPlaying, volume, startMusic, stopMusic, toggleMusic, nextTrack, selectTrack, setVolume],
    )

    return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
}

export const useAudio = () => useContext(AudioContext)
