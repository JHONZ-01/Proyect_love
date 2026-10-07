# Carta mágica

Invitación interactiva: un sobre que se abre, una carta con efecto de máquina de escribir y botones de respuesta (el "No" se esquiva). Construida con React 19, Vite 6, Tailwind 4 y Framer Motion. Es un sitio estático, sin backend.

## Inicio rápido

```bash
npm ci --ignore-scripts   # instala exactamente lo del lock, sin scripts de terceros
npm run dev               # http://localhost:5173
npm run build             # genera carta-magica/dist
npm run preview           # previsualiza el build
```

`.npmrc` ya trae `ignore-scripts=true`. Si el build falla por `esbuild`, ejecuta `npm rebuild esbuild`.

## Documentación

- [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md): stack, estructura de carpetas, diagrama de componentes, despliegue y bloques con interruptor.
- [docs/FLUJO.md](docs/FLUJO.md): etapas, secuencia de usuario, dónde editar cada cosa.
- [PLAN_LIMPIEZA.md](PLAN_LIMPIEZA.md): tareas hechas y pendientes.

## Personalizar

Los textos (nombre, párrafos, firma, respuestas) están en `carta-magica/src/constants/letterText.js`. La música se cambia en `carta-magica/src/App.jsx`. La tabla completa está en [docs/FLUJO.md](docs/FLUJO.md#dónde-editar-cada-cosa).

## Estructura

```
carta-magica/src/
├── App.jsx            # etapas + música
├── components/        # envelope, letter, invitation, ui
├── hooks/             # useAnimationState, useSound, useTypewriter
├── animations/        # variantes de Framer Motion
├── constants/         # textos
└── assets/            # sounds, textures
```

## Notas

- La canción `Deportivo` en `assets/sounds` se conserva a propósito para un uso futuro; no eliminarla.
- Hoy `carta-magica/dist` está versionada (ver el plan).
- Próximo paso: bloques activables por `.env` (carta, galería). Ver el plan, punto 6.
