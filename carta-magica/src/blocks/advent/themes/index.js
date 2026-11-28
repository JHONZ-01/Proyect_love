// Registro de estilos: cada carpeta de themes/ con theme.js + theme.css es un estilo.
// Añadir un estilo = copiar una carpeta, cambiarle el id y los colores (themes.test.js comprueba
// que no falte ninguna variable).
import { sortThemes } from '../lib/themes'

const metas = import.meta.glob('./*/theme.js', { eager: true, import: 'default' })
// Importarlos basta para cargar el CSS de todos los estilos (son pocos KB). Se asigna a una constante
// para que la línea no quede pegada a la anterior (no empieza por un paréntesis tras transformarse).
export const THEME_STYLES = import.meta.glob('./*/theme.css', { eager: true })
const headers = import.meta.glob('./*/assets/header.{png,webp,svg,jpg,jpeg}', { eager: true, import: 'default' })

const folderOf = (path) => path.split('/')[1]

const headerByTheme = {}
for (const [path, url] of Object.entries(headers)) headerByTheme[folderOf(path)] = url

/** Estilos ordenados, cada uno con su imagen de cabecera propia (`headerImage`) o null. */
export const THEMES = sortThemes(
    Object.entries(metas).map(([path, meta]) => ({ ...meta, headerImage: headerByTheme[folderOf(path)] ?? null })),
)

export const DEFAULT_THEME_ID = 'vino-champagne'
