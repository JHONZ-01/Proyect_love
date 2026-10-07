// Contenido de la galería. Las fotos se toman solas de assets/photos/ (ordenadas por nombre).
export const GALLERY_TITLE = 'Calendario de recuerdos'
export const GALLERY_SUBTITLE = 'Abre cada puerta y descubre un momento...'

// Tamaños de celda que se repiten en ciclo: '' (normal) | 'tall' | 'wide' | 'big' | 'xtall'
const SPAN_PATTERN = ['tall', '', 'big', '', '', 'xtall', '', '', 'wide', '', 'tall', '', '', 'big', '']

// Textos opcionales por foto, con la clave igual al nombre del archivo sin extensión.
// Ejemplo: '01': { title: 'Nuestro primer día', caption: 'Qué buen día fue...', span: 'big' }
const PHOTO_DETAILS = {}

const DEMO_COUNT = 12 // marcadores de posición mientras no haya fotos

const modules = import.meta.glob('./assets/photos/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' })

const baseName = (path) => path.split('/').pop().replace(/\.[^.]+$/, '')

const fromFiles = Object.entries(modules)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, src]) => ({ key: baseName(path), src }))

const source = fromFiles.length > 0
    ? fromFiles
    : Array.from({ length: DEMO_COUNT }, (_, i) => ({ key: `demo-${i + 1}`, src: null }))

export const PHOTOS = source.map(({ key, src }, i) => {
    const details = PHOTO_DETAILS[key] ?? {}
    return {
        id: key,
        day: i + 1,
        src,
        title: details.title ?? `Recuerdo ${i + 1}`,
        caption: details.caption ?? 'Aquí irá un mensaje especial.',
        span: details.span ?? SPAN_PATTERN[i % SPAN_PATTERN.length],
    }
})
