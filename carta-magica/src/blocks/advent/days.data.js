// Contenido de los 25 días. ESTE ES EL ARCHIVO QUE SE RELLENA: cambia `title` y `text` de cada día.
// Sin imports de Vite (las fotos se enlazan aparte, por número, desde assets/days/01.webp…)
// para poder validar este archivo con node --test.
//
// type:  'mensaje' | 'foto' | 'vale' | 'cancion' | 'reto' | 'final'   (el último día es siempre 'final')
// title: título del día (se ve en el modal)
// text:  el mensaje; en 'foto' es el pie de la foto; en 'reto' es la adivinanza
// Campos extra por tipo (los usa el modal en la Fase 5):
//   vale:    coupon  (qué se canjea)
//   cancion: song = { title, artist, url }
//   reto:    answer  (la respuesta)

export const DAY_TYPES = ['mensaje', 'foto', 'vale', 'cancion', 'reto', 'final']

const PLACEHOLDER = 'Aquí irá el contenido de este día.'

export const DAYS = [
    { day: 1, type: 'mensaje', title: 'Un mensaje para ti', text: PLACEHOLDER },
    { day: 2, type: 'foto', title: 'Un recuerdo', text: PLACEHOLDER },
    { day: 3, type: 'vale', title: 'Un vale especial', text: PLACEHOLDER },
    { day: 4, type: 'cancion', title: 'Una canción para hoy', text: PLACEHOLDER },
    { day: 5, type: 'reto', title: 'Una adivinanza', text: PLACEHOLDER },
    { day: 6, type: 'mensaje', title: 'Un mensaje para ti', text: PLACEHOLDER },
    { day: 7, type: 'foto', title: 'Un recuerdo', text: PLACEHOLDER },
    { day: 8, type: 'vale', title: 'Un vale especial', text: PLACEHOLDER },
    { day: 9, type: 'cancion', title: 'Una canción para hoy', text: PLACEHOLDER },
    { day: 10, type: 'reto', title: 'Una adivinanza', text: PLACEHOLDER },
    { day: 11, type: 'mensaje', title: 'Un mensaje para ti', text: PLACEHOLDER },
    { day: 12, type: 'foto', title: 'Un recuerdo', text: PLACEHOLDER },
    { day: 13, type: 'vale', title: 'Un vale especial', text: PLACEHOLDER },
    { day: 14, type: 'cancion', title: 'Una canción para hoy', text: PLACEHOLDER },
    { day: 15, type: 'reto', title: 'Una adivinanza', text: PLACEHOLDER },
    { day: 16, type: 'mensaje', title: 'Un mensaje para ti', text: PLACEHOLDER },
    { day: 17, type: 'foto', title: 'Un recuerdo', text: PLACEHOLDER },
    { day: 18, type: 'vale', title: 'Un vale especial', text: PLACEHOLDER },
    { day: 19, type: 'cancion', title: 'Una canción para hoy', text: PLACEHOLDER },
    { day: 20, type: 'reto', title: 'Una adivinanza', text: PLACEHOLDER },
    { day: 21, type: 'mensaje', title: 'Un mensaje para ti', text: PLACEHOLDER },
    { day: 22, type: 'foto', title: 'Un recuerdo', text: PLACEHOLDER },
    { day: 23, type: 'vale', title: 'Un vale especial', text: PLACEHOLDER },
    { day: 24, type: 'cancion', title: 'Una canción para hoy', text: PLACEHOLDER },
    { day: 25, type: 'final', title: 'Feliz Navidad', text: PLACEHOLDER },
]
