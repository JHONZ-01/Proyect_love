import { useTypewriter } from '../../hooks/useTypewriter'

const PARAGRAPHS = [
    "Hay momentos en la vida que merecen ser compartidos de una manera diferente.",
    "Esta no es solo una página web, es una invitación a crear un recuerdo.",
]

export default function LetterBody() {
    const text = useTypewriter(PARAGRAPHS.join('\n\n'), 35)

    const [first, second] = text.split('\n\n')

    return (
        <div className="font-playfair text-[#4a3f35] text-lg leading-relaxed my-8 space-y-4 text-center">
            <p>{first}</p>
            {second && <p className="italic">{second}</p>}
        </div>
    )
}