import { LETTER_HEADER } from '../../constants/letterText'

export default function LetterHeader() {
    return (
        <header className="text-center mb-6">
            <h1 className="font-['Great_Vibes'] text-5xl text-[#8b5e3c] mb-3">
                {LETTER_HEADER}
            </h1>
            <div className="h-px w-24 bg-[#C8A96E] mx-auto" />
        </header>
    )
}
