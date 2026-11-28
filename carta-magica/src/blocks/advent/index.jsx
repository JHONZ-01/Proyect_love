import './advent.css'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useGoogleFont } from '../../shared/useGoogleFont'
import { useAudio } from '../../core/AudioProvider'
import { useToday } from './hooks/useToday'
import { useOpenedDays } from './hooks/useOpenedDays'
import { useTheme } from './hooks/useTheme'
import { doorDate, getDoorState, getDoorStatus, getPhase } from './lib/calendar'
import { DOOR_SHAPES, FEATURED_DAYS, LAYOUTS, placementOf } from './lib/layout'
import {
    ADVENT_TITLE,
    ADVENT_CONFIG,
    DAY_NAMES,
    headerText,
    doorLabel,
    lockedHint,
    longDate,
    MUSIC_ON_FIRST_TOUCH,
} from './content'
import { DAY_LIST } from './days'
import { THEMES, DEFAULT_THEME_ID } from './themes'
import AdventHeader from './components/AdventHeader'
import DoorGrid from './components/DoorGrid'
import LockedHint from './components/LockedHint'
import DayModal from './components/DayModal'
import StyleButton from './components/StyleButton'
import StylePicker from './components/StylePicker'
import Bow from './components/Bow'
import Ambience from './components/Ambience'
import LiveClock from './components/LiveClock'
import Countdown from './components/Countdown'
import MusicPlayer from './components/MusicPlayer'
import Dedication from './components/Dedication'

const HINT_MS = 2800
const OPEN_DELAY_MS = 480 // deja ver cómo gira la puerta antes de mostrar el contenido

// Adornos que rellenan los huecos de cada composición (se muestran solo en su tamaño de pantalla).
const DECOR_CELLS = Object.entries(LAYOUTS).flatMap(([layout, l]) => l.decor.map((d) => ({ ...d, layout })))

/** Centro de un elemento respecto al centro de la pantalla: de ahí «sale» la tarjeta del día. */
const originOf = (el) => {
    if (!el) return null
    const r = el.getBoundingClientRect()
    return { x: r.left + r.width / 2 - window.innerWidth / 2, y: r.top + r.height / 2 - window.innerHeight / 2 }
}

/**
 * Bloque 4: calendario de adviento.
 * Cada puerta se abre solo en su día (lib/calendar.js). Para probar cualquier fecha:
 * añade ?preview=2026-12-05 a la dirección (en vista previa no se guarda el progreso).
 * Estilos intercambiables (themes/): ?estilo=kawaii-lazo abre con ese estilo; el botón «Estilo» lo cambia.
 * Composición asimétrica de puertas: lib/layout.js. Reloj y cuenta atrás: lib/clock.js.
 * Música: la del shell (core/AudioProvider), con la canción de assets/music/ (block.meta.js).
 */
