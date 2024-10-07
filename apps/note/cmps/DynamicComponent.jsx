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

import { NoteImg } from "./NoteImg.jsx"
import {NoteTxt} from "./NoteTxt.jsx"

export function DynamicComponent({ note, onRemoveNote, onEditNote }) {
    const { type } = note
    switch (type) {
        case 'NoteTxt':
            renderLog(note)
            return <NoteTxt onDeleteNoteClick={onDeleteNoteClick} onEditNoteClick={onEditNoteClick} note={note} />
        case 'NoteImg':
            renderLog(note)
            return <NoteImg onDeleteNoteClick={onDeleteNoteClick} onEditNoteClick={onEditNoteClick} note={note} />
    }

    function onEditNoteClick(note) {
        onEditNote(note)
    }

    function onDeleteNoteClick(ev, noteId) {
        ev.stopPropagation()
        onRemoveNote(noteId)
    }
}

function renderLog(note) {
    console.log(`DEBUG: rendring ${note.type} note with id ${note.id}`)
}
