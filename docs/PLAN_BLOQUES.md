# Plan por fases: arquitectura de bloques con interruptor

Objetivo: que el proyecto sea multiuso. Cada "bloque" (1 = carta, 2 = galería, ...) es una experiencia independiente y un interruptor decide cuál se muestra. Agregar un bloque nuevo no debe obligar a tocar los existentes.

## Análisis del estado actual

| Hallazgo | Impacto en el diseño |
|---|---|
| `App.jsx` mezcla el shell (fondo, audio) con la lógica de la carta (etapas, `startOpening`). | Hay que separar "shell" de "bloque". |
| El mp3 se importa en `App.jsx`, así que se empaqueta siempre. | Cada bloque debe declarar su propia música y cargarse solo si está activo. |
| `hooks/` y `constants/` son globales, pero solo la carta los usa (excepto `useSound`). | Mover a `blocks/letter`, dejar `useSound` como compartido. |
| `index.css` (328 líneas) mezcla Tailwind, estilos del sobre 3D y clases heredadas (`.valentines`, `.envelope`, `.front`, `.hearts`). | Revisar cuáles están en uso y mover los de la carta a su bloque. |
| `ParticleBackground` es genérico. | Va al shell compartido. |
| No hay router ni estado global. | No hace falta agregarlos: un selector por configuración basta y mantiene el sitio estático. |
| Las variables `VITE_*` se fijan al compilar. | El interruptor es de build. Un bloque apagado puede quedar fuera del bundle. |

## Estructura objetivo

```
carta-magica/
├── .env.example                   # versionado; .env real queda ignorado
└── src/
    ├── main.jsx
    ├── App.jsx                    # solo resuelve y monta el bloque activo
    ├── core/
    │   ├── blocks.config.js       # lee env, valida, devuelve bloques activos
    │   ├── registry.js            # id -> { load, music, meta } de cada bloque
    │   ├── AudioProvider.jsx      # música controlada por el shell
    │   └── BlockBoundary.jsx      # Suspense + pantalla de error / "sin bloque"
    ├── shared/
    │   ├── ParticleBackground.jsx
    │   ├── useSound.js
    │   └── styles/base.css        # Tailwind + variables comunes
    └── blocks/
        ├── letter/
        │   ├── index.jsx          # componente raíz del bloque
        │   ├── block.meta.js      # nombre, música, duración estimada
        │   ├── content.js         # textos (antes letterText.js)
        │   ├── components/ hooks/ animations/
        │   └── letter.css
        └── gallery/
            ├── index.jsx
            ├── block.meta.js
            ├── content.js         # lista de fotos y títulos
            ├── components/
            └── assets/
```

## Contrato de un bloque

Todo bloque exporta por defecto un componente con estas props y un `meta`:

```js
// blocks/<id>/index.jsx
export default function Block({ onComplete }) { /* ... */ }

// blocks/<id>/block.meta.js
export default { id: 'letter', title: '...', music: '...mp3', musicVolume: 0.6 }
```

- `onComplete()` es opcional: lo llama el bloque cuando termina su experiencia (solo importa en modo secuencia).
- El bloque no conoce a los demás ni lee `import.meta.env`. Eso es del `core`.

## Configuración del interruptor

```env
# .env.example
VITE_BLOCK_LETTER=true
VITE_BLOCK_GALLERY=false
```

Reglas del resolvedor (`blocks.config.js`):
1. Se leen las banderas y se filtran los bloques en `true`, respetando el orden del registro.
2. Modo `first` (el único activo por ahora): se muestra el primero activo. Con `LETTER=false` aparece la galería, que es tu caso de uso.
3. Modo `sequence`: se muestran en orden y cada `onComplete` avanza al siguiente.
4. Si ninguno está activo, o hay un valor inválido, se muestra una pantalla de error clara y se avisa en consola. No se queda en blanco.
5. El resolvedor es una función pura, así que se puede probar sin navegador.

## Fases

Una rama y un PR por fase. Después de cada una: `npm run build` sin errores y la carta se ve y se comporta igual que antes.

### Fase 0: línea base (pequeña)
- Corregir el bug de `useTypewriter` (se pierde la primera letra), para que el "antes" sea correcto.
- `dist/` se mantiene versionada: reconstruirla en cada cambio.
- Anotar el comportamiento esperado de la carta como lista de verificación manual (sobre, apertura, texto, botones, música).
- **Listo cuando:** el bug está corregido y la lista de verificación existe en `docs/`.

### Fase 1: reorganizar sin cambiar comportamiento
- Crear `core/`, `shared/` y `blocks/letter/`; mover archivos con `git mv` para conservar historial.
- Mover `ParticleBackground` y `useSound` a `shared/`; el resto de componentes, hooks, animaciones y textos a `blocks/letter/`.
- Auditar `index.css`: borrar clases sin uso y mover las del sobre y pergamino a `letter.css`.
- Quitar los exports sin uso (punto 4 del plan de limpieza).
- **Listo cuando:** el build pasa, no hay imports rotos y la carta es idéntica.

