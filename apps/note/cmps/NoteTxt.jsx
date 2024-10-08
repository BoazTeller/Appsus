
import { Dropdown } from "./Dropdown.jsx"
import { PalleteColor } from "./PalleteColor.jsx"

export function NoteTxt({ onDeleteNoteClick, onEditNoteClick, note, onPinClick, onPaletteClick, isPaletteOpen, onEditBackgroundColor, setIsPaletteOpen }) {
    return (
        <div className="card txt-card" style={{ backgroundColor: note.style.backgroundColor }} onClick={() => onEditNoteClick(note)}>
            <Dropdown onDeleteNoteClick={onDeleteNoteClick} onEditNoteClick={onEditNoteClick} note={note}></Dropdown>
            {isPaletteOpen &&
                <PalleteColor
                    noteId={note.id}
                    onEditBackgroundColor={onEditBackgroundColor}
                    setIsPaletteOpen={setIsPaletteOpen}
                    isPaletteOpen={isPaletteOpen} />
            }
            <button className="fa fa-thumbtack" onClick={(ev) => onPinClick(ev, note.id)}/>
            <h2 className="note-title">{note.info.title}</h2>
            <p className="note-txt">{note.info.txt}</p>
            <div className="card-navbar">
                <button className="fa fa-palette" onClick={(ev) => onPaletteClick(ev, note)}></button>
                <button className="fa fa-trash delete-btn" onClick={(ev) => onDeleteNoteClick(ev, note.id)}></button>
            </div>
        </div>
    )
}