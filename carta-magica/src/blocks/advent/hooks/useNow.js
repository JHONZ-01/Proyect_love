import { useEffect, useState } from 'react'

/**
 * La hora actual, actualizada justo al cambiar cada segundo (no un segundo «cualquiera», así los
 * números no se quedan desfasados). El temporizador se limpia al desmontar.
 * Úsalo solo en componentes pequeños (reloj, cuenta atrás): cada uno se repinta una vez por segundo.
 * (El proyecto no usa SSR, así que el primer pintado y los siguientes salen del mismo reloj local.)
 */
export function useNow() {
    const [now, setNow] = useState(() => new Date())

    useEffect(() => {
        let timer
        const schedule = () => {
            timer = setTimeout(() => {
                setNow(new Date())
                schedule()
            }, 1000 - (Date.now() % 1000) + 5)
        }
        schedule()
        return () => clearTimeout(timer)
    }, [])

    return now
}
