# Plan Bloque 4 — Calendario de adviento

> Solo plan, sin código. Cada fase termina con un criterio de «listo». Fecha de redacción: 24-nov-2026. **La puerta 1 se abre el 1-dic: quedan 7 días**, así que el plan separa un *mínimo publicable* (Fases 0-5 + 7) de lo que puede esperar.

## 1. Punto de partida (lo que ya hay y lo que falta)

| Pieza | Hoy | Para un adviento real |
|---|---|---|
| `blocks/gallery` | Cuadrícula de puertas doradas; **cualquier puerta se abre en cualquier momento** | Falta lo esencial: **bloqueo por fecha** |
| `useOpenedDoors` | Recuerda en `localStorage` qué puertas se abrieron | Se reutiliza la idea (clave por año) |
| `PhotoModal`, `GalleryTile` | Modal pergamino y puerta que gira en 3D | Se **copian y adaptan** (ver §5, decisión de reutilización) |
| `core/registry.js` + `vite.config.js` + `.env` | 3 bloques, un interruptor por bloque | Se añade un 4.º con el mismo patrón (`docs/NUEVO_BLOQUE.md`) |
| Paleta/fuentes (`base.css`) | Azul marino, oro, crema, pergamino, lacre · Great Vibes / Playfair / Nunito | Se mantiene: el adviento debe verse de la misma familia |
| Servidor | Ninguno (sitio estático) | Sin backend: la fecha la decide el dispositivo (ver §7) |

## 2. Decisión de arquitectura: bloque nuevo `advent` (no tocar la galería)

- **Por qué un bloque nuevo.** La galería es «abre lo que quieras»; el adviento es «hoy toca esta». Son reglas distintas y forzarlas en un mismo bloque lo llena de condicionales. Además el Plan Bloque 2 (música) está tocando la galería: así **no hay choques** entre planes.
- **Qué se toca fuera del bloque**: solo 4 líneas de configuración (`registry.js`, `vite.config.js`, `.env.example`, docs). La carta, la galería y el cesto **no deben notar nada**.
- **Qué NO se toca**: `AudioProvider` (se usa tal cual; cuando el Plan 2 lo amplíe a playlist, un bloque con una sola pista seguirá funcionando).

### Estructura de carpetas

```
carta-magica/src/blocks/advent/
├── index.jsx                 # raíz: une fecha + puertas abiertas + modal
├── block.meta.js             # id, título, música (opcional)
├── content.js                # título, año, fecha de inicio, textos de pantallas
├── days.data.js              # los 24 contenidos (texto puro, sin imports de Vite → testeable)
├── days.js                   # le añade las imágenes de assets/days/ (import.meta.glob)
├── advent.css                # estilos propios, clases con prefijo .advent-
├── lib/
│   ├── calendar.js           # lógica PURA de fechas y estados de puerta
│   └── calendar.test.js      # pruebas con node --test
├── hooks/
│   ├── useToday.js           # «hoy» local; se refresca a medianoche y al volver a la pestaña
│   └── useOpenedDays.js      # puertas abiertas en localStorage (clave por año)
├── components/
│   ├── AdventHeader.jsx      # título, progreso «7 de 24», cuenta atrás
│   ├── DoorGrid.jsx / Door.jsx
│   ├── DayModal.jsx          # elige la vista según el tipo de contenido
│   ├── views/                # Mensaje, Foto, Vale, Cancion, Reto
│   ├── LockedHint.jsx        # aviso «aún no: se abre el 12 de diciembre»
│   └── Finale.jsx            # puerta 24 especial
└── assets/ (days/01.webp … 24.webp, sounds/ opcional)
```

### Flujo de datos

```mermaid
flowchart LR
    CLOCK["Reloj del dispositivo<br/>useToday"] --> CAL["lib/calendar.js<br/>(funciones puras)"]
    CFG["content.js<br/>año + fecha de inicio"] --> CAL
    CAL -->|"estado por puerta:<br/>bloqueada · hoy · disponible"| GRID[DoorGrid]
    LS["localStorage<br/>useOpenedDays"] -->|"abierta / sin abrir"| GRID
    DAYS["days.js<br/>24 contenidos"] --> MODAL[DayModal]
    GRID -->|clic en puerta disponible| MODAL
    GRID -->|clic en puerta bloqueada| HINT[LockedHint]
```

