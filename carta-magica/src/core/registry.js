/**
 * Registro de bloques disponibles, en orden de prioridad.
 *
 * `load` devuelve [módulo del bloque, meta]. Si la bandera del bloque vale "false"
 * (constante __BLOCK_*_OFF__ definida en vite.config.js), `load` es null y Vite deja
 * fuera del build el código, la música y los assets de ese bloque.
 *
 * Para añadir un bloque: crear blocks/<id>/ con index.jsx (export default del componente)
 * y block.meta.js, registrarlo aquí con el mismo patrón y definir su constante en vite.config.js.
 */
export const BLOCK_REGISTRY = [
    {
        id: 'letter',
        flag: 'VITE_BLOCK_LETTER',
        load: __BLOCK_LETTER_OFF__
            ? null
            : () => Promise.all([
                import('../blocks/letter'),
                import('../blocks/letter/block.meta'),
            ]),
    },
    {
        id: 'gallery',
        flag: 'VITE_BLOCK_GALLERY',
        load: __BLOCK_GALLERY_OFF__
            ? null
            : () => Promise.all([
                import('../blocks/gallery'),
                import('../blocks/gallery/block.meta'),
            ]),
    },
    {
        id: 'steamer',
        flag: 'VITE_BLOCK_STEAMER',
        load: __BLOCK_STEAMER_OFF__
            ? null
            : () => Promise.all([
                import('../blocks/steamer'),
                import('../blocks/steamer/block.meta'),
            ]),
    },
    {
        id: 'advent',
        flag: 'VITE_BLOCK_ADVENT',
        load: __BLOCK_ADVENT_OFF__
            ? null
            : () => Promise.all([
                import('../blocks/advent'),
                import('../blocks/advent/block.meta'),
            ]),
    },
]
