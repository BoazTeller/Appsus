const { useState, useEffect} = React
import { noteService } from "../services/note-service.js"
import { ImgInput } from "./ImgInput.jsx"
import { InitialInput } from "./InitialInput.jsx"
import { TextInput } from "./TextInput.jsx"
import {TodosInput} from "./TodosInput.jsx"

export function NoteInput({ isInputOpen, inputType, setIsOpen, onOpenInput, onAddNote, isEditing, noteToEdit, onUpdateNote }) {

    const [newNote, setNewNote] = useState(noteService._getEmptyNote(inputType))


    useEffect(()=>{
        if(noteToEdit){
            setNewNote(noteToEdit)
        }
        else if(inputType){
            setNewNote(noteService._getEmptyNote(inputType))
        }
    },[noteToEdit,inputType])

    function onSubmitForm(ev) {
        console.log('newNote', newNote)
        ev.preventDefault()
        isEditing ? onUpdateNote(newNote) : onAddNote(newNote)
        setNewNote(noteService._getEmptyNote(inputType))
        setIsOpen(false)
    }

    function handleInput({ target }) {
        const field = target.name
        const value = target.value
        setNewNote(prevNewNote => ({
            ...prevNewNote,
            createdAt: new Date().toISOString(),
            info: { ...prevNewNote.info, [field]: value }
        }))
    }

    if (!isInputOpen || !inputType) return (
        <InitialInput onOpenInput={onOpenInput}/>
    )
    else if(newNote && newNote.type === 'NoteTxt') return (
        <TextInput handleInput={handleInput} onSubmitForm={onSubmitForm} newNote={newNote} isEditing={isEditing}/>
    )
    else if (newNote && newNote.type === 'NoteImg') return (
        <ImgInput handleInput={handleInput} newNote={newNote} onSubmitForm={onSubmitForm} isEditing={isEditing}></ImgInput>
    )
    else if (newNote && newNote.type === 'NoteTodos') return (
        <TodosInput handleInput={handleInput} newNote={newNote} onSubmitForm={onSubmitForm} isEditing={isEditing}></TodosInput>
    )
    else return(
        <div>loading. . . .</div>
    )
}
