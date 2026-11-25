import ParticleBackground from './shared/ParticleBackground'
import BlockHost from './core/BlockHost'

/** Shell: fondo compartido + bloque activo (ver core/registry.js y .env). */
export default function App() {
    return (
        <div className="relative min-h-screen w-full flex flex-col overflow-x-hidden overflow-y-auto bg-navy">
            <ParticleBackground />

            {/* flex-1 + py permiten hacer scroll si el contenido crece, sin cortar la parte superior */}
            <div className="flex-1 w-full flex flex-col items-center justify-center py-12 z-10">
                <BlockHost />
            </div>
        </div>
    )
}
