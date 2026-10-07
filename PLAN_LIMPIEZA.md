# Plan de limpieza

Estado: servidor detenido, `.npmrc` con `ignore-scripts=true` creado.

## Hecho
- [x] Eliminado andamiaje de Next.js (`app/`, `public/`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`)
- [x] Eliminado código muerto (`envelopeVariants.js`, `theme.js`, `fonts.css`, `EnvelopeBody/Lid.jsx`)
- [x] Restaurada la canción "Deportivo" (**NO eliminar**: se conserva para uso futuro, p. ej. pista de la galería)
- [x] README y AGENTS.md reescritos para Vite
- [x] `.npmrc` con `ignore-scripts=true`
- [x] Build verificado y app ejecutada: sin errores de consola ni de servidor

## Pendiente (por prioridad)

### 1. Bug: la carta pierde la primera letra (alta)
`carta-magica/src/hooks/useTypewriter.js`: el updater `prev + text.charAt(i)` lee `i` de forma diferida, después de que `i++` ya corrió, y en StrictMode se ejecuta dos veces. Resultado visto: "ntre días..." en vez de "Entre días...".
Arreglo: `setDisplayedText(text.slice(0, ++i))` o calcular desde `i` sin updater funcional.

### 2. Seguridad de dependencias (media)
`npm audit`: 0 vulnerabilidades en producción; 7 en desarrollo (vite <=6.4.2, postcss, nanoid, browserslist, @babel/core...). Afectan solo al entorno de desarrollo, no al sitio publicado.
- Actualizar solo `vite` dentro de la rama 6 y revisar con `npm audit`. No usar `npm audit fix --force`.
- Instalar siempre con `npm ci --ignore-scripts`. Si falla `esbuild`, ejecutar `npm rebuild esbuild` de forma explícita.

### 3. Carpeta `dist/` versionada (media)
`carta-magica/dist` está en git y cambia con cada build. Decidir:
- Si el hosting hace el build: añadir `carta-magica/dist` a `.gitignore` y `git rm -r --cached`.
- Si se publica desde el repo: dejarla, pero reconstruir y commitear solo al desplegar.

### 4. Exports sin uso (baja)
- `animations/buttonVariants.js`: `buttonAppear`, `buttonHover`, `buttonTap`, `acceptButtonPulse`
- `animations/letterVariants.js`: `letterFadeIn`, `letterContentSlide`
Borrar o usar.

### 5. Higiene del repo (baja)
- `.claude/launch.json` (creado para el preview): decidir si se versiona o se ignora.
- Nombres con tildes y comas en el mp3 restante: renombrar a algo simple (`persona-favorita.mp3`) y actualizar el import en `App.jsx:9`.
- `package.json`: nombre `carta-magica` y versión `0.1.0` están bien; confirmar que no falten `engines`.
- El mp3 pesa 5 MB y pesa más que todo el JS: valorar comprimirlo (por ejemplo 128 kbps) para acelerar la carga en móvil.

### 6. Arquitectura multiuso con interruptores (nueva)
Objetivo: cada "bloque" (1 = carta, 2 = galería, ...) se activa o desactiva con una variable de entorno.
- `.env` con `VITE_BLOCK_LETTER=true` y `VITE_BLOCK_GALLERY=false`, más `.env.example` versionado (`.env*` ya está en `.gitignore`).
- `src/config/blocks.js`: lee `import.meta.env` y define qué bloque está activo y en qué orden.
- `src/blocks/letter/` (mover envelope, letter e invitation) y `src/blocks/gallery/` (nuevo), cada uno con su propia música y constantes.
- `App.jsx` solo elige y renderiza el bloque activo. El fondo de partículas y el audio quedan compartidos.
- Las variables `VITE_*` se fijan al hacer el build y quedan visibles en el bundle. Sirven como interruptor, no como secreto. Cambiar el valor exige reiniciar `dev` o rehacer `build`.
- Limpieza previa: separar `constants/letterText.js` y los hooks por bloque para que no queden mezclados.

## Orden sugerido
1 → 2 → 3 → 4 → 5 → 6, verificando `npm run build` y abriendo la carta tras cada paso.
