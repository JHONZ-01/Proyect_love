// Ficha del estilo «Noche dorada». Sin imports de Vite (se valida con node --test).
// decor: adornos propios del estilo -> "bow" (lazo), "hearts" (corazones en vez de nieve), "dots" (lunares de fondo),
//        "twinkle" (estrellas que destellan en el cielo).
// Imagen propia opcional: pon assets/header.(png|webp|svg|jpg) en esta carpeta y saldrá sobre el título.
export default {
    id: 'noche-dorada',
    order: 2,
    name: 'Noche dorada',
    description: 'Azul noche y oro. La misma familia que la carta.',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Figtree:wght@500;600;700;800&display=swap',
    decor: ['twinkle'],
}
