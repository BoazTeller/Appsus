import { DynamicComponent } from "./DynamicComponent.jsx"


export function NoteList({ onRemoveNote, notes, onEditNote, onEditBackgroundColor }) {
    return <div className="note-list">{notes.map(note =>
        <DynamicComponent
            key={note.id}
            onRemoveNote={onRemoveNote}
            note={note}
            onEditNote={onEditNote}
            onEditBackgroundColor={onEditBackgroundColor}
        ></DynamicComponent>
    )}
    </div>
}
