export function TextInput({ handleInput, onSubmitForm, newNote, isEditing }) {
    return (
        <div className="inputs-grid">
            <form action="submit" onSubmit={onSubmitForm}>
                <div className="inputs-grid">
                    <div className="input-container" style={{ backgroundColor: newNote.style.backgroundColor }}>
                        <input type="text" style={{ backgroundColor: newNote.style.backgroundColor }} placeholder="Title" name="title" value={newNote.info.title} className="main-input title-input" onInput={handleInput}></input>
                        <input type="text" style={{ backgroundColor: newNote.style.backgroundColor }} name="txt" placeholder="New Note" value={newNote.info.txt} className="main-input new-note-input" onInput={handleInput}></input>
                    </div>
                    {isEditing ? (
                        <button className="submit-btn">Save</button>
                    ) : (
                        <React.Fragment>
                            <button className="submit-btn">Add</button>
                        </React.Fragment>
                    )}
                </div>
            </form>
        </div>

    )
}