# Cómo crear un bloque nuevo

Ejemplo: un bloque llamado `trivia`. Sustituye `trivia` / `TRIVIA` por tu id.

## 1. Crear la carpeta

```
carta-magica/src/blocks/trivia/
├── index.jsx          # export default del componente raíz
├── block.meta.js
├── content.js         # textos y datos
├── trivia.css         # estilos propios (prefija las clases: .trivia-...)
├── components/
└── assets/sounds/     # su música
```

## 2. `block.meta.js`

```js
import music from './assets/sounds/mi-cancion.mp3'

export default {
    id: 'trivia',
    title: 'Trivia',
    music,
    musicVolume: 0.5,
}
```

## 3. `index.jsx`

```jsx
import './trivia.css'
import { useAudio } from '../../core/AudioProvider'

export default function TriviaBlock() {
    const { startMusic } = useAudio()
    // Llama a startMusic() dentro de un clic del usuario (el navegador bloquea el audio automático).
    return <section className="w-full px-4">...</section>
}
```

El bloque no recibe props, no lee `import.meta.env` y no importa nada de otros bloques. Usa `shared/` para lo común.

## 4. Registrarlo en dos sitios

`carta-magica/src/core/registry.js`: añade una entrada al final (el orden es la prioridad):

```js
{
    id: 'trivia',
    flag: 'VITE_BLOCK_TRIVIA',
    load: __BLOCK_TRIVIA_OFF__
        ? null
        : () => Promise.all([
            import('../blocks/trivia'),
            import('../blocks/trivia/block.meta'),
        ]),
},
```

`vite.config.js`: añade el bloque a la lista `BLOCKS` (genera la constante `__BLOCK_TRIVIA_OFF__`):

```js
{ id: 'trivia', flag: 'VITE_BLOCK_TRIVIA' },
```

## 5. Variable de entorno

Añade `VITE_BLOCK_TRIVIA=false` a `carta-magica/.env.example`. Para usarlo, en tu `.env` pon las demás en `false` y esta en `true`, y reinicia `npm run dev`.

## 6. Verificar

1. `npm test` (el resolvedor no cambia, pero confirma que nada se rompió).
2. `npm run build` con solo tu bloque en `true`: en `dist/assets` debe estar su música y no la de los demás.
3. `npm run dev` y revisar el bloque en el navegador.
4. Documentar el bloque en [ARQUITECTURA.md](ARQUITECTURA.md).

## Errores frecuentes

| Síntoma | Causa |
|---|---|
| `__BLOCK_TRIVIA_OFF__ is not defined` | Falta añadir el bloque a `BLOCKS` en `vite.config.js` |
| Pantalla "Configuración de bloques inválida" | Valor distinto de `true`/`false`, o todos los bloques en `false` |
| El bloque no cambia al editar `.env` | Hay que reiniciar `npm run dev` |
| No suena la música | `startMusic()` se llamó fuera de un gesto del usuario |
| Estilos que se "filtran" a otros bloques | Clases sin prefijo en el CSS del bloque |

## Casos especiales (ejemplo: el bloque `steamer`)

- **Sin música:** pon `music: null` en `block.meta.js`. El shell no crea audio y `startMusic()` / `toggleMusic()` no hacen nada.
- **Fuente propia:** usa `useGoogleFont(url)` de `shared/useGoogleFont.js` dentro del bloque. La hoja se añade al montarse y se quita al desmontarse (no uses `@import` en el CSS del bloque: no es válido en medio del archivo empaquetado).
- **Pantalla completa con otro fondo:** envuelve el bloque en una clase raíz (`.steamer-block`) con `position: fixed; inset: 0; z-index: 20; overflow: auto` y su propio `background`. Así cubre el fondo azul y las partículas del shell sin tocarlos.
- **Importar CSS ajeno:** anida todo bajo la clase raíz del bloque, saca los `@keyframes` (no pueden anidarse) y ponles un prefijo (`st-`). Así los nombres genéricos (`.lid`, `.title`, `.face`...) no se filtran a otros bloques.
- **Interacción solo con CSS:** si el bloque usa selectores de hermanos (`:checked + .x`), conserva el orden del marcado.
