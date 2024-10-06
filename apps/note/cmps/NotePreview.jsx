// This component renders the <NotePreview> component that allow viewing the notes
// preview, and also changing color, pin, etc.

// The <NotePreview> component, uses a dynamic component to show different types
// of notes:
//      o <NoteTxt>
//      o <NoteImg>
//      o <NoteVideo>
//      o <NoteTodos>

// • Extra:
//      o <NoteAudio>
//      o <NoteCanvas>
//      o <NoteMap>

// • Bonus:
//      o <NoteRecording>

export function NotePreview({ note, onRemoveNote }) {
    const { type } = note
    switch (type) {
        case 'NoteTxt':
            renderLog(note)
            return <NoteTxt onDeleteNoteClick={onDeleteNoteClick} onEditNoteClick={onEditNoteClick} note={note} />
        case 'NoteImg':
            renderLog(note)
            return <NoteImg onDeleteNoteClick={onDeleteNoteClick} onEditNoteClick={onEditNoteClick} note={note} />
    }

    function onEditNoteClick(noteId) {
        console.log(noteId)
    }

    function onDeleteNoteClick(noteId) {
        onRemoveNote(noteId)
    }
}


function NoteTxt({ onDeleteNoteClick, onEditNoteClick, note }) {
    return (
        <div className="card txt-card">
            <Dropdown onDeleteNoteClick={onDeleteNoteClick} onEditNoteClick={onEditNoteClick} noteId={note.id}></Dropdown>
            <h2 className="note-title">{note.info.title}</h2>
            <p className="note-txt">{note.info.txt}</p>
        </div>
    );
}

function NoteImg({ onDeleteNoteClick, onEditNoteClick, note }) {
    return (
        <div className="card image-card">
            <Dropdown onDeleteNoteClick={onDeleteNoteClick} noteId={note.id}></Dropdown>
            <h2><span className="note-label">Title:</span>{note.info.title}</h2>
            <img className="note-img" src={note.info.url} />
        </div>
    )
}

function renderLog(note) {
    console.log(`DEBUG: rendring ${note.type} note with id ${note.id}`)
}

function Dropdown({ onDeleteNoteClick, onEditNoteClick, noteId }) {
    return (
        <div className="more-options">
            <button className="three-dots">⋮</button>
            <div className="dropdown">
                <button className="edit-btn" onClick={() => onEditNoteClick(noteId)}>Edit</button>
                <button className="delete-btn" onClick={() => onDeleteNoteClick(noteId)}>Delete</button>
            </div>
        </div>
    )
}