import { NoteInput } from "../cmps/NoteInput.jsx"
import { NoteList } from "../cmps/NoteList.jsx"
import { Logo } from "../cmps/Logo.jsx"
import { NoteFilter } from "../cmps/NoteFilter.jsx"
import { Navbar } from "../cmps/Navbar.jsx"
import { CanvasDrawing } from "../cmps/CanvasDrawing.jsx"

import { noteService } from "../services/note-service.js"

const { useState, useEffect } = React
const { useNavigate } = ReactRouter

export function NoteIndex() {

    const [notes, setNotes] = useState([])
    const [isInputOpen, setIsOpen] = useState(false)
    const [inputType, setInputType] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [noteToEdit, setNoteToEdit] = useState(null)
    const [isFilteredByType, setIsFilteredByType] = useState(false)
    const [isCanvasOpen, setIsCanvasOpen] = useState(false)
    const navigate = useNavigate()


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
        setNoteToEdit(note)
        if (note.isCanvas) {
            onOpenCanvas()
        } else {
            onOpenInput(note.type)
            setIsEditing(true)
        }
    }

    function onUpdateNote(newNote) {
        console.log(newNote)
        noteService.put(newNote).then(savedNote => {
            setNotes(prevNotes => prevNotes.map(note => note.id === savedNote.id ? savedNote : note))
            setIsEditing(false)
            setIsOpen(false)
            setNoteToEdit(null)
        })
    }

    function onOverlayClick() {
        setIsEditing(false)
        setIsOpen(false)
        setInputType(null)
        setNoteToEdit(null)
        console.log('overlkaytclick')
    }

    function onAddNote(newNote) {
        console.log('new note in note-index', newNote)
        noteService.post(newNote).then(savedNote => {
            setNotes(prevNotes => [...prevNotes, savedNote])
        })
    }

    function onEditBackgroundColor(noteId, backgroundColor) {
        console.log(`for note with id ${noteId} background color will change to ${backgroundColor}`)

        const noteToUpdate = notes.find(note => note.id === noteId)
        if (!noteToUpdate) {
            console.error('Note with id ' + noteId + 'can not be found')
            return
        }

        const noteBackup = structuredClone(noteToUpdate) //deep copy of noteToUpdate
        noteToUpdate.style.backgroundColor = backgroundColor
        setNotes(prevNotes => prevNotes.map(note => note.id === noteId ? noteToUpdate : note))

        noteService.put(noteToUpdate)
            .catch(err => {
                setNotes(prevNotes => prevNotes.map(note => note.id === noteBackup.id ? noteBackup : note))
                console.error('Error updating the note background color', err)

            })
    }

    function setIsPinned(noteId) {
        console.log(`setting note with id ${noteId} to pinned . . .`)
        const noteToUpdate = notes.find(note => note.id === noteId) //getting the note to update by its id
        const noteBackup = structuredClone(noteToUpdate) // cloning it without the change
        noteToUpdate.isPinned = !noteToUpdate.isPinned //changing the noteToUpdate
        setNotes(notes.map(note => note.id === noteId ? noteToUpdate : note)) //Update UI
        noteService.put(noteToUpdate) //updating db
            .catch(err => {
                console.error('Error updating todo:', err)
                setNotes(notes.map(note => note.id === noteId ? noteBackup : note)) //if the update to the db is not working, rendering the backup note
            })
    }


    function setIsTodoDone(todoId, noteId) {
        const noteToUpdate = notes.find(note => note.id === noteId)
        if (!noteToUpdate) return

        const noteBackup = structuredClone(noteToUpdate) //deep copy of noteToUpdate
        noteToUpdate.info.todos = noteToUpdate.info.todos.map(todo => {
            if (todo.id === todoId) {
                return { ...todo, done: !todo.done }
            }
            return todo
        })
        setNotes(notes.map(note => note.id === noteId ? noteToUpdate : note)) //update UI

        noteService.put(noteToUpdate)
            .catch(err => {
                console.error('Error updating todo:', err)
                setNotes(notes.map(note => note.id === noteId ? noteBackup : note))
            })
    }

    function filterByTxt(txtToFilter) {
        return noteService.query(txtToFilter)
            .then(notes => setNotes(notes))
    }

    function onFilterType(ev, noteType) {
        if (!noteType) {
            return noteService.query().then(notes => {
                setNotes(notes)
                setIsFilteredByType(false)
            })
        }
        setIsFilteredByType(true)
        ev.stopPropagation()
        console.log('filtering for type:', noteType)

        const filteredNotes = noteService.filterByType(noteType)
            .then(notes => setNotes(notes))
    }

    function onCloneNote(ev, note) {
        ev.stopPropagation()
        console.log('cloning note', note)
        const clonedNote = {
            ...note,
            id: ''
        }
        onAddNote(clonedNote)
    }

    function onOpenCanvas() {
        setIsCanvasOpen(true)
    }

    function onCloseCanvas() {
        setIsCanvasOpen(false)
        navigate("/note")
    }

    return (
        <React.Fragment>
            <section className="header-section">
                <Logo></Logo>
                <NoteFilter filterByTxt={filterByTxt}></NoteFilter>
            </section>
            {isCanvasOpen && (
                <CanvasDrawing onAddNote={onAddNote} noteToEdit={noteToEdit} onCloseCanvas={onCloseCanvas} onEditNote={onEditNote}></CanvasDrawing>
            )}
            {!isCanvasOpen && (
                <section className="notes-section">
                    <Navbar isFilteredByType={isFilteredByType} onFilterType={onFilterType}></Navbar>
                    {isEditing && <div className="overlay-edit" onClick={onOverlayClick}></div>}
                    {isInputOpen && <div className="overlay" onClick={onOverlayClick}></div>}
                    <div className="input-section">
                        <NoteInput isInputOpen={isInputOpen}
                            inputType={inputType}
                            setIsOpen={setIsOpen}
                            onOpenInput={onOpenInput}
                            onAddNote={onAddNote}
                            isEditing={isEditing}
                            noteToEdit={noteToEdit}
                            onUpdateNote={onUpdateNote}
                            onOpenCanvas={onOpenCanvas}
                        />
                    </div>
                    <div className="notes-container">
                        <NoteList onCloneNote={onCloneNote} onRemoveNote={onRemoveNote} setIsPinned={setIsPinned} notes={notes} onEditNote={onEditNote} onEditBackgroundColor={onEditBackgroundColor} setIsTodoDone={setIsTodoDone}></NoteList>
                    </div>
                </section>
            )}
        </React.Fragment>
    )
}