**Por qué la lógica de fechas es una función pura aparte**: es la única parte donde un error arruina el regalo (abrir un día antes, o no poder abrirlo). Al ser pura se prueba con `node --test` sin navegador, igual que el resolvedor de bloques.

Reglas que fijará `calendar.js` (y sus pruebas):
1. Se compara la fecha como texto `AAAA-MM-DD` del **calendario local del dispositivo**, no con milisegundos (evita errores por horario de verano y husos).
2. Puerta N: `bloqueada` si su fecha es posterior a hoy · `hoy` si es hoy · `disponible` si ya pasó. **Una puerta pasada sin abrir sigue abriéndose** (el calendario no castiga).
3. Antes del 1-dic: todo bloqueado + cuenta atrás. Después del 24-dic: todo disponible. Otro año distinto al configurado: se trata igual (pasado = todo abierto).
4. `useToday` se actualiza solo a medianoche y al volver a la pestaña (en el móvil la página puede quedar abierta días).
5. **Modo vista previa** `?preview=2026-12-05` en la URL, para que tú pruebes cualquier día desde el móvil. Entrada inválida se ignora.

## 3. Lenguaje y herramientas (y por qué)

| Qué | Elección | Por qué |
|---|---|---|
| Lógica y componentes | **JavaScript (ES modules) + JSX** | Es lo que usa el proyecto. TypeScript pediría `tsc`, tipos y configuración = **dependencias nuevas**, y te preocupa la seguridad de `npm`. Las ayudas de tipos se cubren con comentarios JSDoc |
| UI | **React 19** | Ya instalado |
| Estilos | **Tailwind 4** para disposición + **CSS propio** (`advent.css`, prefijo `.advent-`) para puertas, brillos y 3D | Mismo reparto que `gallery.css` |
| Animación | **Framer Motion** (modal, aparición) + **CSS** (giro de puerta, pulso de «hoy», nieve) | Lo continuo y barato va en CSS; lo orquestado en Framer |
| Pruebas | **`node --test`** | Sin dependencias |
| Datos | Archivos JS (`days.data.js`) | Sin backend ni base de datos |
| **Dependencias nuevas** | **Ninguna** | Regla del proyecto |

## 4. Diseño UX/UI

### 4.1 Concepto visual (decisión tuya, §6)

| Opción | Qué es | Coste | Veredicto |
|---|---|---|---|
| **A. Puertas doradas** (recomendada) | Evolución de las puertas de la galería sobre azul noche con estrellas y nieve suave | Bajo | Coherente con el sitio, rápida de terminar y publicar a tiempo |
| B. Casa/pueblo nevado con ventanas | Ilustración SVG con 24 ventanas | Alto (hay que dibujarla) | Bonita, pero no llega al 1-dic |
| C. Sobres con lacre | Cada día es un sobre kraft con sello numerado; al abrir sale la carta | Medio | Conecta con la carta (bloque 1), pero reutilizaría assets de otro bloque. **Buena mejora posterior** («skin» nueva sobre la misma lógica) |

La separación lógica/diseño del §2 permite empezar con A y cambiar a C sin rehacer la lógica.

### 4.2 Pantalla principal (móvil primero: lo abrirá desde WhatsApp)

```
┌───────────────────────────┐
│  ✦  Calendario de adviento ✦ │   Great Vibes, crema
│  Hoy: 5 de diciembre         │   Nunito
│  Te espera la puerta 5  ↓    │   (botón que baja a la puerta de hoy)
│  ●●●●●○○○…  4 de 24 abiertas │   progreso
│ ┌────┬────┬────┬────┐        │
│ │ 1✓ │ 2✓ │ 3✓ │ 4✓ │        │   abiertas: miniatura + marca
│ ├────┼────┼────┼────┤        │
│ │ 5★ │ 6🔒│ 7🔒│ 8🔒│        │   5 = HOY (brillo pulsante)
│ ├────┼────┼────┼────┤        │
│ │ 9🔒│ …                      │   bloqueadas: oro apagado
│ └────┴────┴────┴────┘        │
└───────────────────────────┘
```
Móvil: **4 columnas × 6 filas** (puertas ≥ 72 px, cumple el mínimo táctil). Escritorio: 6 × 4, centrado, ancho máx. ~900 px.

