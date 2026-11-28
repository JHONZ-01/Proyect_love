// Une el contenido de days.data.js con las fotos y vídeos de assets/days/.
// Una foto se asocia por el número del día en el nombre: 2.webp, 02.webp o 02-playa.jpg -> día 2.
// Solo se importan las URL: el navegador descarga cada foto cuando se abre su día.
import { DAYS } from './days.data'

const files = import.meta.glob('./assets/days/*.{jpg,jpeg,png,webp,avif}', { eager: true, import: 'default' })
const videoFiles = import.meta.glob('./assets/days/*.{mp4,webm}', { eager: true, import: 'default' })

// Archivo -> número de día (2.webp, 02.webp o 02-playa.jpg -> 2). Los que no empiezan por número se ignoran.
const byDay = (modules) => {
    const map = {}
    for (const [path, url] of Object.entries(modules)) {
        const match = path.split('/').pop().match(/^(\d+)/)
        if (match) map[Number(match[1])] = url
    }
    return map
}
const photoByDay = byDay(files)
const videoByDay = byDay(videoFiles)

/** Los días con su foto (`image`) y su vídeo (`video`): URL o null si no hay archivo para ese día. */
export const DAY_LIST = DAYS.map((d) => ({ ...d, image: photoByDay[d.day] ?? null, video: videoByDay[d.day] ?? null }))
