import { useState, useCallback } from 'react'

const STORAGE_KEY = 'gallery:opened'

const read = () => {
    try {
        return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'))
    } catch {
        return new Set()
    }
}

/** Recuerda qué puertas ya se abrieron (localStorage, con respaldo en memoria). */
export function useOpenedDoors() {
    const [opened, setOpened] = useState(read)

    const open = useCallback((id) => {
        setOpened((prev) => {
            if (prev.has(id)) return prev
            const next = new Set(prev).add(id)
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
            } catch { /* sin almacenamiento: queda solo en memoria */ }
            return next
        })
    }, [])

    return { opened, open }
}
