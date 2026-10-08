import { useEffect } from 'react'

/** Carga una hoja de estilos de Google Fonts mientras el componente está montado. */
export function useGoogleFont(href) {
    useEffect(() => {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = href
        document.head.appendChild(link)
        return () => link.remove()
    }, [href])
}
