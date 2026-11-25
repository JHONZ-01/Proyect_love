# Plan Bloque 2 — Música estilo Spotify (galería)

> Solo plan, sin código. Cada fase termina con un criterio de «listo» para poder cerrarla antes de pasar a la siguiente.

## 1. Punto de partida (lo que hay hoy)

| Pieza | Estado actual | Límite para lo que quieres |
|---|---|---|
| `core/AudioProvider.jsx` | Una sola canción (`src`), en bucle, con `startMusic / stopMusic / toggleMusic` | No conoce «lista», «siguiente», «anterior», «progreso» ni «volumen» |
| `shared/useSound.js` | Envuelve un `new Audio(src)` | Solo play / pause / stop |
| `gallery/block.meta.js` | `music: deportivo.mp3`, `musicVolume: 0.5` | Una sola pista |
| `gallery/components/MusicToggle.jsx` | Botón flotante «🔊 Música» | Es el único control de música; se sustituye |
| `gallery/content.js` | Las fotos salen solas de `assets/photos/` + textos opcionales en un mapa | Es el patrón que **copiaremos** para las canciones |
| Peso | Cada mp3 pesa ~5 MB | 10 canciones = 50 MB: hay que comprimir |

Se mantiene el contrato de bloques (`docs/ARQUITECTURA.md`): el bloque no lee `.env` ni conoce a otros bloques. **La carta (bloque 1) y el cesto (bloque 3) no deben notar ningún cambio.**

## 2. Qué es «estructura Spotify» (y qué NO copiamos)

Lo que sí se toma, porque es lo que hace que se sienta «una playlist»:

1. **Vista de playlist**: portada grande, título, «Hecha para ti», nº de canciones y duración total, botón verde grande de play (aquí dorado) y la lista numerada (nº · portada pequeña · título + artista · duración). La canción que suena se resalta con un ecualizador animado en lugar del número.
2. **Mini-reproductor fijo** abajo: portada, título/artista, play/pausa, siguiente, barra fina de progreso. Al tocarlo se abre…
3. **Pantalla «Reproduciendo»** (a pantalla completa en móvil): portada grande, título, barra de progreso con tiempos, controles (aleatorio · anterior · play/pausa · siguiente · repetir), volumen (solo en escritorio) y una zona para la **dedicatoria** de la canción (el «por qué esta canción»).
4. **Cola / siguiente**: orden de reproducción visible (opcional, fase final).

Lo que NO se copia: el logo de Spotify, su verde corporativo ni su tipografía (marca registrada, y además rompería el estilo del sitio). Se usa la paleta propia (azul marino `#004280`, dorado `#C8A96E`, crema `#E8D5B7`, pergamino) y la fuente **Nunito** que ya carga `index.html` para la interfaz del reproductor; Playfair/Great Vibes quedan para títulos y dedicatorias.

### Boceto (móvil primero: lo normal es que lo abra desde WhatsApp)

```
┌─ Galería (home) ───────┐   ┌─ Playlist ─────────────┐   ┌─ Reproduciendo ───────┐
│ Calendario de recuerdos│   │   ┌────────┐           │   │  ⌄        Para ti  ⋯  │
│ [puertas de fotos…]    │   │   │ portada│           │   │     ┌──────────┐      │
│ [puertas de fotos…]    │   │   └────────┘           │   │     │ portada  │      │
│                        │   │ Nuestra playlist       │   │     └──────────┘      │
│                        │   │ Hecha para ti · 12 ♪   │   │ Título           ♡    │
│                        │   │ ▶ (play grande)  🔀    │   │ Artista               │
│                        │   │ 1 ▪ Título      3:42   │   │ ━━━●━━━━━━  1:12 3:42 │
│                        │   │ ♪ ▪ Suena ahora 4:01   │   │ 🔀  ⏮  ⏯  ⏭  🔁      │
│                        │   │ 3 ▪ Título      2:58   │   │ “Dedicatoria…”        │
│ ┌───────────────────┐  │   │ ┌───────────────────┐  │   │                       │
│ │▪ Título   ⏯  ⏭    │  │   │ │▪ Título   ⏯  ⏭    │  │   └───────────────────────┘
│ └───────────────────┘  │   │ └───────────────────┘  │
└────────────────────────┘   └────────────────────────┘
        mini-reproductor fijo abajo (siempre visible tras el primer play)
```

