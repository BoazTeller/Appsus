import { NotePreview } from "../cmps/NotePreview.jsx"


export function NoteList({ onRemoveNote, notes, onEditNote}) {

    return <div className="note-list">{notes.map(note =>
        <NotePreview onRemoveNote={onRemoveNote} note={note} onEditNote={onEditNote}></NotePreview>
    )}
    </div>
}
