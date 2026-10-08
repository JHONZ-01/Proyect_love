# Flujo de la experiencia

## Arranque

```mermaid
flowchart TD
    A[Carga la app] --> B["BlockHost: resolveBlock(env, registro)"]
    B -->|error de configuración| E[ConfigError]
    B -->|bloque elegido| C["carga perezosa del bloque + su meta"]
    C --> D["AudioProvider con la música del bloque"]
    D -->|"letter"| L[Flujo de la carta]
    D -->|"gallery"| G[Flujo de la galería]
    D -->|"steamer"| S[Flujo del cesto de vapor]
```

## Bloque carta

`useAnimationState` maneja tres etapas: `envelope` → `opening` → `letter`.

```mermaid
stateDiagram-v2
    [*] --> envelope
    envelope --> opening: clic en el sobre y "Abrir Carta"<br/>(startMusic + startOpening)
    opening --> letter: setTimeout 1200 ms
    letter --> envelope: reset() (existe en el hook, sin uso en la UI)
```

```mermaid
sequenceDiagram
    actor U as Usuario
    participant E as EnvelopeScene
    participant B as LetterBlock
    participant A as AudioProvider
    participant L as Letter
    participant I as InvitationButtons

    U->>E: pasa el mouse (la tapa se abre)
    U->>E: clic en el sobre y en "Abrir Carta"
    E->>B: onOpen()
    B->>A: startMusic() (bucle)
    B->>B: stage = opening, y a los 1200 ms letter
    B->>L: renderiza la carta (efecto máquina de escribir)
    L->>I: tras 2.5 s aparecen los botones
    alt Sí, acepto
        U->>I: AcceptResponse (confeti + mensaje)
    else No puedo
        U->>I: el botón se esquiva las primeras 3 veces
        I->>U: DeclineResponse: confirmar, escribir motivo y enviar por WhatsApp
        U->>I: "Pensarlo de nuevo" reinicia
    end
```

## Bloque galería

```mermaid
sequenceDiagram
    actor U as Usuario
    participant T as GalleryTile
    participant G as GalleryBlock
    participant A as AudioProvider
    participant M as PhotoModal

    U->>T: clic en una puerta
    T->>G: onSelect(foto)
    G->>A: startMusic() (solo la primera vez)
    G->>G: guarda la puerta como abierta (localStorage)
    G->>M: abre el modal (450 ms después si la puerta estaba cerrada)
    U->>M: flechas / Anterior / Siguiente (abren esa puerta también)
    U->>M: Escape, × o clic fuera: cierra
    U->>A: botón Música: pausa o reanuda
```

## Bloque cesto de vapor

Toda la interacción es CSS, sin estado de React: un `checkbox` oculto (`#lid-toggle`) y su `label` (el cesto). Al marcarlo, los selectores `:checked + .steamer` y `:checked ~ .caption` abren la tapa, levantan las bolitas, hacen salir el vapor y cambian la leyenda.

```mermaid
stateDiagram-v2
    [*] --> cerrado
    cerrado --> abierto: clic o Espacio sobre el cesto (checkbox :checked)
    abierto --> cerrado: segundo clic
    note right of cerrado: tapa que se agita, "zzz", bolitas con los ojos cerrados
    note right of abierto: tapa levantada, bolitas con ojos abiertos y rebote, vapor
```

Sin música (`music: null` en `block.meta.js`). Respeta `prefers-reduced-motion`. La estructura `input` → `label.steamer` → `h1` → `p.caption` debe mantenerse en ese orden, porque el CSS usa selectores de hermanos.

## Dónde editar cada cosa

| Quiero cambiar... | Archivo |
|---|---|
| Qué bloque se muestra | `carta-magica/.env` (reiniciar `dev`) |
| Textos de la carta (nombre, párrafos, firma, respuestas) | `src/blocks/letter/content.js` |
| Música de la carta | `src/blocks/letter/block.meta.js` |
| Duración de la apertura | `src/blocks/letter/hooks/useAnimationState.js` |
| Velocidad de escritura | `src/blocks/letter/hooks/useTypewriter.js` (`speed`) |
| Cuántas veces huye el botón "No" | `src/blocks/letter/components/invitation/InvitationButtons.jsx` |
| Número de WhatsApp y mensaje del rechazo | `src/blocks/letter/components/invitation/DeclineResponse.jsx` |
| Fotos de la galería | copiarlas a `src/blocks/gallery/assets/photos/` |
| Título, textos y tamaño de cada foto | `src/blocks/gallery/content.js` (`PHOTO_DETAILS`) |
| Tamaño de celdas y puertas | `src/blocks/gallery/gallery.css` |
| Música de la galería | `src/blocks/gallery/block.meta.js` |
| Textos del cesto de vapor (título, leyendas) | `src/blocks/steamer/content.js` |
| Colores, tamaño y animaciones del cesto | `src/blocks/steamer/steamer.css` (variables al inicio, bajo `.steamer-block`) |
| Colores globales y fondo | `src/shared/styles/base.css` |
| Título, descripción al compartir, fuentes | `carta-magica/index.html` |

## Flujo de trabajo del desarrollador

```mermaid
flowchart LR
    A["npm ci --ignore-scripts"] --> B[copiar .env.example a .env]
    B --> C[npm run dev]
    C --> D[editar src/]
    D --> T[npm test]
    T --> E[npm run build]
    E --> F[npm run preview]
    F --> G[desplegar dist/]
```
