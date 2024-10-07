
import { Dropdown } from "./Dropdown.jsx"

export function NoteImg({ onDeleteNoteClick, onEditNoteClick, note }) {
    return (
        <div className="card image-card" onClick={() => onEditNoteClick(note)}>
            <Dropdown onDeleteNoteClick={onDeleteNoteClick} onEditNoteClick={onEditNoteClick} note={note}></Dropdown>
            <img className="note-img" src={note.info.url} />
            {note.info.title && (
                <h2 className="note-title">{note.info.title}</h2>
            )}
            <div className="card-navbar">
                <button className="fa fa-trash delete-btn" onClick={(ev) => onDeleteNoteClick(ev, note.id)}></button>
            </div>
        </div>
    )
}
