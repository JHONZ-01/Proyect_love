# Plan de limpieza

Estado: **completado**, salvo dos puntos opcionales al final. La arquitectura por bloques se sigue en [docs/PLAN_BLOQUES.md](docs/PLAN_BLOQUES.md).

## Hecho
- [x] Eliminado el andamiaje de Next.js (`app/`, `public/`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`).
- [x] Eliminado código muerto (`envelopeVariants.js`, `theme.js`, `fonts.css`, `EnvelopeBody/Lid.jsx`) y CSS sin uso (`.valentines`, `.envelope`, `.front`, `.letter-shimmer`, animaciones `fade-up` y `flicker`).
- [x] La canción "Deportivo" se conserva (ahora es la música de la galería).
- [x] README y AGENTS.md reescritos para Vite.
- [x] `.npmrc` con `ignore-scripts=true`.
- [x] **Bug de la letra perdida** corregido en `useTypewriter` (`text.slice(0, i)`).
- [x] **Dependencias:** `npm audit fix --ignore-scripts` (26 paquetes con cambios menores o de parche; Vite 6.4.2 a 6.4.4). `npm audit`: 0 vulnerabilidades. Sin `--force`.
- [x] **`dist/` versionada:** se mantiene. Ver [docs/DESPLIEGUE.md](docs/DESPLIEGUE.md) para saber qué bloque contiene antes de publicar.
- [x] **Exports sin uso** eliminados de `buttonVariants.js` y `letterVariants.js`.
- [x] **Higiene:** mp3 renombrados (`persona-favorita.mp3`, `deportivo.mp3`); `.claude/launch.json` se mantiene versionado; `engines` (`node >=22`) añadido en `package.json`.
- [x] **Arquitectura multiuso con interruptores:** hecha, con pequeñas diferencias respecto a lo previsto (`core/` en lugar de `config/`; el interruptor además filtra el build). Ver el plan de bloques.

## Opcional, sin hacer
- [ ] **Comprimir los mp3** (~5 MB cada uno; por ejemplo a 128 kbps) para cargar más rápido en móvil. Requiere `ffmpeg`, que no está instalado en esta máquina.
- [ ] **Botón de WhatsApp** de la carta: existe solo en la rama de rechazo (`DeclineResponse.jsx`). Se dejó sin cambios a petición del usuario.
