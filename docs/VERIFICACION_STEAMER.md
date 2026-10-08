# Lista de verificación manual: bloque cesto de vapor (steamer)

Crea `carta-magica/.env` con `VITE_BLOCK_LETTER=false`, `VITE_BLOCK_GALLERY=false` y `VITE_BLOCK_STEAMER=true`, ejecuta `npm run dev` y revisa:

- [ ] La pantalla es completamente roja/tomate (sin las partículas azules del shell) y el texto "Rise & Steam" usa la fuente Sniglet.
- [ ] El cesto de bambú aparece con la tapa puesta, que se agita de vez en cuando, y salen "zzz".
- [ ] La leyenda dice "Tap the lid to wake them up".
- [ ] Al hacer clic en el cesto, la tapa salta hacia arriba con rebote y las tres bolitas suben con la carita despierta.
- [ ] Sale vapor y las bolitas se mueven suavemente; los ojos parpadean de vez en cuando.
- [ ] La leyenda cambia a "Tap again to tuck them back in".
- [ ] Un segundo clic vuelve a guardar las bolitas y a cerrar la tapa.
- [ ] Con el teclado: Tab llega al cesto (se ve un contorno punteado) y Espacio lo abre o cierra.
- [ ] En el celular o con la ventana angosta, el cesto se reduce y el título no se sale de la pantalla.
- [ ] Con "reducir movimiento" activado en el sistema, no hay animaciones continuas.
- [ ] Sin errores en la consola, y no suena nada.
- [ ] `npm run build` con esta configuración no genera ningún mp3 en `dist/assets`.
