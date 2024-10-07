
import { Dropdown } from "./Dropdown.jsx"
import { PalleteColor } from "./PalleteColor.jsx"

export function NoteImg({ onDeleteNoteClick, onEditNoteClick, note, onPaletteClick, isPaletteOpen, onEditBackgroundColor, setIsPaletteOpen }) {
    return (
        <div className="card image-card" style={{ backgroundColor: note.style.backgroundColor }} onClick={() => onEditNoteClick(note)}>
            <Dropdown onDeleteNoteClick={onDeleteNoteClick} onEditNoteClick={onEditNoteClick} note={note}></Dropdown>
            {isPaletteOpen &&
                <PalleteColor
                    noteId={note.id}
                    onEditBackgroundColor={onEditBackgroundColor}
                    setIsPaletteOpen={setIsPaletteOpen}
                    isPaletteOpen={isPaletteOpen} />
            }
            <img className="note-img" src={note.info.url} />
            {note.info.title && (
                <h2 className="note-title">{note.info.title}</h2>
            )}
            <div className="card-navbar">
                <button className="fa fa-palette" onClick={(ev) => onPaletteClick(ev, note)}></button>
                <button className="fa fa-trash delete-btn" onClick={(ev) => onDeleteNoteClick(ev, note.id)}></button>
            </div>
        </div>
    )
}
