/** Una bolita con carita. `variant`: left | middle | right. `mouth`: smile | grin. */
export default function Dumpling({ variant, mouth }) {
    return (
        <span className={`dumpling dumpling-${variant}`}>
            <span className="dumpling-body">
                <span className="face">
                    <span className="eye eye-left" />
                    <span className="eye eye-right" />
                    <span className="blush blush-left" />
                    <span className="blush blush-right" />
                    <span className={`mouth mouth-${mouth}`} />
                </span>
            </span>
        </span>
    )
}
