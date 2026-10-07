/** Marcador de posición mientras una foto no existe (colores distintos por día). */
export default function Placeholder({ day, large = false }) {
    const hue = (day * 47) % 360
    return (
        <div
            className="w-full h-full flex items-center justify-center text-white/80"
            style={{ background: `linear-gradient(135deg, hsl(${hue} 55% 38%), hsl(${(hue + 40) % 360} 60% 24%))` }}
        >
            <span className={large ? 'text-7xl' : 'text-3xl'}>📷</span>
        </div>
    )
}
