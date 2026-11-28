import { useEffect } from 'react'

const FOCUSABLE = 'button:not([disabled]), a[href], [tabindex="0"]'

/**
 * Comportamiento accesible de un diálogo modal: al abrir, foco en `initialFocusRef`;
 * Escape lo cierra; Tab y Mayús+Tab no salen del diálogo.
 * (Devolver el foco a quien lo abrió es tarea de quien lo cierra.)
 */
export function useDialogA11y(dialogRef, initialFocusRef, onClose) {
    useEffect(() => {
        initialFocusRef.current?.focus()
    }, [initialFocusRef])

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault()
                onClose()
                return
            }
            if (e.key !== 'Tab' || !dialogRef.current) return
            const items = [...dialogRef.current.querySelectorAll(FOCUSABLE)]
            if (items.length === 0) return
            const first = items[0]
            const last = items[items.length - 1]
            if (!items.includes(document.activeElement)) {
                // El foco está en algo no tabulable del diálogo (p. ej. una respuesta revelada): no dejarlo salir.
                e.preventDefault()
                ;(e.shiftKey ? last : first).focus()
            } else if (e.shiftKey && document.activeElement === first) {
                e.preventDefault()
                last.focus()
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault()
                first.focus()
            }
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [dialogRef, onClose])
}
