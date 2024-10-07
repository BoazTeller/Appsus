import { NoteInput } from "../cmps/NoteInput.jsx"
import { NoteList } from "../cmps/NoteList.jsx"
import { noteService } from "../services/note-service.js"
import { NotePreview } from "../cmps/NotePreview.jsx"
import { NoteEdit } from "../cmps/NoteEdit.jsx"

const { useState, useEffect, useRef } = React

export function NoteIndex() {

    const [notes, setNotes] = useState([])
    const [isInputOpen, setIsOpen] = useState(false)
    const [inputType, setInputType] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [noteToEdit, setNoteToEdit] = useState(null)

    useEffect(() => {
        noteService.query().then(notes => setNotes(notes))
    }, [])

    function onOpenInput(type) {
        setIsOpen(true) //chancing the isOpen to its negative value
        setInputType(type)
    }

    function onRemoveNote(noteId) {
        noteService.remove(noteId)
            .then(newNotes => {
                console.log(newNotes)
                setNotes(newNotes)
            })
    }

    function onEditNote(note) {
        onOpenInput(note.type)
        setNoteToEdit(note)
        setIsEditing(true)
    }

    function onUpdateNote(newNote){
        console.log(newNote)
        noteService.put(newNote).then(savedNote =>{
            setNotes(prevNotes => prevNotes.map(note => note.id === savedNote.id ? savedNote : note ))
            setIsEditing(false)
            setIsOpen(false)
            setNoteToEdit(null)
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
                    onAddNote={onAddNote}

                    isEditing={isEditing}
                    noteToEdit={noteToEdit}
                    onUpdateNote={onUpdateNote}
                />
            </div>
            <div className="notes-container">
                <NoteList onRemoveNote={onRemoveNote} notes={notes} onEditNote={onEditNote}></NoteList>
            </div>
        </section>
    )
}
