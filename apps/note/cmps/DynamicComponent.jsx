import { NoteImg } from "./NoteImg.jsx"
import { NoteTxt } from "./NoteTxt.jsx"
import { NoteTodos } from "./NoteTodos.jsx"

const { useState } = React

export function DynamicComponent({ note, setIsPinned, onRemoveNote, onEditNote, onEditBackgroundColor,setIsTodoDone }) {

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
        case 'NoteTodos':
            return (
                <NoteTodos
                    onDeleteNoteClick={onDeleteNoteClick}
                    onEditNoteClick={onEditNoteClick}
                    note={note}
                    onPaletteClick={onPaletteClick}
                    isPaletteOpen={isPaletteOpen}
                    onEditBackgroundColor={onEditBackgroundColor}
                    setIsPaletteOpen={setIsPaletteOpen}
                    setIsPinned={setIsPinned}
                    onPinClick={onPinClick}
                    onCheckboxClick={onCheckboxClick}
                />
            )

        default:
            return null
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

    function onCheckboxClick(ev, todoId, noteId){
        ev.stopPropagation()
        setIsTodoDone(todoId, noteId)
    }
}