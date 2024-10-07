import { DynamicComponent } from "./DynamicComponent.jsx"


export function NoteList({ onRemoveNote, notes, onEditNote}) {

    return <div className="note-list">{notes.map(note =>
        <DynamicComponent onRemoveNote={onRemoveNote} note={note} onEditNote={onEditNote}></DynamicComponent>
    )}
    </div>
}
