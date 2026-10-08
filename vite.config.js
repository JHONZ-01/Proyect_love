import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'
import { resolveBlock } from './carta-magica/src/core/blocks.config.js'

const root = fileURLToPath(new URL('./carta-magica', import.meta.url))

// Mismo orden y banderas que carta-magica/src/core/registry.js.
// Al añadir un bloque, agrégalo aquí también (genera su constante __BLOCK_<ID>_OFF__).
const BLOCKS = [
    { id: 'letter', flag: 'VITE_BLOCK_LETTER' },
    { id: 'gallery', flag: 'VITE_BLOCK_GALLERY' },
    { id: 'steamer', flag: 'VITE_BLOCK_STEAMER' },
]

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, root, 'VITE_')

    // Se usa el mismo resolvedor que en la app: solo el bloque elegido entra al build.
    const result = resolveBlock(env, BLOCKS)
    const chosen = result.status === 'ok' ? result.block.id : null

    const define = Object.fromEntries(
        BLOCKS.map(({ id }) => [`__BLOCK_${id.toUpperCase()}_OFF__`, JSON.stringify(id !== chosen)])
    )

    return {
        root: 'carta-magica',
        plugins: [
            react(),
            tailwindcss(),
        ],
        // Constantes literales: permiten que el build elimine los bloques que no se muestran (ver core/registry.js).
        define,
    }
})
