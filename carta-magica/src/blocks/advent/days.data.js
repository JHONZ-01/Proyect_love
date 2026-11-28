// Contenido de los 25 días. ESTE ES EL ARCHIVO QUE SE RELLENA: cambia `title` y `text` de cada día.
// Sin imports de Vite (las fotos se enlazan aparte, por número, desde assets/days/01.webp…)
// para poder validar este archivo con node --test.
//
// type:  'mensaje' | 'foto' | 'vale' | 'cancion' | 'reto' | 'video' | 'final'   (el último día es siempre 'final')
//
// TAMAÑOS (los fija la composición, lib/layout.js): elige el tipo según el hueco.
//   grandes:    1 (bienvenida), 9, 18           -> regalos, vídeos, momentos grandes
//   altas:      3, 11, 17                       -> fotos (las verticales lucen mejor)
//   anchas:     4, 16, 23                       -> canciones, vales
//   destacadas: 24 (Nochebuena), 25 (Navidad)   -> lo más especial
//   pequeñas:   el resto                        -> mensajes, pistas, retos
// title: título del día (se ve en el modal)
// text:  el mensaje; en 'foto' es el pie de la foto; en 'reto' es la adivinanza
// Párrafos: sepáralos con una línea en blanco, escrita como \n\n dentro del texto:
//   text: 'Primer párrafo.\n\nSegundo párrafo.'
// Campos extra por tipo:
//   vale:    coupon  (qué se canjea; debajo sale «Canjeable cuando quieras»)
//   cancion: song = { title, artist, url }   url: enlace https de Spotify/YouTube, o '' para no mostrar botón
//   reto:    answer  (la respuesta; se muestra al tocar «Mostrar la respuesta»)
//   foto:    la imagen se pone en assets/days/ con el número del día: 03.webp, 11-playa.jpg…
//            alt (opcional): descripción de la foto para lectores de pantalla (si falta, se usa title)
//   video:   el archivo en assets/days/ con el número del día (18.mp4 o .webm, mejor < 10 MB),
//            o url: enlace https (YouTube, Drive…) para un botón «Ver el vídeo»; '' si no hay

export const DAY_TYPES = ['mensaje', 'foto', 'vale', 'cancion', 'reto', 'video', 'final']

const PLACEHOLDER = 'Aquí irá el contenido de este día.'

export const DAYS = [
    { day: 1, type: 'mensaje', title: 'Bienvenida', text: PLACEHOLDER },
    { day: 2, type: 'reto', title: 'Una adivinanza', text: PLACEHOLDER, answer: 'Aquí irá la respuesta.' },
    { day: 3, type: 'foto', title: 'Un recuerdo', text: PLACEHOLDER },
    { day: 4, type: 'cancion', title: 'Una canción para hoy', text: PLACEHOLDER, song: { title: 'Título de la canción', artist: 'Artista', url: '' } },
    { day: 5, type: 'mensaje', title: 'Un mensaje para ti', text: PLACEHOLDER },
    { day: 6, type: 'reto', title: 'Una adivinanza', text: PLACEHOLDER, answer: 'Aquí irá la respuesta.' },
    { day: 7, type: 'mensaje', title: 'Un mensaje para ti', text: PLACEHOLDER },
    { day: 8, type: 'vale', title: 'Un vale especial', text: PLACEHOLDER, coupon: 'Aquí irá lo que se canjea.' },
    { day: 9, type: 'vale', title: 'Un vale especial', text: PLACEHOLDER, coupon: 'Aquí irá lo que se canjea.' },
    { day: 10, type: 'reto', title: 'Una adivinanza', text: PLACEHOLDER, answer: 'Aquí irá la respuesta.' },
    { day: 11, type: 'foto', title: 'Un recuerdo', text: PLACEHOLDER },
    { day: 12, type: 'mensaje', title: 'Un mensaje para ti', text: PLACEHOLDER },
    { day: 13, type: 'reto', title: 'Una adivinanza', text: PLACEHOLDER, answer: 'Aquí irá la respuesta.' },
    { day: 14, type: 'mensaje', title: 'Un mensaje para ti', text: PLACEHOLDER },
    { day: 15, type: 'reto', title: 'Una adivinanza', text: PLACEHOLDER, answer: 'Aquí irá la respuesta.' },
    { day: 16, type: 'cancion', title: 'Una canción para hoy', text: PLACEHOLDER, song: { title: 'Título de la canción', artist: 'Artista', url: '' } },
    { day: 17, type: 'foto', title: 'Un recuerdo', text: PLACEHOLDER },
    { day: 18, type: 'video', title: 'Un vídeo para ti', text: PLACEHOLDER, url: '' },
    { day: 19, type: 'mensaje', title: 'Un mensaje para ti', text: PLACEHOLDER },
    { day: 20, type: 'reto', title: 'Una adivinanza', text: PLACEHOLDER, answer: 'Aquí irá la respuesta.' },
    { day: 21, type: 'mensaje', title: 'Un mensaje para ti', text: PLACEHOLDER },
    { day: 22, type: 'reto', title: 'Una adivinanza', text: PLACEHOLDER, answer: 'Aquí irá la respuesta.' },
    { day: 23, type: 'vale', title: 'Un vale especial', text: PLACEHOLDER, coupon: 'Aquí irá lo que se canjea.' },
    { day: 24, type: 'mensaje', title: 'Nochebuena', text: PLACEHOLDER },
    { day: 25, type: 'final', title: 'Feliz Navidad', text: PLACEHOLDER },
]
