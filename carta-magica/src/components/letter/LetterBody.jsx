import { useTypewriter } from '../../hooks/useTypewriter'
import { LETTER_PARAGRAPHS } from '../../constants/letterText'
import CodeSnippet from '../ui/CodeSnippet'

export default function LetterBody() {
    const text = useTypewriter(LETTER_PARAGRAPHS.join('\n\n'), 35)

    const paragraphs = text.split('\n\n')

    return (
        <div className="font-['Playfair_Display'] text-[#4a3f35] text-lg leading-relaxed my-8 space-y-4 text-center">
            {paragraphs.map((p, i) => (
                p && <p key={i} className={i > 0 ? 'italic' : ''}>{p}</p>
            ))}

            {/* Snippet de código decorativo */}
            <CodeSnippet />
        </div>
    )
}