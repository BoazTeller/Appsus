
import { Dropdown } from "./Dropdown.jsx"

export function NoteTxt({ onDeleteNoteClick, onEditNoteClick, note }) {
    return (
        <div className="card txt-card"  onClick={() => onEditNoteClick(note)}>
            <Dropdown onDeleteNoteClick={onDeleteNoteClick} onEditNoteClick={onEditNoteClick} note={note}></Dropdown>
            <h2 className="note-title">{note.info.title}</h2>
            <p className="note-txt">{note.info.txt}</p>
            <div className="card-navbar">
                <button className="fa fa-trash delete-btn" onClick={(ev) => onDeleteNoteClick(ev,note.id)}></button>
            </div>
        </div>
    )
}