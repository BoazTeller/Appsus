
import { Dropdown } from "./Dropdown.jsx"
import { PalleteColor } from "./PalleteColor.jsx"

export function NoteTodos({ onDeleteNoteClick, onEditNoteClick, note,onCloneNote, onPinClick, onPaletteClick, isPaletteOpen, onEditBackgroundColor,onSetIsPaletteOpen, setIsPaletteOpen,onCheckboxClick }) {
    return (
        <div className="card txt-card" style={{ backgroundColor: note.style.backgroundColor }} onClick={() => onEditNoteClick(note)}>
            {isPaletteOpen &&
                <React.Fragment>
                    <div className="overlay-palette" onClick={(ev) => onSetIsPaletteOpen(ev)}></div>
                    <PalleteColor
                        noteId={note.id}
                        onEditBackgroundColor={onEditBackgroundColor}
                        setIsPaletteOpen={setIsPaletteOpen}
                        isPaletteOpen={isPaletteOpen} />
                </React.Fragment>
            }
            <button className="fa fa-thumbtack" onClick={(ev) => onPinClick(ev, note.id)} />
            <h2 className="note-title">{note.info.title}</h2>
            <div className="todos">
                {note.info.todos.map(todo => {
                    return (
                        <div className="todo-item" key={todo.id}>
                            <p className="todo-txt" onClick={(ev) => onCheckboxClick(ev, todo.id, note.id)}>
                                <span className={todo.done ? "fa-solid fa-check-square" : "fa-regular fa-square"}></span>
                                {todo.txt}
                            </p>
                        </div>
                    )
                })}
            </div>


            <div className="card-navbar">
                <button className="fa fa-palette action-icon" onClick={(ev) => onPaletteClick(ev, note)}></button>
                <button className="fa fa-copy action-icon" onClick={(ev) => onCloneNote(ev,note)}></button>
                <button className="fa fa-trash delete-btn action-icon" onClick={(ev) => onDeleteNoteClick(ev, note.id)}></button>
            </div>
        </div>
    )
}