# Lista de verificación manual: bloque galería

Crea `carta-magica/.env` con `VITE_BLOCK_LETTER=false` y `VITE_BLOCK_GALLERY=true`, ejecuta `npm run dev` y revisa:

- [ ] Se ve el título "Calendario de recuerdos" y la cuadrícula de puertas numeradas.
- [ ] Las celdas tienen tamaños distintos y no quedan huecos grandes.
- [ ] Al pulsar una puerta, se abre con animación y luego aparece el modal.
- [ ] La música suena con el primer clic.
- [ ] El botón "Música" pausa y reanuda (sin reiniciar la canción).
- [ ] El modal se cierra con Escape, con la × y haciendo clic fuera.
- [ ] Las flechas del teclado y los botones Anterior/Siguiente navegan (y dan la vuelta al llegar al final).
- [ ] Las puertas ya abiertas siguen abiertas tras recargar la página.
- [ ] En el celular (o con la ventana angosta) la cuadrícula se reacomoda y el modal cabe en pantalla.
- [ ] Sin errores en la consola.
- [ ] `npm run build` con esta configuración solo trae `deportivo.mp3` en `dist/assets`.