### Fase 2: contrato, registro y configuración
- Crear `registry.js`, `blocks.config.js` y `.env.example`.
- Escribir el resolvedor puro con las reglas de arriba.
- Agregar `block.meta.js` a la carta con su música.
- **Listo cuando:** el resolvedor devuelve `letter` con la configuración por defecto y falla de forma controlada con una configuración inválida.

### Fase 3: shell y audio
- `App.jsx` queda reducido a: fondo compartido + `BlockBoundary` + bloque activo.
- `AudioProvider` reproduce la pista declarada en `block.meta.js`. Se inicia con el primer gesto del usuario (los navegadores lo exigen) y se detiene al cambiar de bloque.
- Mover a la carta la llamada a "abrir" para que pida el audio al shell en lugar de crearlo.
- **Listo cuando:** la carta suena igual que hoy y `App.jsx` ya no importa nada propio de la carta.

### Fase 4: carga perezosa y exclusión del build
- Registrar cada bloque con `React.lazy(() => import(...))` condicionado a la bandera, de modo que Vite elimine el bloque apagado (y su música y fotos) del bundle.
- Verificar con `npm run build` en ambas configuraciones y comparar tamaños en `dist/assets`.
- **Listo cuando:** con `LETTER=false` el mp3 de la carta no aparece en `dist`, y con `LETTER=true` no aparece lo de la galería.

### Fase 5: bloque galería (primera versión)
- Crear `blocks/gallery` con un diseño simple y datos de ejemplo en `content.js`; usar "Deportivo" como música.
- Las imágenes van en `blocks/gallery/assets/`, optimizadas (WebP, máximo ~1600 px de ancho) y con carga diferida.
- Diseño final (cuadrícula, carrusel o polaroids) según lo que decidas.
- **Listo cuando:** con `LETTER=false, GALLERY=true` la app arranca directo en la galería, sin errores.

### Fase 6: modo secuencia (descartada por ahora)
- Implementar `VITE_BLOCKS_MODE=sequence` con transición entre bloques y `onComplete`.
- **Listo cuando:** la carta termina (al responder) y pasa a la galería.

### Fase 7: calidad y cierre
- Pruebas del resolvedor (Vitest, como dependencia de desarrollo; se instala con `--ignore-scripts`).
- Actualizar `docs/ARQUITECTURA.md`, `docs/FLUJO.md` y el README con la estructura real.
- Añadir una guía "cómo crear un bloque nuevo" (pasos + plantilla).
- Definir el hosting y un flujo de despliegue; actualizar Vite a una versión sin vulnerabilidades conocidas.
- **Listo cuando:** un bloque nuevo se puede crear siguiendo solo la guía.

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Romper la carta al mover archivos | Fase 1 sin cambios funcionales y lista de verificación manual |
| CSS global que se filtra entre bloques | Clases con prefijo por bloque y un CSS por bloque |
| El audio no suena por política del navegador | Iniciar siempre desde un gesto del usuario |
| Peso de assets (mp3 de 5 MB, fotos) | Carga perezosa, compresión y exclusión del build |
| Esperar que el interruptor cambie sin recompilar | Documentarlo; si hace falta cambio en vivo, usar un `config.json` en `public/` como alternativa |
| Dependencia de desarrollo con vulnerabilidades | `npm ci --ignore-scripts` y actualización de Vite en la fase 7 |

## Decisiones tomadas

1. **Un bloque a la vez** (modo `first`). El modo `sequence` queda descartado por ahora; la fase 6 queda como futura y no se hará salvo que se pida.
2. **Interruptor al compilar** (`VITE_*`). El bloque apagado queda fuera del bundle. Cambiar de bloque exige reiniciar `dev` o rehacer `build`.
3. **Galería:** el diseño y el código llegarán después de parte del dueño del proyecto. La fase 5 espera ese material.
4. **`dist/` se mantiene versionada.** Reconstruir (`npm run build`) y commitear `dist` en cada cambio que afecte al sitio.

## Avance

