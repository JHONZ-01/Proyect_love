import { useCallback, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { THEME_STORAGE_KEY, resolveThemeId, searchWithoutTheme, themeFromSearch } from '../lib/themes'

const readStored = () => {
    try {
        return localStorage.getItem(THEME_STORAGE_KEY)
    } catch {
        return null
    }
}

const save = (id) => {
    try {
        localStorage.setItem(THEME_STORAGE_KEY, id)
    } catch { /* sin almacenamiento: la elección dura mientras la página esté abierta */ }
}

/**
 * Estilo activo. Orden: ?estilo= de la dirección, la última elección guardada, el de por defecto.
 * Elegir un estilo lo guarda y quita ?estilo= de la dirección (si no, al recargar volvería el del enlace).
 * El cambio usa una transición suave del navegador cuando existe (View Transitions) y no hay
 * «reducir movimiento»; si no, es instantáneo.
 */
export function useTheme(themes, fallbackId) {
    const ids = themes.map((t) => t.id)
    const idsKey = ids.join('|')

    const [themeId, setThemeId] = useState(() => {
        const fromUrl = themeFromSearch(window.location.search, ids)
        return resolveThemeId({ fromUrl, stored: readStored(), ids, fallback: fallbackId })
    })

    // Un estilo que llega por enlace se recuerda como elección.
    useEffect(() => {
        if (themeFromSearch(window.location.search, idsKey.split('|'))) save(themeId)
    }, [themeId, idsKey])

    const chooseTheme = useCallback((id) => {
        if (!idsKey.split('|').includes(id)) return
        save(id)
        const { pathname, search, hash } = window.location
        const clean = searchWithoutTheme(search)
        if (clean !== search) window.history.replaceState(window.history.state, '', `${pathname}${clean}${hash}`)

        const apply = () => flushSync(() => setThemeId(id))
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (document.startViewTransition && !reduce) document.startViewTransition(apply)
        else apply()
    }, [idsKey])

    const theme = themes.find((t) => t.id === themeId) ?? themes[0]
    return { theme, chooseTheme }
}
