import { NoteInput } from "../cmps/NoteInput.jsx"
import { NoteList } from "../cmps/NoteList.jsx"
import { noteService } from "../services/note-service.js"

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

    function onUpdateNote(newNote) {
        console.log(newNote)
        noteService.put(newNote).then(savedNote => {
            setNotes(prevNotes => prevNotes.map(note => note.id === savedNote.id ? savedNote : note))
            setIsEditing(false)
            setIsOpen(false)
            setNoteToEdit(null)
        })
    }

    function onOverlayClick(){
        setIsEditing(false)
        setIsOpen(false)
        setInputType(null)
        setNoteToEdit(null)
    }

    function onAddNote(newNote) {
        console.log('new note in note-index', newNote)
        noteService.post(newNote).then(savedNote => {
            setNotes(prevNotes => [...prevNotes, savedNote])
        })
    }

    function onEditBackgroundColor(noteId, backgroundColor){
        console.log(`for note with id ${noteId} background color will change to ${backgroundColor}`)
        noteService.get(noteId)
        .then(note => {
            const updatedNote = {
                ...note,
                style: {
                    ...note.style,
                    backgroundColor: backgroundColor
                }
            }
            noteService.put(updatedNote).then(savedNote => {
                console.log('Note Updated successfully', savedNote)
                setNotes(prevNotes => prevNotes.map(note => note.id === savedNote.id? savedNote:note))
            })
        })
        .catch(err=>console.log(err))
    }

    function setIsPinned(noteId){
        console.log(`setting note with id ${noteId} to pinned . . .`)
        noteService.get(noteId)
        .then(note => {
            const updatedNote ={
                ...note,
                isPinned : !note.isPinned
            }
            noteService.put(updatedNote).then(savedNote => {
                console.log('Updated pinned note successuflly'+ savedNote.id)
                setNotes(prevNotes => prevNotes.map(note => note.id === savedNote.id ? savedNote: note))
            })
        })
    }

    function setIsTodoDone(todoId, noteId){
        console.log(`todo with id ${todoId} is done in ${noteId}`)
        noteService.get(noteId)
        .then(note => {
            const updatedTodos = note.info.todos.map(todo => { //getting updated todo with done:true
                if(todo.id === todoId){
                    return {...todo, done : !todo.done}
                }
                return todo
            })
            const updatedNote = { //getting the relevant note and updating todos in it
                ...note,
                info:{
                    ...note.info,
                    todos:updatedTodos
                }
            }
            console.log('the updated note is:',updatedNote)
            noteService.put(updatedNote).then(savedNote => {
                setNotes(prevNotes => prevNotes.map(note => note.id === savedNote.id ? savedNote : note))
            })
        })
        .catch(err => console.error('Error updating todo:', err))
    }

    return (
        <section className="notes-section">
            {isEditing && <div className="overlay" onClick={onOverlayClick}></div>}
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
                <NoteList onRemoveNote={onRemoveNote} setIsPinned={setIsPinned} notes={notes} onEditNote={onEditNote} onEditBackgroundColor={onEditBackgroundColor} setIsTodoDone={setIsTodoDone}></NoteList>
            </div>
        </section>
    )
}
