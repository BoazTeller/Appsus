import { NotePreview } from "../cmps/NotePreview.jsx"


export function NoteList({ onRemoveNote, notes }) {
    console.log('notes inlist ' ,notes)
    return <div className="note-list">{notes.map(note =>
        <NotePreview onRemoveNote={onRemoveNote} note={note}></NotePreview>
    )}
    </div>
}
