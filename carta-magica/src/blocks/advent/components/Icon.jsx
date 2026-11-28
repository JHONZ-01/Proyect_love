// Iconos propios del bloque (trazo, un solo color): sin librerías.
const PATHS = {
    heart: <path d="M12 21C5 16.5 2 12.6 2 8.9 2 6.2 4.1 4 6.8 4c1.9 0 3.7 1 5.2 3 1.5-2 3.3-3 5.2-3C19.9 4 22 6.2 22 8.9c0 3.7-3 7.6-10 12.1z" />,
    photo: (
        <>
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <circle cx="9" cy="10" r="1.6" />
            <path d="M3 17l5-5 4 4 3-3 6 6" />
        </>
    ),
    ticket: (
        <>
            <path d="M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z" />
            <path d="M14 7v10" strokeDasharray="2 2" />
        </>
    ),
    music: (
        <>
            <path d="M9 18V6l10-2v12" />
            <circle cx="7" cy="18" r="2.2" />
            <circle cx="17" cy="16" r="2.2" />
        </>
    ),
    spark: (
        <>
            <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
            <path d="M19 16v4M17 18h4" />
        </>
    ),
    gift: (
        <>
            <rect x="3" y="9" width="18" height="11" rx="1.5" />
            <path d="M12 9v11M3 13h18" />
            <path d="M12 9c-2-4-6-3-5 0 .5 1.5 3 1 5 0zM12 9c2-4 6-3 5 0-.5 1.5-3 1-5 0z" />
        </>
    ),
    palette: (
        <>
            <path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.8-.8 1.8-1.7 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-.9.8-1.7 1.7-1.7H16a5 5 0 0 0 5-5c0-4-4-7.2-9-7.2z" />
            <circle cx="7.5" cy="11" r="1.2" />
            <circle cx="10.5" cy="7" r="1.2" />
            <circle cx="15" cy="7.5" r="1.2" />
        </>
    ),
    star: <path d="M12 2.8l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3.1-5.4 3.1 1.2-6L3.3 9.1l6.1-.7z" />,
    snowflake: (
        <>
            <path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7" />
            <path d="M9.5 3.5L12 6l2.5-2.5M9.5 20.5L12 18l2.5 2.5M3.6 10.1l3.4-.9-.9-3.4M20.4 13.9l-3.4.9.9 3.4M6.1 17.8l.9-3.4-3.4-.9M17.9 6.2l-.9 3.4 3.4.9" />
        </>
    ),
    play: (
        <>
            <rect x="3" y="5" width="18" height="14" rx="3" />
            <path d="M10 9.2v5.6l4.6-2.8z" />
        </>
    ),
    lock: (
        <>
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </>
    ),
}

// Qué icono lleva la ventana encendida de cada tipo de contenido.
export const ICON_FOR_TYPE = {
    mensaje: 'heart',
    foto: 'photo',
    vale: 'ticket',
    cancion: 'music',
    reto: 'spark',
    video: 'play',
    final: 'gift',
}

export default function Icon({ name, className }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {PATHS[name]}
        </svg>
    )
}
