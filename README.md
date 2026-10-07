# Carta mágica

Proyecto multiuso hecho de **bloques**: cada bloque es una experiencia independiente y un interruptor en `.env` decide cuál se muestra.

- **Bloque 1, carta:** un sobre que se abre, una carta con efecto de máquina de escribir y botones de respuesta (el "No" se esquiva).
- **Bloque 2, galería:** un calendario de recuerdos digital: cuadrícula de puertas con fotos, modal y música de fondo.

Construido con React 19, Vite 6, Tailwind 4 y Framer Motion. Es un sitio estático, sin backend.

## Inicio rápido

```bash
npm ci --ignore-scripts   # instala exactamente lo del lock, sin scripts de terceros
cp carta-magica/.env.example carta-magica/.env   # elegir el bloque (ver abajo)
npm run dev               # http://localhost:5173
npm test                  # pruebas del selector de bloques
npm run build             # genera carta-magica/dist (solo el bloque elegido)
npm run preview           # previsualiza el build
```

`.npmrc` ya trae `ignore-scripts=true`. Si el build falla por `esbuild`, ejecuta `npm rebuild esbuild`.

## Elegir el bloque

En `carta-magica/.env`:

```env
VITE_BLOCK_LETTER=true
VITE_BLOCK_GALLERY=false
```

- Se muestra un solo bloque. Para la galería, pon la carta en `false` y la galería en `true`.
- Sin ninguna variable definida se muestra la carta.
- Cambiar el `.env` exige reiniciar `npm run dev` o rehacer `npm run build`. Es un interruptor, no un secreto: los valores quedan en el bundle.

## Agregar fotos a la galería

Copia los archivos (`.jpg`, `.jpeg`, `.png` o `.webp`) a `carta-magica/src/blocks/gallery/assets/photos/`. Se ordenan por nombre (`01.jpg`, `02.jpg`...). Títulos, mensajes y tamaño de cada foto se editan en `PHOTO_DETAILS`, dentro de `blocks/gallery/content.js`.

## Documentación

- [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md): stack, estructura, selección de bloque, contrato de bloque y despliegue.
- [docs/FLUJO.md](docs/FLUJO.md): flujos de cada bloque y dónde editar cada cosa.
- [docs/NUEVO_BLOQUE.md](docs/NUEVO_BLOQUE.md): guía paso a paso para crear un bloque.
- [docs/PLAN_BLOQUES.md](docs/PLAN_BLOQUES.md): plan por fases de la arquitectura de bloques y su avance.
- [docs/VERIFICACION_CARTA.md](docs/VERIFICACION_CARTA.md) y [docs/VERIFICACION_GALERIA.md](docs/VERIFICACION_GALERIA.md): listas de verificación manual.
- [PLAN_LIMPIEZA.md](PLAN_LIMPIEZA.md): plan de limpieza general.

## Estructura

```
carta-magica/src/
├── App.jsx            # shell: fondo + bloque activo
├── core/              # selección de bloque, registro y audio
├── shared/            # fondo de partículas, useSound, estilos base
└── blocks/
    ├── letter/        # bloque 1
    └── gallery/       # bloque 2
```

## Notas

- `carta-magica/dist` está versionada: reconstruirla (`npm run build`) y commitearla al desplegar.
- `.env` no se versiona; `.env.example` sí.
