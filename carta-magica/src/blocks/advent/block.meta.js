// Música del calendario: los archivos de assets/music/ (mp3, m4a, ogg o webm, mejor < 5 MB cada uno),
// en orden de nombre (el número delante fija el orden). Quien lo recibe puede pasar de una a otra con
// el botón «Siguiente canción»; al terminar una, suena la siguiente. Sin archivos, el bloque no tiene
// música y el reproductor no se muestra.
// Título de cada canción: el de MUSIC_TITLES (por nombre de archivo sin extensión) o, si no está,
// el que sale del nombre del archivo.
import { buildTracks } from './lib/music'

const MUSIC_TITLES = {
    '01-lentito-x-last-christmas': 'Lentito x Last Christmas · Álvaro Díaz',
    '02-last-christmas': 'Last Christmas · Wham!',
}

const tracks = buildTracks(
    Object.entries(import.meta.glob('./assets/music/*.{mp3,m4a,ogg,webm}', { eager: true, import: 'default' })),
    MUSIC_TITLES,
)

export default {
    id: 'advent',
    title: 'Calendario de adviento',
    music: tracks[0]?.src ?? null, // la primera (compatibilidad con el shell)
    musicTitle: tracks[0]?.title ?? null,
    musicTracks: tracks,
    musicVolume: 0.5,
}
