import { NoteInput } from "../cmps/NoteInput.jsx"
import {noteService} from "../services/note-service.js"

const {useState, useEffect,useRef} = React

export function NoteIndex() {

    const [notes,setNotes] = useState()
    const [isInputOpen, setIsOpen] = useState(false)
    const [inputType,setInputType] = useState(null)

    function onOpenInput(type){
        setIsOpen(!isInputOpen) //chancing the isOpen to its negative value
        setInputType(type)
    }

    function onAddNote(newNote){
        console.log('new note in note-index', newNote)
        noteService.post(newNote)
    }

    return (
        <section className="notes-section">
            <div className="input-section">
                <NoteInput isInputOpen={isInputOpen} inputType={inputType} setIsOpen={setIsOpen} onOpenInput={onOpenInput} onAddNote={onAddNote}/>
            </div>
        </section>
    )
}
