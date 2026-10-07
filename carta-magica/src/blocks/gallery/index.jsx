import './gallery.css'
import { useCallback, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useAudio } from '../../core/AudioProvider'
import { useOpenedDoors } from './hooks/useOpenedDoors'
import { GALLERY_TITLE, GALLERY_SUBTITLE, PHOTOS } from './content'
import GalleryTile from './components/GalleryTile'
import PhotoModal from './components/PhotoModal'
import MusicToggle from './components/MusicToggle'

const MODAL_DELAY_MS = 450 // deja ver cómo se abre la puerta antes del modal

/** Bloque 2: calendario de recuerdos (cuadrícula de fotos con modal y música). */
export default function GalleryBlock() {
    const { startMusic } = useAudio()
    const { opened, open } = useOpenedDoors()
    const [selectedIndex, setSelectedIndex] = useState(null)
    const musicStarted = useRef(false)

    const handleSelect = useCallback((photo) => {
        // La música arranca con el primer clic (los navegadores exigen un gesto del usuario).
        if (!musicStarted.current) {
            musicStarted.current = true
            startMusic()
        }
        const index = PHOTOS.findIndex((p) => p.id === photo.id)
        const wasOpen = opened.has(photo.id)
        open(photo.id)
        if (wasOpen) setSelectedIndex(index)
        else setTimeout(() => setSelectedIndex(index), MODAL_DELAY_MS)
    }, [opened, open, startMusic])

    const close = useCallback(() => setSelectedIndex(null), [])
    const goTo = useCallback((delta) => {
        setSelectedIndex((i) => {
            const next = (i + delta + PHOTOS.length) % PHOTOS.length
            open(PHOTOS[next].id)
            return next
        })
    }, [open])
    const prev = useCallback(() => goTo(-1), [goTo])
    const next = useCallback(() => goTo(1), [goTo])

    return (
        <section className="w-full px-4">
            <MusicToggle />

            <header className="text-center mb-8 font-['Playfair_Display']">
                <h1 className="font-['Great_Vibes'] text-5xl text-[#E8D5B7] mb-2">{GALLERY_TITLE}</h1>
                <p className="text-[#E8D5B7]/80 italic">{GALLERY_SUBTITLE}</p>
            </header>

            <div className="gallery-grid">
                {PHOTOS.map((photo) => (
                    <GalleryTile
                        key={photo.id}
                        photo={photo}
                        isOpen={opened.has(photo.id)}
                        onSelect={handleSelect}
                    />
                ))}
            </div>

            <AnimatePresence>
                {selectedIndex !== null && (
                    <PhotoModal
                        key="modal"
                        photo={PHOTOS[selectedIndex]}
                        total={PHOTOS.length}
                        onClose={close}
                        onPrev={prev}
                        onNext={next}
                    />
                )}
            </AnimatePresence>
        </section>
    )
}
