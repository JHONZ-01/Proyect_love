/**
 * Resolvedor de bloques (función pura, sin import.meta ni assets).
 *
 * Recibe las variables de entorno y la lista de bloques registrados
 * y devuelve el único bloque que debe mostrarse (modo "uno a la vez").
 *
 * Reglas:
 *  - Un bloque está activo si su bandera vale "true"; "false" lo apaga.
 *  - Si no hay ninguna bandera definida, se usa el primer bloque registrado.
 *  - Un valor distinto de "true"/"false" es un error de configuración.
 *  - Si hay varios activos se usa el primero del registro y se avisa.
 *  - Si no hay ninguno activo, es un error.
 */

export const parseFlag = (value) => {
    if (value === undefined || value === '') return undefined
    const normalized = String(value).trim().toLowerCase()
    if (normalized === 'true') return true
    if (normalized === 'false') return false
    return null // valor inválido
}

export function resolveBlock(env, registry) {
    const warnings = []
    const flags = registry.map((block) => ({
        block,
        value: parseFlag(env[block.flag]),
        raw: env[block.flag],
    }))

    const invalid = flags.find((f) => f.value === null)
    if (invalid) {
        return {
            status: 'error',
            code: 'INVALID_FLAG',
            message: `${invalid.block.flag}="${invalid.raw}" no es válido. Usa "true" o "false".`,
            warnings,
        }
    }

    // Sin ninguna bandera definida: por defecto el primer bloque registrado.
    if (flags.every((f) => f.value === undefined)) {
        return { status: 'ok', block: registry[0], warnings }
    }

    const active = flags.filter((f) => f.value === true).map((f) => f.block)

    if (active.length === 0) {
        return {
            status: 'error',
            code: 'NO_ACTIVE_BLOCK',
            message: `Ningún bloque está activo. Pon en "true" una de: ${registry.map((b) => b.flag).join(', ')}.`,
            warnings,
        }
    }

    if (active.length > 1) {
        warnings.push(
            `Hay ${active.length} bloques activos (${active.map((b) => b.id).join(', ')}). Se usa "${active[0].id}".`
        )
    }

    return { status: 'ok', block: active[0], warnings }
}
