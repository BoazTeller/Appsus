export function Dropdown({ onDeleteNoteClick, onEditNoteClick, note }) {
    return (
        <div className="more-options" >
             {/* <button className="delete-btn" onClick={() => onDeleteNoteClick(note.id)}>X</button> */}
            {/* <button className="three-dots">⋮</button>
            <div className="dropdown">
                <button className="edit-btn" onClick={() => onEditNoteClick(note)}>Edit</button>
            </div> */}
        </div>
    )
}