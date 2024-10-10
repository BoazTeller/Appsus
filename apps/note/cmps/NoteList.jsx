import { DynamicComponent } from "./DynamicComponent.jsx"


export function NoteList({ onRemoveNote, setIsPinned, notes, onEditNote, onEditBackgroundColor,setIsTodoDone }) {
    const pinnedNotes = notes.filter(note => note.isPinned)
    const notPinnedNotes = notes.filter(note => !note.isPinned)

    return (
        <div className="note-list">
            {pinnedNotes.length > 0 && (
                <React.Fragment>
                    <div className="pinned-notes">
                        <h2 className="note-type-label">Pinned:</h2>
                        {renderNotes(pinnedNotes)}
                    </div>
                </React.Fragment>
            )}
            {notPinnedNotes.length > 0 && (
                <div className="unpinned-notes">
                    <h2 className="note-type-label">Other notes:</h2>
                    {renderNotes(notPinnedNotes)}
                </div>
            )}
        </div>
    )

    function renderNotes(notesArr) {
        return notesArr.map(note => {
            return (
                <DynamicComponent
                    key={note.id}
                    onRemoveNote={onRemoveNote}
                    note={note}
                    onEditNote={onEditNote}
                    onEditBackgroundColor={onEditBackgroundColor}
                    setIsPinned={setIsPinned}
                    setIsTodoDone={setIsTodoDone}
                />
            )
        })
    }
}