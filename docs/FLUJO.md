# Flujo de la experiencia

## Etapas

`useAnimationState` maneja tres etapas: `envelope` → `opening` → `letter`. `App.jsx` renderiza según la etapa.

```mermaid
stateDiagram-v2
    [*] --> envelope
    envelope --> opening: clic en el sobre / "Abrir Carta"<br/>(startOpening + play música)
    opening --> letter: setTimeout 1200 ms
    letter --> envelope: reset() (existe en el hook, sin uso en la UI)
```

## Secuencia de usuario

```mermaid
sequenceDiagram
    actor U as Usuario
    participant E as EnvelopeScene
    participant A as App
    participant S as useSound
    participant L as Letter
    participant B as InvitationButtons

    U->>E: pasa el mouse (la tapa se abre)
    U->>E: clic en el sobre y en "Abrir Carta"
    E->>A: onOpen()
    A->>S: play() (música en bucle, volumen 0.6)
    A->>A: stage = opening
    A->>L: renderiza Letter (animación del sobre 3D)
    A->>A: a los 1200 ms stage = letter
    L->>L: texto con efecto máquina de escribir (useTypewriter)
    L->>B: tras 2.5 s aparecen los botones
    alt Sí, acepto
        U->>B: clic en aceptar
        B->>U: AcceptResponse (confeti + mensaje)
    else No puedo
        U->>B: pasa el mouse por "No"
        B->>B: el botón se esquiva las primeras 3 veces
        U->>B: clic en declinar
        B->>U: DeclineResponse
        U->>B: "reconsiderar" (reinicia el contador)
    end
```

## Dónde editar cada cosa

| Quiero cambiar... | Archivo |
|---|---|
| Nombre, párrafos, firma, mensajes y etiquetas | `src/constants/letterText.js` |
| Música de fondo | `src/App.jsx` (import del mp3, volumen) |
| Duración de la apertura | `src/hooks/useAnimationState.js` |
| Velocidad de escritura | `src/hooks/useTypewriter.js` (parámetro `speed`) |
| Cuántas veces huye el botón "No" | `src/components/invitation/InvitationButtons.jsx` (`dodgeCount < 3`) |
| Colores, sobre y pergamino | `src/index.css` |
| Título, descripción al compartir, fuentes | `carta-magica/index.html` |

## Flujo de trabajo del desarrollador

```mermaid
flowchart LR
    A[npm ci --ignore-scripts] --> B[npm run dev]
    B --> C[editar src/]
    C --> D[npm run build]
    D --> E[npm run preview]
    E --> F[desplegar dist/]
```

## Flujo planificado con bloques

1. Editar `.env` (`VITE_BLOCK_LETTER`, `VITE_BLOCK_GALLERY`).
2. Reiniciar `npm run dev` o rehacer `npm run build`.
3. `App.jsx` monta solo el bloque activo; cada bloque trae su música y textos.
