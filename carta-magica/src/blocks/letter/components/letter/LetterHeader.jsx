import { LETTER_HEADER } from '../../content'

export default function LetterHeader() {
    return (
        <header className="text-center mb-6">
            <h1 className="font-script text-5xl text-sepia mb-3">
                {LETTER_HEADER}
            </h1>
            <div className="h-px w-24 bg-gold mx-auto" />
        </header>
    )
}
