
import { Dropdown } from "./Dropdown.jsx"

export function NoteImg({ onDeleteNoteClick, onEditNoteClick, note }) {
    return (
        <div className="card image-card" onClick={() => onEditNoteClick(note)}>
            <Dropdown onDeleteNoteClick={onDeleteNoteClick} onEditNoteClick={onEditNoteClick} note={note}></Dropdown>
            <h2>{note.info.title}</h2>
            <img className="note-img" src={note.info.url} />
            <div className="card-navbar">
                <button className="fa fa-trash delete-btn" onClick={(ev) => onDeleteNoteClick(ev, note.id)}></button>

            </div>
        </div>
    )
}