En escritorio: la playlist ocupa el lateral/centro y el reproductor completo queda como **barra inferior de ancho total** (como Spotify web), con volumen a la derecha.

## 3. Decisiones que necesito de ti (cambian el plan)

1. **¿Cómo conviven la galería de fotos y la música?** Recomiendo la **opción A**: la galería sigue siendo la pantalla principal y se le añade una pestaña/botón «♪ Playlist» + el mini-reproductor fijo. Opción B: el bloque se vuelve una app de música y las fotos pasan a ser la portada de cada canción. A es menos riesgosa y conserva lo ya hecho.
2. **¿Cuántas canciones y quién las elige?** Ya tienes 2 mp3 (`deportivo`, `persona-favorita`). El plan funciona con 5-15.
3. **¿Se enlaza una canción con una foto/puerta?** (ej.: al abrir la puerta 3 suena la canción 3, o en el modal de la foto aparece «♪ canción de este recuerdo»). Es opcional y se decide en la Fase 3.
4. **Derechos de autor**: los mp3 de artistas comerciales publicados en una URL pública de Vercel son una redistribución técnica. Para un regalo privado es decisión tuya y el riesgo es bajo, pero tenlo presente. Alternativa sin archivos: incrustar una playlist real de Spotify con su `iframe`; allí no controlas el diseño, y quien no tenga cuenta solo oye 30 s. Por eso el plan sigue con **archivos propios**.

## 4. Material que necesito de ti (todo se sube como archivo, no hay que programar nada)

Todo va en `carta-magica/src/blocks/gallery/assets/music/`. Basta con **copiar los archivos a esa carpeta** (o arrastrarlos al chat y yo los coloco).

| # | Material | Formato y medida | Dónde conseguirlo | Obligatorio |
|---|---|---|---|---|
| 1 | **Canciones** | `.mp3` (o `.m4a`), 128-192 kbps, nombrar `01-titulo.mp3`, `02-…` (el número fija el orden) | Tus archivos propios / compras. Si pesan ~5 MB las comprimimos en la Fase 6 | Sí |
| 2 | **Portadas de canción** | `.webp`, `.png` o `.jpg`, **cuadradas 640×640**, mismo nombre que la canción: `01-titulo.webp` | Carátula del álbum (Apple Music / Bandcamp / MusicBrainz *Cover Art Archive*), una captura recortada, o una **foto de ustedes** | No: sin portada genero una de relleno con degradado y la inicial |
| 3 | **Portada de la playlist** | `.webp/.png`, 640×640 (o un collage de fotos) | Collage hecho en Canva/Photoshop con 4 fotos, o una foto sola | Recomendado |
| 4 | **Textos de la playlist** | Texto: nombre (ej. «Nuestra playlist»), «Hecha para ti por ___», descripción corta | Lo escribes tú; yo propongo opciones | Sí |
| 5 | **Datos por canción** | Texto: título, artista, y (opcional) una **dedicatoria** de 1-2 frases | Tú; yo te dejo una tabla para rellenar | Título y artista sí |
| 6 | **Iconos del reproductor** | `.svg`: play, pausa, siguiente, anterior, aleatorio, repetir, repetir-uno, volumen, silencio, corazón, bajar/chevron, lista | **No hace falta que los busques**: los dibujo como SVG propios. Si prefieres un set concreto: *Lucide* (ISC), *Phosphor* o *Tabler* (MIT) son gratuitos para uso comercial | No |
| 7 | **Fotos reales de la galería** (pendiente de antes) | `.jpg/.webp`, lado largo ≥ 1200 px | Tus fotos | Pendiente ya conocido |
| 8 | **Imagen para compartir** (opcional) | `.png` 1200×630 para la vista previa de WhatsApp | Captura del reproductor o collage | No |

