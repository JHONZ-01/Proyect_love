import { useCallback, useState } from 'react'
import { openedKey, parseOpened, serializeOpened } from '../lib/opened'

const read = (key, totalDays) => {
    try {
        return parseOpened(localStorage.getItem(key), totalDays)
    } catch {
        return new Set() // sin almacenamiento (modo privado, bloqueado…): empieza vacío
    }
}

/**
 * Puertas abiertas, recordadas en localStorage (con respaldo en memoria si no hay almacenamiento).
 * Con `persist: false` (vista previa) NO se lee ni se guarda nada: así probar con ?preview=
 * no ensucia el progreso real.
 */
export function useOpenedDays({ startDate, totalDays, persist }) {
    const key = openedKey(startDate)
    const [opened, setOpened] = useState(() => (persist ? read(key, totalDays) : new Set()))

    const open = useCallback((day) => {
        setOpened((prev) => {
            if (prev.has(day)) return prev
            const next = new Set(prev).add(day)
            if (persist) {
                try {
                    localStorage.setItem(key, serializeOpened(next))
                } catch { /* sin almacenamiento: queda solo en memoria */ }
            }
            return next
        })
    }, [key, persist])

    return { opened, open }
}
