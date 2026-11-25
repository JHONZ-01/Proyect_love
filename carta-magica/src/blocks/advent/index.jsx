import './advent.css'
import './themes/vino-champagne/theme.css'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useGoogleFont } from '../../shared/useGoogleFont'
import { useToday } from './hooks/useToday'
import { useOpenedDays } from './hooks/useOpenedDays'
import { doorDate, getDoorState, getDoorStatus, getPhase } from './lib/calendar'
import {
    ADVENT_TITLE,
    ADVENT_CONFIG,
    ADVENT_FONT_URL,
    FINAL_NAME,
    headerText,
    doorLabel,
    lockedHint,
    longDate,
} from './content'
import { DAYS } from './days.data'
import AdventHeader from './components/AdventHeader'
import DoorGrid from './components/DoorGrid'
import LockedHint from './components/LockedHint'
import Snow from './components/Snow'

const HINT_MS = 2800
const DEFAULT_THEME = 'vino-champagne'

/**
 * Bloque 4: calendario de adviento.
 * Cada puerta se abre solo en su día (lib/calendar.js). Para probar cualquier fecha:
 * añade ?preview=2026-12-05 a la dirección (en vista previa no se guarda el progreso).
 * Fase 4: puertas, cabecera y avisos. El modal con el contenido del día llega en la Fase 5.
 */
export default function AdventBlock() {
    useGoogleFont(ADVENT_FONT_URL)
    const { today, isPreview } = useToday()
    const { opened, open } = useOpenedDays({ ...ADVENT_CONFIG, persist: !isPreview })
    const [hint, setHint] = useState(null) // { text, id }: el id hace que repetir el aviso reinicie el temporizador

    useEffect(() => {
        if (!hint) return undefined
        const timer = setTimeout(() => setHint(null), HINT_MS)
        return () => clearTimeout(timer)
    }, [hint])

    const phase = getPhase(today, ADVENT_CONFIG)

    const doors = useMemo(
        () => DAYS.map(({ day, type }) => {
            const status = getDoorStatus(getDoorState(day, today, ADVENT_CONFIG), opened.has(day))
            const isFinal = day === ADVENT_CONFIG.totalDays
            return {
                day,
                type,
                status,
                isFinal,
                label: doorLabel(day, status, ADVENT_CONFIG),
                lockedNote: isFinal ? `Se abre el ${longDate(doorDate(day, ADVENT_CONFIG))}` : null,
            }
        }),
        [today, opened],
    )

    const openedCount = doors.filter((d) => d.status === 'open').length
    const todayDoor = phase.phase === 'during' ? doors[phase.todayDay - 1] : null
    const todayPending = todayDoor !== null && todayDoor.status !== 'open'
    const { line, sub } = headerText(phase, { today, todayOpened: todayDoor?.status === 'open' }, ADVENT_CONFIG)

    const handleActivate = useCallback((day, status) => {
        if (status === 'locked') {
            setHint({ text: lockedHint(day, ADVENT_CONFIG), id: Date.now() })
        } else if (status !== 'open') {
            open(day)
        }
        // Puerta ya abierta: en la Fase 5 aquí se muestra su contenido.
    }, [open])

    const goToToday = useCallback(() => {
        const el = document.getElementById(`advent-door-${phase.todayDay}`)
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        el?.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' })
        el?.focus({ preventScroll: true })
    }, [phase.todayDay])

    return (
        <div className="advent-block" data-theme={DEFAULT_THEME}>
            <Snow />
            <main className="advent-stage">
                <AdventHeader
                    title={ADVENT_TITLE}
                    line={line}
                    sub={sub}
                    goLabel={todayPending ? `Ir a la puerta ${phase.todayDay}` : null}
                    onGo={goToToday}
                    countText={phase.phase === 'before' ? null : `Has abierto ${openedCount} de ${ADVENT_CONFIG.totalDays}`}
                    previewText={isPreview ? `Vista previa: ${longDate(today)} de ${today.slice(0, 4)}` : null}
                />
                <DoorGrid doors={doors} finalName={FINAL_NAME} onActivate={handleActivate} />
            </main>
            <LockedHint text={hint?.text ?? ''} />
        </div>
    )
}