Nota sobre iconos: hacerlos propios evita dependencias y respeta el estilo dorado/azul. No uso logos ni isotipos de Spotify.

## 5. Fases

### Fase 0 — Cierre de decisiones y recopilación (sin tocar código) · tamaño S
- Resolver las 4 decisiones de la sección 3.
- Reunir el material 1-5 de la sección 4 (aunque sea una primera tanda de 3-4 canciones; el resto se añade después sin cambiar nada).
- **Listo cuando**: hay carpeta `assets/music/` con las primeras canciones y los textos acordados.

### Fase 1 — Diseño UX/UI · tamaño M (tu foco fuerte)
- Mockup de las 3 pantallas (Playlist, Mini-reproductor, Reproduciendo) en móvil y escritorio, con la paleta y tipografías del sitio.
- Definir: estados (reproduciendo / pausado / cargando / error de archivo), animación del ecualizador, cómo se ve cuando **aún no se ha dado play** (primer gesto del usuario), jerarquía de botones y tamaños táctiles (≥ 44 px).
- Decidir dónde vive la playlist dentro de la galería (pestaña, botón flotante o sección inferior).
- **Listo cuando**: apruebas el boceto (puedo prepararlo como mockup visual antes de implementar).

### Fase 2 — Motor de audio con lista de reproducción · tamaño M
Por qué primero el motor y después la interfaz: la interfaz solo *lee* el estado; si el motor es sólido, la interfaz cambia sin romper nada.
- Ampliar `AudioProvider` para entender una **lista de pistas** y exponer: pista actual, siguiente/anterior, ir a una pista concreta, aleatorio, modo repetir (apagado / lista / una), tiempo actual y duración, saltar a un punto (seek), volumen y silencio, estado (cargando / reproduciendo / pausado / error).
- **Compatibilidad**: una pista suelta (`music: …` en la carta) sigue funcionando igual; `music: null` (cesto) sigue sin música. Se mantiene `startMusic()` para el primer gesto.
- Lógica de orden (siguiente, anterior, aleatorio sin repetir hasta agotar) como **funciones puras** para poder probarlas con `node --test`, igual que el resolvedor de bloques.
- Integración con la **Media Session API**: título/portada/botones en la pantalla de bloqueo y auriculares del móvil.
- **Listo cuando**: con pruebas unitarias en verde y una prueba manual de play → siguiente → fin de lista → repetir.

### Fase 3 — Datos y contenido · tamaño S
- `gallery/content.js` (o `music.js`) toma las canciones **solas de la carpeta**, igual que las fotos, ordenadas por nombre; un mapa de textos opcionales (artista, dedicatoria, foto enlazada).
- Portada de relleno generada (degradado + inicial) cuando falte la imagen.
- `block.meta.js` pasa de `music` (una pista) a una lista de pistas, y `musicVolume` se mantiene.
- Duraciones: se leen de los metadatos de cada archivo (carga ligera, sin descargar el audio completo).
- **Listo cuando**: añadir una canción nueva = soltar el archivo en la carpeta (+ opcionalmente 1 línea de texto).

### Fase 4 — Interfaz (componentes) · tamaño L
- Piezas nuevas: vista de playlist, fila de canción, mini-reproductor, pantalla «Reproduciendo», barra de progreso, controles, control de volumen, icono de ecualizador animado y los iconos SVG.
- Sustituir `MusicToggle` (el botón flotante actual) por el mini-reproductor.
- Tipografía: Nunito para la interfaz del reproductor; Playfair/Great Vibes para el nombre de la playlist y la dedicatoria.
- **Listo cuando**: se puede recorrer el flujo completo con ratón y con el dedo, en 360 px de ancho y en escritorio.

