import { NoteInput } from "../cmps/NoteInput.jsx"
import { NoteList } from "../cmps/NoteList.jsx"
import { noteService } from "../services/note-service.js"
import { NotePreview } from "../cmps/NotePreview.jsx"

const { useState, useEffect, useRef } = React

export function NoteIndex() {

    const [notes, setNotes] = useState([])
    const [isInputOpen, setIsOpen] = useState(false)
    const [inputType, setInputType] = useState(null)
    const [newNote, setNewNote] = useState({})

    useEffect(() => {
        noteService.query().then(notes => setNotes(notes))
    }, [])

    function onOpenInput(type, noteToEdit = null) {
        setIsOpen(!isInputOpen) //chancing the isOpen to its negative value
        setInputType(type)
        if (noteToEdit) setNewNote(noteToEdit)
        else setNewNote(noteService._getEmptyNote(type))
    }

    function onRemoveNote(noteId) {
        noteService.remove(noteId)
            .then(newNotes => {
                console.log(newNotes)
                setNotes(newNotes)
            })
    }

    function onAddNote(newNote) {
        console.log('new note in note-index', newNote)
        noteService.post(newNote).then(savedNote => {
            setNotes(prevNotes => [...prevNotes, savedNote])
        })
    }

    return (
        <section className="notes-section">
            <div className="input-section">
                <NoteInput isInputOpen={isInputOpen}
                    inputType={inputType}
                    setIsOpen={setIsOpen}
                    onOpenInput={onOpenInput}
                    onAddNote={onAddNote} />
            </div>
            <div className="notes-container">
                <NoteList onRemoveNote={onRemoveNote} notes={notes}></NoteList>
            </div>
        </section>
    )
}