export default function AdventBlock() {
    const { theme, chooseTheme } = useTheme(THEMES, DEFAULT_THEME_ID)
    useGoogleFont(theme.fontUrl)
    const { today, isPreview } = useToday()
    const [pickerOpen, setPickerOpen] = useState(false)
    const { opened, open } = useOpenedDays({ ...ADVENT_CONFIG, persist: !isPreview })
    const [hint, setHint] = useState(null) // { text, id }: el id hace que repetir el aviso reinicie el temporizador
    const [selected, setSelected] = useState(null) // { day, origin }
    const openTimer = useRef(null)
    const blockRef = useRef(null) // el contenedor que se desplaza (para la aparición de la dedicatoria)
    const { hasMusic, startMusic } = useAudio()
    const musicTouched = useRef(false)

    // La música empieza con el primer toque en la página (los navegadores no dejan que suene antes).
    // Si ese primer toque es en el propio reproductor, manda el reproductor.
    useEffect(() => {
        const root = blockRef.current
        if (!root || !hasMusic || !MUSIC_ON_FIRST_TOUCH) return undefined
        const onFirstTouch = (e) => {
            if (musicTouched.current) return
            if (e.type === 'keydown' && (e.key === 'Escape' || e.key === 'Tab' || e.key === 'Shift')) return
            musicTouched.current = true
            if (!e.target.closest?.('.advent-music')) startMusic()
        }
        root.addEventListener('click', onFirstTouch, true)
        root.addEventListener('keydown', onFirstTouch, true)
        return () => {
            root.removeEventListener('click', onFirstTouch, true)
            root.removeEventListener('keydown', onFirstTouch, true)
        }
    }, [hasMusic, startMusic])

    useEffect(() => () => clearTimeout(openTimer.current), [])

    useEffect(() => {
        if (!hint) return undefined
        const timer = setTimeout(() => setHint(null), HINT_MS)
        return () => clearTimeout(timer)
    }, [hint])

    const phase = getPhase(today, ADVENT_CONFIG)

    const doors = useMemo(
        () => DAY_LIST.map(({ day, type }) => {
            const status = getDoorStatus(getDoorState(day, today, ADVENT_CONFIG), opened.has(day))
            const shape = DOOR_SHAPES[day] ?? 'small'
            return {
                day,
                type,
                status,
                shape,
                featured: FEATURED_DAYS.includes(day),
                name: DAY_NAMES[day] ?? null,
                placement: { mobile: placementOf(day, 'mobile'), wide: placementOf(day, 'wide'), xl: placementOf(day, 'xl') },
                index: day - 1,
                label: doorLabel(day, status, ADVENT_CONFIG),
                lockedNote: shape === 'final' ? `Se abre el ${longDate(doorDate(day, ADVENT_CONFIG))}` : null,
            }
        }),
        [today, opened],
    )

    const openedCount = doors.filter((d) => d.status === 'open').length
    const todayDoor = phase.phase === 'during' ? doors[phase.todayDay - 1] : null
    const todayPending = todayDoor !== null && todayDoor.status !== 'open'
    const { line, sub } = headerText(phase, { today, todayOpened: todayDoor?.status === 'open' }, ADVENT_CONFIG)

    const handleActivate = useCallback((day, status, el) => {
        if (status === 'locked') {
            setHint({ text: lockedHint(day, ADVENT_CONFIG), id: Date.now() })
            return
        }
        clearTimeout(openTimer.current)
        if (status === 'open') {
            setSelected({ day, origin: originOf(el) }) // ya abierta: se vuelve a ver al momento
            return
        }
        open(day)
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        openTimer.current = setTimeout(() => setSelected({ day, origin: originOf(el) }), reduce ? 0 : OPEN_DELAY_MS)
    }, [open])

    const closeModal = useCallback(() => {
        const day = selected?.day
        setSelected(null)
        // Devuelve el foco a la puerta que abrió el modal.
        document.getElementById(`advent-door-${day}`)?.focus({ preventScroll: true })
    }, [selected])

    const selectedEntry = selected ? DAY_LIST[selected.day - 1] : null

    const closePicker = useCallback(() => {
        setPickerOpen(false)
        document.querySelector('.advent-stylebtn')?.focus({ preventScroll: true })
    }, [])

    const decor = theme.decor ?? []
    // Adorno sobre el título: la imagen propia del estilo (si la hay) o su lazo.
    const headerArt = theme.headerImage
        ? <img className="advent-head__art" src={theme.headerImage} alt="" />
        : decor.includes('bow') ? <Bow className="advent-head__bow" /> : null

    const goToToday = useCallback(() => {
        const el = document.getElementById(`advent-door-${phase.todayDay}`)
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        el?.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' })
        el?.focus({ preventScroll: true })
    }, [phase.todayDay])

    return (
        <div ref={blockRef} className="advent-block" data-adv-theme={theme.id} data-modal-open={selectedEntry || pickerOpen ? 'true' : undefined}>
            {decor.includes('dots') && <div className="advent-dots" aria-hidden="true" />}
            <Ambience twinkle={decor.includes('twinkle')} hearts={decor.includes('hearts')} />
            <main className="advent-stage">
                <AdventHeader
                    art={headerArt}
                    title={ADVENT_TITLE}
                    line={line}
                    sub={sub}
                    countdown={<Countdown today={today} config={ADVENT_CONFIG} />}
                    goLabel={todayPending ? `Ir a la puerta ${phase.todayDay}` : null}
                    onGo={goToToday}
                    countText={phase.phase === 'before' ? null : `Has abierto ${openedCount} de ${ADVENT_CONFIG.totalDays}`}
                    previewText={isPreview ? `Vista previa: ${longDate(today)} de ${today.slice(0, 4)}` : null}
                    start={<LiveClock />}
                    end={<MusicPlayer showMissing={isPreview} />}
                />
                <DoorGrid doors={doors} decor={DECOR_CELLS} onActivate={handleActivate} />
                <Dedication scrollRoot={blockRef} />
            </main>
            <StyleButton expanded={pickerOpen} onClick={() => setPickerOpen(true)} />
            <LockedHint text={hint?.text ?? ''} />
            <AnimatePresence>
                {selectedEntry && (
                    <DayModal key={selectedEntry.day} entry={selectedEntry} origin={selected.origin} total={ADVENT_CONFIG.totalDays} onClose={closeModal} />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {pickerOpen && (
                    <StylePicker themes={THEMES} currentId={theme.id} onChoose={chooseTheme} onClose={closePicker} />
                )}
            </AnimatePresence>
        </div>
    )
}
