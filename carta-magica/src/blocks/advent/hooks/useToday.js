import { useEffect, useState } from 'react'
import { msUntilNextDay, previewFromSearch, resolveToday } from '../lib/calendar'

const readPreview = () => previewFromSearch(window.location.search)
const compute = () => resolveToday({ now: new Date(), preview: readPreview() })

/**
 * «Hoy» como texto 'AAAA-MM-DD' del calendario local, o la fecha de ?preview=AAAA-MM-DD.
 * Si el dispositivo deja la página abierta, se actualiza solo a medianoche y al volver a la
 * pestaña (los temporizadores se frenan en segundo plano). Con vista previa el día es fijo.
 * Devuelve { today, isPreview }.
 */
export function useToday() {
    const [today, setToday] = useState(compute)
    const preview = readPreview()
    const isPreview = preview !== null

    useEffect(() => {
        if (isPreview) return undefined

        let timer
        const refresh = () => setToday(compute()) // mismo valor: React no vuelve a pintar
        const schedule = () => {
            clearTimeout(timer)
            timer = setTimeout(() => { refresh(); schedule() }, msUntilNextDay(new Date()))
        }
        const onVisible = () => {
            if (document.visibilityState === 'visible') { refresh(); schedule() }
        }

        schedule()
        document.addEventListener('visibilitychange', onVisible)
        return () => {
            clearTimeout(timer)
            document.removeEventListener('visibilitychange', onVisible)
        }
    }, [isPreview])

    return { today, isPreview }
}
