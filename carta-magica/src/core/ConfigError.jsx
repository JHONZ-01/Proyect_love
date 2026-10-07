/** Pantalla que se muestra cuando la configuración de bloques es inválida. */
export default function ConfigError({ message }) {
    return (
        <div className="max-w-md mx-4 p-6 rounded bg-[#F5ECD7] text-[#4a3f35] text-center shadow-2xl font-['Playfair_Display']">
            <h1 className="text-2xl mb-3">Configuración de bloques inválida</h1>
            <p className="mb-3">{message}</p>
            <p className="text-sm opacity-70">Revisa el archivo .env y reinicia el servidor.</p>
        </div>
    )
}
