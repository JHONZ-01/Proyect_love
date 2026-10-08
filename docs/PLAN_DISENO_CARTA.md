# Plan de diseño: carta casi real (bloque 1)

Objetivo: una carta digital que se sienta de papel (sobre, sello, pliegues, luz), que funcione bien en móvil y que pese poco. Fondo azul y oro como identidad.

Cómo trabajamos: una fase a la vez. Al cerrar cada una, tú la miras en pantalla (captura en 3 anchos: 360, 390 y 768 px) y decidimos si pasa a la siguiente. Nada de fases en paralelo.

## Diagnóstico de la versión actual (captura del 2026-10-07)

| # | Qué se ve | Causa | Gravedad |
|---|---|---|---|
| 1 | Títulos pegados, botón con poco relleno, nada respira | **`base.css` tiene un reset `*{margin:0;padding:0}` sin capa.** En Tailwind 4 el CSS sin capa le gana a todas las utilidades, así que `mt-*`, `px-*`, `py-*`, `space-y-*`, `p-*` no hacen nada. Verificado en el CSS compilado. Afecta a **toda** la app, no solo a la portada | Alta |
| 2 | La solapa abierta tapa el título | Al girar 180° la solapa ocupa 56 % de la altura **por encima** del sobre y nadie reservó ese espacio | Alta |
| 3 | El texto de la hoja queda cortado por las solapas | La hoja sube solo 24 % y su texto queda en la zona que cubren las solapas laterales | Media |
| 4 | Renglones detrás de la letra cursiva | `paper1.png` es papel rayado; choca con Great Vibes | Media |
| 5 | Se ve plano y apagado | Colores lisos, sin sombra en los pliegues ni textura; el kraft no tiene luz | Media |
| 6 | La hoja asoma con el ratón | En móvil no existe el hover; es un efecto que la mayoría no verá y que además provoca el punto 2 | Media |
| 7 | Dos sobres distintos | La portada y `envelope-3d` (carta) son componentes separados; el paso de uno a otro es un salto | Alta (para el realismo) |

## Fases

### Fase 0: cimientos (sin diseño nuevo)
- Quitar el reset manual de `base.css` (Tailwind ya trae el suyo en capa) o meterlo en `@layer base`.
- Revisar **toda** la app tras el cambio: al volver los márgenes y rellenos, la carta, las respuestas, `ConfigError` y los otros bloques pueden moverse. Ajustar lo que se haya diseñado "a ciegas" con ellos apagados.
- Quitar el hover de la portada (punto 6) y definir cómo se mide: capturas en 360/390/768.
- **Listo cuando:** la portada y la carta se ven con sus espacios correctos y ningún bloque se descuadra.

### Fase 1: sobre cerrado con material y luz
- Textura kraft sobre el sobre, luz suave de arriba a abajo, sombra en los dobleces, borde del papel.
- Solapa dorada con degradado y brillo; sello de lacre con relieve (imagen o SVG mejorado).
- Presupuesto: textura < 60 KB en WebP.
- **Listo cuando:** el sobre cerrado, solo, ya parece un objeto.

### Fase 2: un solo sobre y espacio para abrirse
- Un único componente de sobre para portada y carta; se elimina `envelope-3d`, `flap-*` y `letter-physical` con medidas en px.
- Reservar el espacio de la solapa abierta (o animarla sin tapar el texto: el título sube o se desvanece al abrir).
- **Listo cuando:** no hay "salto" entre portada y carta y nada se superpone.

### Fase 3: secuencia de apertura y gesto
- Línea de tiempo con pasos: el sello se rompe, la solapa gira, la hoja sube, la hoja crece hasta el tamaño de lectura.
- Gesto táctil (arrastrar la hoja hacia arriba) además del botón; vibración suave (`navigator.vibrate`) opcional.
- Sonido corto de sello y papel (< 30 KB cada uno), solo tras el primer toque.
- **Listo cuando:** abrir se siente como un objeto físico, también con el dedo.

### Fase 4: la carta (papel y lectura)
- Papel crema **sin renglones**, con grano, bordes y los dos pliegues en tercios con sombra.
- Tipografía legible en 360 px: tamaños, interlineado y ancho de línea.
- Aparición del texto (máquina de escribir) revisada y que no bloquee la lectura.
- **Listo cuando:** se lee cómodo con una mano en un teléfono pequeño.

### Fase 5: respuestas Sí/No
- Rediseñar las dos respuestas con la misma paleta y materiales; el nuevo botón de "rechazo" y WhatsApp quedan como están funcionalmente.
- **Listo cuando:** las dos ramas conservan el estilo del resto.

### Fase 6: peso y datos
- Audio de 5 MB a ≤ 500 KB; fuentes autoalojadas en woff2 (Nunito, Playfair, Great Vibes, sin JetBrains Mono si no se usa); imágenes en WebP.
- Prueba con red lenta (3G simulado) y `prefers-reduced-motion`.
- Meta: la portada completa < 300 KB antes del audio.
- **Listo cuando:** se carga rápido en datos móviles.

### Fase 7: compatibilidad y publicación
- Pruebas en Safari iOS y Chrome Android (3D, `backface-visibility`, `dvh`).
- Variables `VITE_BLOCK_*` en Vercel y despliegue (ver `DESPLIEGUE.md`).
- **Listo cuando:** abre bien desde un enlace en un teléfono real.

## Puntos frágiles a vigilar

| Riesgo | Por qué | Cómo lo controlamos |
|---|---|---|
| Sombras y filtros animados | Se traban en móviles de gama media | Animar solo `transform` y `opacity`; sombras estáticas |
| `preserve-3d` en Safari | Falla con `overflow`, `filter` y `z-index` | Probar en iOS en la fase 3, no al final |
| Texturas pesadas | Consumen datos y memoria | WebP, presupuesto por recurso |
| Autoplay de audio | Los navegadores lo bloquean | Siempre tras un toque del usuario |
| Cambiar muchas cosas a la vez | No se sabe qué rompió qué | Una fase por vez y captura al cerrar |
| Fondo azul vs. oro | El oro sobre azul puede verse "recargado" | Un solo oro; el brillo viene de la luz, no de más colores |

## Recursos externos que necesito (por fase)

| Fase | Recurso | Formato | Dónde ponerlo |
|---|---|---|---|
| 1 | Textura de **papel kraft** (sin costura si es posible) | JPG/WebP, ~800 px, < 100 KB | `src/blocks/letter/assets/` |
| 1 | **Sello de lacre** rojo con corazón, vista frontal, fondo transparente | PNG o SVG, ~300 px | igual |
| 3 | Sonido corto de **ruptura de sello** y **papel que se desliza** | MP3, < 30 KB | igual |
| 4 | Textura de **papel crema SIN renglones**, con grano | JPG/WebP, ~900 px | igual |
| 1 (opcional) | Textura de **lámina dorada** para la solapa | JPG/WebP | igual |

Dónde conseguirlos con licencia libre: Pixabay, Freepik (con atribución en el plan gratuito), Unsplash para texturas y Freesound para sonidos. También se pueden generar con IA; en ese caso pídeme el *prompt* y lo afino por recurso. Lo que ya generaste para la imagen de referencia de la portada sirve como guía de estilo.