**Críticas de usuario que condicionan el diseño:**
- **Orden numérico, sin barajar.** Los calendarios físicos esconden los números en desorden; en pantalla eso solo hace perder tiempo. La gracia se consigue con el brillo de «hoy» y el scroll automático a la puerta del día.
- **El día de hoy debe ser inconfundible** en 1 segundo: tamaño igual pero brillo, etiqueta «HOY» y pulso. Es la razón por la que entra la persona.
- **Una puerta bloqueada no debe ser muda.** Tocarla hace una sacudida corta y un aviso «Esta puerta se abre el 12 de diciembre». Si no, parece que la página se rompió.

### 4.3 Estados de una puerta

| Estado | Aspecto | Al tocarla |
|---|---|---|
| Bloqueada (futura) | Oro apagado, número visible, candado pequeño | Sacudida + aviso con la fecha |
| **Hoy** | Oro vivo, halo pulsante, etiqueta «HOY» | Gira y abre el modal |
| Disponible sin abrir (pasada) | Oro vivo, sin pulso, punto «pendiente» | Igual que hoy |
| Abierta | Puerta abierta con miniatura/icono del tipo de contenido y marca ✓ | Reabre el modal |

El estado se transmite con **forma + texto**, no solo con color (accesibilidad). Se comprobará contraste del número sobre el oro apagado.

### 4.4 Pantallas especiales
- **Antes del 1-dic**: puertas todas bloqueadas y cuenta atrás «Faltan 7 días». Así quien abra el enlace antes ve algo hermoso, no una página vacía.
- **Puerta 24 (final)**: más grande o con lazo, modal especial con confeti/chispas y el mensaje largo.
- **Después del 24**: todo abierto, mensaje de cierre y «volver a ver» cualquier día.

### 4.5 Modal del día (hoja de pergamino, como la galería)
Cabecera «Día 5 de 24» · título en Great Vibes · contenido según tipo · botón cerrar. Sin «Anterior/Siguiente» (en la galería tienen sentido, aquí romperían el bloqueo): solo cierra. Entrada con la puerta girando (≈ 450 ms de retraso, como ya hace la galería).

Tipos de contenido (un solo modal que elige la vista):

| Tipo | Contenido | Material |
|---|---|---|
| `mensaje` | Texto corto/largo | Solo texto |
| `foto` | Foto + frase | `.webp` |
| `vale` | «Vale por…» con estilo de cupón | Texto |
| `cancion` | Título, artista y **enlace** (Spotify/YouTube) | Enlace. No se suben mp3: pesa y evita derechos |
| `reto` | Adivinanza o mini-reto con la respuesta oculta (toque para revelar) | Texto |

Variar los tipos mantiene el interés de 24 días (24 fotos iguales cansan).

### 4.6 Color y tipografía
- **Base idéntica al sitio**: azul `#004280` (más oscuro hacia abajo, degradado a azul noche), oro `--color-gold*`, crema, pergamino. Acento de «hoy»: oro claro `--color-gold-light`; lacre `--color-wax` para etiquetas especiales.
- **Un único token nuevo opcional**: un verde pino para el lazo del día 24. Si no convence, se omite y se usa el lacre.
- Títulos: Great Vibes · textos de lectura: Playfair · números y etiquetas de interfaz («HOY», fechas): Nunito (se lee mejor pequeño).
- Fondo propio del bloque (pantalla completa, como `steamer`): degradado noche + estrellas + nieve **solo CSS**. No se modifica el `ParticleBackground` compartido.

### 4.7 Accesibilidad y movimiento
- Puertas = `button` con etiqueta hablada: «Puerta 5, disponible hoy» / «Puerta 12, se abre el 12 de diciembre». Las bloqueadas usan `aria-disabled` (siguen enfocables y avisan) en lugar de `disabled`.
- El aviso de puerta bloqueada se anuncia por región `aria-live`.
- Modal: foco al abrir y devolución al cerrar, Escape cierra (patrón ya probado en `PhotoModal`).
- `prefers-reduced-motion`: sin pulso, nieve ni giro 3D; basta un fundido.

## 5. Decisiones de reutilización
Un bloque **no importa de otro** (contrato de `docs/ARQUITECTURA.md`). Para `GalleryTile` y `PhotoModal` hay dos caminos: (1) **copiar y adaptar** ahora (~100 líneas) o (2) moverlos a `shared/`, lo que obliga a tocar la galería mientras el Plan 2 la modifica. **Recomiendo (1)**: el diseño de la puerta cambiará de todos modos (estados nuevos) y, si aparece un tercer uso, se extrae a `shared/` (regla de tres: abstraer cuando ya sabes qué es común).

## 6. Decisiones que necesito de ti

