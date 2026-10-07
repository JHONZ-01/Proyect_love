import { motion } from 'framer-motion'
import Placeholder from './Placeholder'

/** Una "puerta" del calendario: al abrirla se ve la foto que hay detrás. */
export default function GalleryTile({ photo, isOpen, onSelect }) {
    return (
        <motion.button
            type="button"
            onClick={() => onSelect(photo)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            aria-label={isOpen ? `Ver ${photo.title}` : `Abrir la puerta ${photo.day}`}
            className={`gallery-tile gallery-tile--${photo.span || 'normal'} ${isOpen ? 'is-open' : ''}`}
        >
            <div className="gallery-tile__photo">
                {photo.src
                    ? <img src={photo.src} alt={photo.title} loading="lazy" draggable="false" />
                    : <Placeholder day={photo.day} />}
            </div>
            <div className="gallery-tile__door" aria-hidden="true">
                <span className="gallery-tile__number">{photo.day}</span>
            </div>
        </motion.button>
    )
}