### Fase 5 — Integración con la galería · tamaño M
- El primer clic en una puerta sigue arrancando la música (regla del navegador: hace falta un gesto). Decidir si arranca la playlist desde la 1.ª canción o aleatoria.
- Que el mini-reproductor **no tape** la cuadrícula (espacio inferior) ni el modal de fotos (orden de capas), y que abrir/cerrar fotos **no interrumpa** la música.
- (Opcional según decisión 3) enlace canción ↔ foto: «♪ Esta canción» en el modal, y puerta N → canción N.
- **Listo cuando**: el recorrido «abrir puertas → ver fotos → cambiar de canción» es fluido sin cortes.

### Fase 6 — Accesibilidad, rendimiento y pruebas · tamaño M
- Teclado: espacio = play/pausa, flechas para saltar, la barra de progreso como control accesible (etiquetas, valores anunciados).
- `prefers-reduced-motion`: sin ecualizador animado ni transiciones largas.
- **Peso**: recomprimir los mp3 a ~128 kbps (hoy ~5 MB cada uno; sin `ffmpeg` instalado habría que usar una herramienta externa o instalarlo con cuidado). Carga perezosa: solo se descarga la pista actual y, a lo sumo, la siguiente.
- iPhone/Safari: el volumen lo controla el botón físico, así que **el control de volumen se oculta en iOS**; el audio se corta si se bloquea la pantalla salvo que la Media Session esté bien configurada.
- Actualizar `docs/VERIFICACION_GALERIA.md` con la lista de comprobaciones de música y `docs/ARQUITECTURA.md` (nueva forma del audio).
- **Listo cuando**: `npm test` pasa, la lista de verificación manual está completa y el tamaño total de `dist` es razonable.

### Fase 7 — Despliegue en Vercel · tamaño S
- Poner `VITE_BLOCK_GALLERY=true` (y los demás en `false`) en el panel de Vercel; sin eso se vería la carta.
- Probar en un móvil real (Android e iPhone) abriendo la URL desde WhatsApp.
- **Listo cuando**: la galería con la playlist funciona en el móvil desde el enlace público.

## 6. Archivos que se tocarán (referencia)

- **Modificar**: `core/AudioProvider.jsx`, `shared/useSound.js`, `blocks/gallery/index.jsx`, `block.meta.js`, `content.js`, `gallery.css`, `docs/ARQUITECTURA.md`, `docs/VERIFICACION_GALERIA.md`.
- **Reemplazar/eliminar**: `blocks/gallery/components/MusicToggle.jsx`.
- **Nuevos**: componentes del reproductor y la playlist dentro de `blocks/gallery/components/`, iconos SVG, lógica pura de orden de pistas con su `.test.js`, carpeta `assets/music/`.
- **Sin cambios**: `blocks/letter/*`, `blocks/steamer/*`.

## 7. Riesgos

| Riesgo | Cómo se controla |
|---|---|
| Autoplay bloqueado por el navegador | La música solo arranca desde un gesto (clic en puerta o en play) |
| Archivos muy pesados → carga lenta en datos móviles | Recompresión + carga perezosa + `preload` ligero (Fase 6) |
| Romper la carta o el cesto al tocar `AudioProvider` | Compatibilidad hacia atrás + prueba manual de los 3 bloques |
| Reproductor tapa contenido en pantallas pequeñas | Se define en el diseño (Fase 1) y se prueba a 360 px |
| Derechos de autor de las canciones | Decisión 4: es tu criterio; alternativa con `iframe` de Spotify |

## 8. Orden recomendado

0 → 1 → 2 (en paralelo con 3) → 4 → 5 → 6 → 7. Se puede **publicar tras la Fase 5** con las canciones que haya y seguir mejorando.
