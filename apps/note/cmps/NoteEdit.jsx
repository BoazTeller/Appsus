const { useState, useEffect } = React
export function NoteEdit({ noteToEdit }) {
    return (
        <div>{noteToEdit.id}</div>
    )
}

function EditNoteTxt(note) {
    return (
        <dialog>
            <form action="submit" onSubmit={onEditSubmit}>
                <input className="title-label-input" 
                value={note.info.title}
                name="note.info.title"
                type="note.info.type"
                onInput={handleInput}
                ></input>
                
            </form>
        </dialog>
    )
}