
import { Dropdown } from "./Dropdown.jsx"
import { PalleteColor } from "./PalleteColor.jsx"

export function NoteImg({ onDeleteNoteClick,onCloneNote, onEditNoteClick, note, onPinClick, onPaletteClick, isPaletteOpen, onEditBackgroundColor, setIsPaletteOpen }) {
    return (
        <div className="card image-card" style={{ backgroundColor: note.style.backgroundColor }} onClick={() => onEditNoteClick(note)}>
            {isPaletteOpen &&
                <PalleteColor
                    noteId={note.id}
                    onEditBackgroundColor={onEditBackgroundColor}
                    setIsPaletteOpen={setIsPaletteOpen}
                    isPaletteOpen={isPaletteOpen} />
            }
            <button className="fa fa-thumbtack" onClick={(ev) => onPinClick(ev, note.id)} />
            <img className="note-img" src={note.info.url} />
            {note.info.title && (
                <h2 className="note-title">{note.info.title}</h2>
            )}
            <div className="card-navbar">
                <button className="fa fa-palette action-icon" onClick={(ev) => onPaletteClick(ev, note)}></button>
                <button className="fa fa-copy action-icon" onClick={(ev) => onCloneNote(ev,note)}></button>
                <button className="fa fa-trash delete-btn action-icon" onClick={(ev) => onDeleteNoteClick(ev, note.id)}></button>
            </div>
        </div>
    )
}