1. **Bloque nuevo `advent` o evolucionar la galería** → recomiendo bloque nuevo (§2).
2. **¿24 o 25 puertas?** Recomiendo **24** con final especial. La alternativa es 25 con la Navidad como final (el 4×6 de móvil pasaría a 5 filas).
3. **¿Fecha de inicio 1-dic?** (recomendado) ¿o empezar otro día / contar hacia atrás hasta la Navidad?
4. **Concepto visual**: A, B o C (§4.1). Recomiendo **A ahora, C después**.
5. **Tipos de contenido**: ¿los 5 del §4.5? ¿alguno que sobre?
6. **Música**: ¿ninguna, o una pista navideña en bucle (misma nota de derechos que en el Plan 2)? Si ninguna, `music: null`.
7. **¿Quién lo recibe y con qué tono?** (la carta va dirigida a Mari: ¿es para ella?). Define cómo escribo los textos de pantallas y propuestas de mensajes.
8. **Modo vista previa por URL**: ¿lo dejamos activo en producción? Recomiendo sí (§7 explica el porqué).

## 7. Riesgos y límites honestos

| Riesgo | Detalle y control |
|---|---|
| **El bloqueo es del lado del cliente** | Quien cambie la fecha del móvil o use `?preview=` puede abrir días futuros, y el contenido viaja dentro del sitio (se podría leer con las herramientas del navegador). Para un regalo personal es aceptable y es lo que mantiene el sitio estático y gratis. Si algún día importara de verdad: una función de Vercel que entregue el día solo si la fecha del servidor ya llegó (Fase opcional 8; rompe lo «100 % estático», no recomendada ahora) |
| Progreso por dispositivo | «Abiertas» vive en `localStorage`: en otro móvil aparecen como sin abrir. Es solo cosmético; el bloqueo depende de la fecha, no del almacenamiento |
| Huso horario | Se usa la fecha local de quien lo abre: a medianoche de **su** zona se abre la puerta |
| 24 contenidos = mucho trabajo | Es el verdadero cuello de botella, no el código. Fase 0 lo ataca primero; el código funciona con placeholders (como la galería) |
| Sitio abierto días sin recargar | `useToday` refresca a medianoche y al volver a la pestaña |
| Peso | 24 fotos × ~150 KB (webp 1200 px) ≈ 3,6 MB, con carga perezosa. Sin audio, la página es ligera |
| Un bloque por despliegue | Hay que publicar `advent` en **su propio proyecto de Vercel** con `VITE_BLOCK_ADVENT=true` y las demás en `false` (`docs/DESPLIEGUE.md`) |
| Cambios sin commitear en la carta | Hay trabajo sin guardar en `letter/` y `App.jsx`. Este plan no los toca, pero conviene commitearlos antes de empezar |

## 8. Material que necesito de ti

| # | Material | Formato | Obligatorio |
|---|---|---|---|
| 1 | **24 contenidos**: por día, tipo + título + texto (te dejo una tabla para rellenar) | Texto | Sí, pero puede llegar por tandas: el código usa placeholders |
| 2 | **Fotos** de los días tipo `foto` | `.webp/.jpg`, lado largo ≈ 1200 px, nombradas `01.webp`… | Los días con foto |
| 3 | **Textos de la pantalla**: título, subtítulo, mensaje antes del 1-dic, mensaje final | Texto (te propongo opciones) | Sí |
| 4 | **Enlaces de canciones** (tipo `cancion`) | URL | Solo esos días |
| 5 | **Música de fondo** (opcional) | `.mp3`, 128-192 kbps | No |
| 6 | **Imagen para compartir** por WhatsApp | `.png` 1200×630 | No |

Los iconos (candado, estrella, check) los dibujo como SVG propios: sin librerías.

## 9. Fases

### Fase 0 — Decisiones y contenido · S · 24-26 nov
- Resolver el §6; empezar a reunir el material 1-3.
- **Listo cuando**: decisiones cerradas y los textos de pantalla acordados (los 24 contenidos pueden seguir llegando).

### Fase 1 — Diseño visual · M · 25-26 nov (tu foco fuerte)
- Mockup de: pantalla principal (móvil y escritorio), los 4 estados de puerta, modal por tipo, pantalla previa al 1-dic y final del 24. Lo preparo como mockup visual para que lo apruebes **antes** de programar.
- **Listo cuando**: apruebas el boceto.

