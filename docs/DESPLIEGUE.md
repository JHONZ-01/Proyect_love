# Despliegue

El proyecto es un sitio estático: el resultado de `npm run build` es la carpeta `carta-magica/dist`. Sirve cualquier hosting de archivos. **El proveedor aún no está elegido**; esta guía deja listo lo que cualquiera necesita.

## Lo que hay que saber antes

1. **El bloque que se publica lo decide el `.env` en el momento del build.** `carta-magica/.env` no se versiona, así que un hosting que compile por su cuenta no lo verá: hay que definir las variables en su panel.
2. **`dist/` está versionada.** Lo que se commitea es el build del último `npm run build`, con el `.env` que había en ese momento. Antes de publicar desde el repo, confirma qué bloque contiene (`dist/assets` trae solo la música del bloque elegido: `persona-favorita` = carta, `deportivo` = galería).
3. **Rutas absolutas.** Vite genera `/assets/...`. Funciona en la raíz de un dominio. Si el sitio queda en una subruta (por ejemplo GitHub Pages en un repositorio: `usuario.github.io/repo/`), hay que añadir `base: '/repo/'` en `vite.config.js` (o `base: './'`).
4. **Instalación:** `npm ci --ignore-scripts` (el `.npmrc` ya lo fuerza para `npm install`).

## Opción A: publicar `dist/` tal cual (sin build en el hosting)

Sube o apunta el hosting a `carta-magica/dist`. No necesita Node ni variables, pero depende de que commitees un build correcto.

```bash
# en .env: elegir el bloque
npm ci --ignore-scripts
npm test
npm run build
git add carta-magica/dist && git commit -m "build: <bloque>"
```

## Opción B: que el hosting compile

Configuración común en Netlify, Vercel, Cloudflare Pages o similares:

| Campo | Valor |
|---|---|
| Install command | `npm ci --ignore-scripts` |
| Build command | `npm run build` |
| Output / publish directory | `carta-magica/dist` |
| Node | 22 o superior |
| Variables de entorno | `VITE_BLOCK_LETTER` y `VITE_BLOCK_GALLERY` (`true`/`false`) |

Con esta opción `dist/` ya no hace falta en git: se puede añadir `carta-magica/dist` al `.gitignore` y ejecutar `git rm -r --cached carta-magica/dist`.

## Varios sitios con el mismo repositorio

Como el bloque se fija al compilar, para publicar la carta y la galería a la vez en dominios distintos se crean **dos proyectos en el hosting** apuntando al mismo repositorio, cada uno con sus variables (por ejemplo uno con `VITE_BLOCK_LETTER=true` y otro con `VITE_BLOCK_GALLERY=true`, el otro en `false`).

## Antes de cada publicación

- [ ] `npm test` en verde.
- [ ] `npm audit` sin vulnerabilidades.
- [ ] `npm run build` sin errores con el `.env` correcto.
- [ ] `npm run preview` y revisar con la lista de [VERIFICACION_CARTA.md](VERIFICACION_CARTA.md) o [VERIFICACION_GALERIA.md](VERIFICACION_GALERIA.md).
- [ ] Si la carta incluye WhatsApp, comprobar el número y el mensaje en `DeclineResponse.jsx`.
