const { useState, useEffect} = React
import { noteService } from "../services/note-service.js"
import { InitialInput } from "./InitialInput.jsx"
import { TextInput } from "./TextInput.jsx"

export function NoteInput({ isInputOpen, inputType, setIsOpen, onOpenInput, onAddNote }) {

    const [newNote, setNewNote] = useState(null)


    useEffect(()=>{
        if(inputType){
            const emptyNote = noteService._getEmptyNote(inputType)
            setNewNote(emptyNote)
        }
    },[inputType])


    function onSubmitForm(ev) {
        ev.preventDefault()
        onAddNote(newNote)
        setNewNote({ title: '', content: '' })
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
        <TextInput handleInput={handleInput} onSubmitForm={onSubmitForm} newNote={newNote}/>
    )
    else if (newNote && newNote.type === 'NoteImg'){
        
    }

    else {
        <div>loading. . . .</div>
    }
}