### Fase 2 — Lógica de fechas con pruebas · S · 26 nov
- `lib/calendar.js` y `calendar.test.js`: cada regla del §2, el límite de medianoche, año distinto, `?preview=` válido/inválido y 1-dic / 24-dic.
- **Listo cuando**: `npm test` en verde, incluidas las pruebas nuevas.

### Fase 3 — Esqueleto del bloque y registro · S · 26 nov
- Carpeta `advent/`, `block.meta.js`, registro en `registry.js`, `vite.config.js` y `.env.example`; pantalla mínima con título.
- **Listo cuando**: `npm run build` con solo `VITE_BLOCK_ADVENT=true` incluye este bloque y deja fuera los otros tres; `npm test` sigue en verde.

### Fase 4 — Cuadrícula y puertas · M · 27 nov
- `DoorGrid`, `Door` con los 4 estados, cabecera con progreso y cuenta atrás, fondo noche/nieve, aviso de puerta bloqueada, scroll a la puerta de hoy.
- **Listo cuando**: con `?preview=` de varios días (antes del 1-dic, 5-dic, 24-dic, 2027) cada puerta muestra el estado correcto.

### Fase 5 — Modal y tipos de contenido · M · 28 nov
- `DayModal` + las 5 vistas, final del 24, `useOpenedDays`, contenido real o placeholders.
- **Listo cuando**: se recorre el flujo «abrir hoy → leer → cerrar → recargar → sigue abierta» con ratón y con el dedo, a 360 px y en escritorio.

→ **Aquí hay un producto publicable.** Lo que sigue pule, pero no bloquea el 1-dic.

### Fase 6 — Accesibilidad, rendimiento y verificación · M · 29 nov
- Teclado, lector de pantalla, movimiento reducido, contraste, carga perezosa de fotos.
- Crear `docs/VERIFICACION_ADVIENTO.md`; actualizar `docs/ARQUITECTURA.md` y `docs/NUEVO_BLOQUE.md`.
- **Listo cuando**: la lista de verificación está completa y el tamaño de `dist` es razonable.

### Fase 7 — Despliegue en Vercel · S · 30 nov
- Proyecto de Vercel con `VITE_BLOCK_ADVENT=true`; probar en móvil real (Android e iPhone) abriendo el enlace desde WhatsApp, con `?preview=` de varios días.
- **Listo cuando**: el enlace público funciona y el 1-dic aparece la puerta 1 como «HOY» sin tocar nada.

### Fase 8 (opcional) — Mejoras posteriores
- Skin «sobres con lacre» (concepto C), música, bloqueo por servidor, confeti/sonidos al abrir.

## 10. Skills y herramientas de esta computadora

Lo que he podido verificar en el disco: **solo `find-skills`** está instalada (en `~/.claude/skills` y `~/.agents/skills`). Si instalaste otras, no las veo: dime sus nombres. Sí tengo disponibles en esta sesión, y las usaría así:

| Herramienta | Fase | Para qué |
|---|---|---|
| `artifact-design` | 1 | Mockup visual de las pantallas para tu aprobación |
| `code-review` | 3-6 | Revisar errores del bloque antes de publicar |
| `simplify` | 6 | Limpiar duplicación (p. ej. lo copiado de la galería) |
| `security-review` | 7 | Revisión antes de publicar |
| `find-skills` | 0 | Buscar una skill de diseño/frontend que aporte. **Instala código de terceros**, así que no lo haré sin tu visto bueno |

No usaré la skill `run` ni levantaré el servidor: lo revisas tú. Verifico con `npm test`, `npm run build` a una carpeta temporal y lectura del código, y te dejo la lista de qué mirar a mano.

## 11. Archivos que se tocarán

- **Nuevos**: todo `carta-magica/src/blocks/advent/`, `docs/VERIFICACION_ADVIENTO.md`.
- **Modificar (1-4 líneas cada uno)**: `core/registry.js`, `vite.config.js`, `carta-magica/.env.example`, `docs/ARQUITECTURA.md`, `docs/NUEVO_BLOQUE.md`, `docs/DESPLIEGUE.md`.
- **Sin cambios**: `blocks/letter/*`, `blocks/gallery/*`, `blocks/steamer/*`, `core/AudioProvider.jsx`, `shared/*`.

## 12. Orden recomendado

0 → 1 → 2 → 3 → 4 → 5 → **publicar** → 6 → 7. Si el tiempo aprieta, la Fase 6 se hace *después* de publicar el 30-nov y se despliega de nuevo.
