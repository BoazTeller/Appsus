import { NoteImg } from "./NoteImg.jsx"
import { NoteTxt } from "./NoteTxt.jsx"
import { NoteTodos } from "./NoteTodos.jsx"

const { useState } = React

export function DynamicComponent({ note, setIsPinned, onRemoveNote, onEditNote, onEditBackgroundColor, setIsTodoDone }) {

    const [isPaletteOpen, setIsPaletteOpen] = useState(false)
    const { type } = note

    function onEditNoteClick(note) {
        onEditNote(note)
    }

    function onPinClick(ev, noteId) {
        ev.stopPropagation()
        setIsPinned(noteId)
    }

    function onDeleteNoteClick(ev, noteId) {
        ev.stopPropagation()
        onRemoveNote(noteId)
    }

    function onPaletteClick(ev) {
        setIsPaletteOpen(!isPaletteOpen)
        ev.stopPropagation()
    }

    function onCheckboxClick(ev, todoId, noteId) {
        ev.stopPropagation()
        setIsTodoDone(todoId, noteId)
    }

    const sharedProps = {
        note,
        onDeleteNoteClick,
        onEditNoteClick,
        onPaletteClick,
        isPaletteOpen,
        onEditBackgroundColor,
        setIsPaletteOpen,
        setIsPinned,
        onPinClick
    }

    switch (type) {
        case 'NoteTxt':
            return (
                <NoteTxt {...sharedProps}/>
            )
        case 'NoteImg':
            return (
                <NoteImg {...sharedProps}/>
            )
        case 'NoteTodos':
            return (
                <NoteTodos {...sharedProps} onCheckboxClick={onCheckboxClick}/>
            )

        default:
            return null
    }
}