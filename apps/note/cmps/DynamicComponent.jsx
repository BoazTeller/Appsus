import { NoteImg } from "./NoteImg.jsx"
import { NoteTxt } from "./NoteTxt.jsx"

const { useState } = React

export function DynamicComponent({ note, setIsPinned, onRemoveNote, onEditNote, onEditBackgroundColor }) {

    const [isPaletteOpen, setIsPaletteOpen] = useState(false)

    const { type } = note
    switch (type) {
        case 'NoteTxt':
            return (
                <NoteTxt
                    onDeleteNoteClick={onDeleteNoteClick}
                    onEditNoteClick={onEditNoteClick}
                    note={note}
                    onPaletteClick={onPaletteClick}
                    isPaletteOpen={isPaletteOpen}
                    onEditBackgroundColor={onEditBackgroundColor}
                    setIsPaletteOpen={setIsPaletteOpen}
                    setIsPinned={setIsPinned}
                    onPinClick={onPinClick}
                />
            )
        case 'NoteImg':
            return (
                <NoteImg
                    onDeleteNoteClick={onDeleteNoteClick}
                    onEditNoteClick={onEditNoteClick}
                    note={note}
                    onPaletteClick={onPaletteClick}
                    isPaletteOpen={isPaletteOpen}
                    onEditBackgroundColor={onEditBackgroundColor}
                    setIsPaletteOpen={setIsPaletteOpen}
                    setIsPinned={setIsPinned}
                    onPinClick={onPinClick}
                />
            )
        default:
            return null; // Handle cases where 'type' doesn't match 'NoteTxt' or 'NoteImg'
    }


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
}