import { motion } from 'framer-motion'

/**
 * Un snippet de código decorativo con estilo de programador.
 * Se usa como detalle visual premium en la carta.
 */
export default function CodeSnippet({ code, language = 'javascript' }) {
    const defaultCode = `const invitacion = {
  destino: "cine",
  compañia: "tú",
  plan: "disfrutar el momento",
  resultado: "incierto pero prometedor",
};`

    const displayCode = code || defaultCode

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3, duration: 0.8 }}
            className="my-6 mx-auto max-w-sm"
        >
            {/* Barra de título del editor */}
            <div className="flex items-center gap-1.5 px-3 py-2 bg-[#1e1e2e] rounded-t-lg">
                <span className="w-3 h-3 rounded-full bg-red-400/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <span className="w-3 h-3 rounded-full bg-green-400/80" />
                <span className="ml-auto text-xs text-gray-500 font-['JetBrains_Mono']">
                    {language}
                </span>
            </div>

            {/* Código */}
            <pre className="bg-[#1e1e2e] px-4 py-3 rounded-b-lg overflow-x-auto border border-[#2d2d3f] border-t-0">
                <code className="font-['JetBrains_Mono'] text-xs sm:text-sm text-[#a6e3a1] leading-relaxed whitespace-pre">
                    {displayCode}
                </code>
            </pre>
        </motion.div>
    )
}
