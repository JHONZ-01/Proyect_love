/** Lazo propio (dos lazadas, nudo y dos colas), dibujado para este proyecto. Decorativo. */
export default function Bow({ className }) {
    return (
        <svg className={className} viewBox="0 0 64 40" aria-hidden="true">
            <g fill="currentColor" stroke="rgba(0, 0, 0, .18)" strokeWidth=".8">
                <path d="M32 20C24 3 3 0 3 13c0 13 21 17 29 7z" />
                <path d="M32 20C40 3 61 0 61 13c0 13-21 17-29 7z" />
                <path d="M30 25L21 38l10-3zM34 25l9 13-10-3z" />
                <ellipse cx="32" cy="20" rx="6.5" ry="7.5" />
            </g>
            <path d="M9 10c4-4 11-2 15 4M55 10c-4-4-11-2-15 4" fill="none" stroke="rgba(255, 255, 255, .55)" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
    )
}
