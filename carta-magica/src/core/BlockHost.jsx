import { lazy, Suspense } from 'react'
import { resolveBlock } from './blocks.config'
import { BLOCK_REGISTRY } from './registry'
import { AudioProvider } from './AudioProvider'
import ConfigError from './ConfigError'

// Las variables VITE_* se fijan al compilar, así que se resuelve una sola vez.
const result = resolveBlock(import.meta.env, BLOCK_REGISTRY)

result.warnings.forEach((warning) => console.warn(`[bloques] ${warning}`))
if (result.status === 'error') console.error(`[bloques] ${result.message}`)

// Carga el bloque y su meta, y los entrega envueltos con su música.
const ActiveBlock = result.status === 'ok'
    ? lazy(async () => {
        const [{ default: Block }, { default: meta }] = await result.block.load()
        return {
            default: () => (
                <AudioProvider src={meta.music} volume={meta.musicVolume}>
                    <Block />
                </AudioProvider>
            ),
        }
    })
    : null

/** Monta el bloque activo con su música, o la pantalla de error de configuración. */
export default function BlockHost() {
    if (result.status === 'error') return <ConfigError message={result.message} />

    return (
        <Suspense fallback={null}>
            <ActiveBlock />
        </Suspense>
    )
}