- [x] Fase 0: bug de `useTypewriter` corregido y verificado en el navegador; lista de verificación en [VERIFICACION_CARTA.md](VERIFICACION_CARTA.md); `dist` reconstruida.
- [x] Fase 1: carpetas `core/`, `shared/`, `blocks/letter/`; CSS dividido (`base.css` + `letter.css`); CSS y exports sin uso eliminados; música movida a cada bloque (`deportivo.mp3` en `blocks/gallery/assets/sounds`). Build OK. Pendiente: confirmar a mano los botones Sí/No (ver VERIFICACION_CARTA.md) y actualizar docs/ARQUITECTURA.md en la fase 7.
- [x] Fase 2: `core/blocks.config.js` (resolvedor puro), `core/registry.js`, `blocks/letter/block.meta.js`, `carta-magica/.env.example` (y `!.env.example` en `.gitignore`). Resolvedor probado con 8 casos en Node (sin banderas, true, false, varios activos, ninguno, valor inválido, mayúsculas, vacío). Aún no está conectado a `App.jsx` (fase 3).
- [x] Fase 3: `App.jsx` reducido a fondo + `BlockHost`; `core/BlockHost.jsx`, `AudioProvider.jsx`, `ConfigError.jsx`; la carta es ahora `blocks/letter/index.jsx` (carga perezosa, con su propio `letter.css`). Build OK; **verificación en navegador a cargo del usuario**.
- [x] Fase 4: exclusión del bloque apagado en el build. La bandera se calcula en `vite.config.js` (`loadEnv` + `parseFlag`) y se inyecta como constante literal `__BLOCK_LETTER_OFF__`; `core/registry.js` pone `load: null` si está apagado. Un primer intento con `parseFlag()` directo en el registro NO excluía nada (Rollup no pliega llamadas a funciones). Verificado con 4 builds: `true`, `false`, `FALSE` y sin variable. Con `false` desaparecen mp3, textura y JS de la carta (de ~5,6 MB a ~0,3 MB). `dist` reconstruida con la configuración por defecto.
- [x] Fase 5 (primera versión): bloque `gallery` como calendario de adviento digital. Cuadrícula bento (`auto-fill` + `grid-auto-flow: dense`, celdas `tall/wide/big/xtall`, tomada de la base del usuario sin las funciones CSS experimentales), puertas con animación que se abren al hacer clic, modal (Escape, flechas, fondo para cerrar), música "Deportivo" iniciada con el primer clic y botón para pausar. El estado "abierto" se guarda en `localStorage`. Mientras no haya fotos se muestran 12 marcadores de posición.
  - **Cómo agregar fotos:** copiarlas a `carta-magica/src/blocks/gallery/assets/photos/` (`.jpg/.jpeg/.png/.webp`, se ordenan por nombre: `01.jpg`, `02.jpg`...). Textos y tamaño por foto en `PHOTO_DETAILS` de `blocks/gallery/content.js`, con el nombre sin extensión como clave.
  - **Cambio en el build:** `vite.config.js` ahora usa el mismo resolvedor que la app, así que solo el bloque que se muestra entra al build (con las variables sin definir, solo la carta). Al añadir un bloque hay que registrarlo en `core/registry.js` y en la lista `BLOCKS` de `vite.config.js`.
  - Verificado con builds: `LETTER=false,GALLERY=true` solo trae `deportivo.mp3`; `LETTER=true` o sin variables solo `persona-favorita.mp3` y la textura; ambos en `false` o un valor inválido no traen ningún asset. **Pendiente: verificación visual por parte del usuario.**
- [x] Fase 7 (parcial): pruebas del resolvedor con `node --test` (10 casos; se usó el ejecutor integrado de Node en lugar de Vitest para no sumar dependencias); docs actualizados (`ARQUITECTURA`, `FLUJO`, README); guía [NUEVO_BLOQUE.md](NUEVO_BLOQUE.md); lista [VERIFICACION_GALERIA.md](VERIFICACION_GALERIA.md).
- Fase 6 (modo secuencia): descartada.
- [x] Fase 7 (cierre): `npm audit fix --ignore-scripts` aplicado (Vite 6.4.4 y 25 paquetes menores; 0 vulnerabilidades; 10 tests y build en verde). Guía de despliegue en [DESPLIEGUE.md](DESPLIEGUE.md), que deja listo lo que necesita cualquier proveedor.
- Pendiente fuera del plan: elegir el hosting (la guía lo deja neutro), subir las fotos reales de la galería y el bloque 3.

## Estado del plan: completo
Fases 0 a 5 y 7 hechas; fase 6 descartada por decisión del usuario.

## Bloque 3: steamer (cesto de vapor)
- [x] Añadido como `blocks/steamer` a partir del HTML/CSS aportado por el usuario. El CSS se convierte con un script (no se reescribió a mano) y queda aislado bajo `.steamer-block`, con `@keyframes` prefijados `st-`; la fuente Sniglet se carga con el nuevo `shared/useGoogleFont.js`; el marcado se divide en `index.jsx` + `components/Dumpling.jsx`, y los textos están en `content.js` (en inglés, como en el original).
- [x] Sin música: `AudioProvider` ahora respeta `music: null`.
- [x] Registrado en `core/registry.js`, en `BLOCKS` de `vite.config.js` y en `.env.example` (`VITE_BLOCK_STEAMER`).
- [x] Verificado con builds: solo el bloque elegido entra al build (con `STEAMER=true` no hay mp3 ni textura); el CSS anidado se convierte bien y conserva los selectores `:checked + ...`. **Pendiente: revisión visual por el usuario** ([VERIFICACION_STEAMER.md](VERIFICACION_STEAMER.md)).
