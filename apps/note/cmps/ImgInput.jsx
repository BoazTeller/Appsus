export function ImgInput({ handleInput, newNote, onSubmitForm, isEditing }) {
    return (
        <div className="inputs-grid">
            <form action="submit" onSubmit={onSubmitForm}>
                <div className="inputs-grid">
                    <div className="input-container" style={{ backgroundColor: newNote.style.backgroundColor }}>
                        <input type="text" style={{ backgroundColor: newNote.style.backgroundColor }} placeholder="Title" name="title" value={newNote.info.title} className="main-input title-input" onInput={handleInput}></input>
                        <input type="url" style={{ backgroundColor: newNote.style.backgroundColor }} name="url" placeholder="Image URL:" value={newNote.info.url} className="main-input new-note-input" onInput={handleInput}></input>
                    </div>
                    {isEditing ? (
                        <button className="submit-btn">Save</button>
                    ) : (
                        <button className="submit-btn">Add</button>
                    )}
                </div>
            </form>
        </div>
    )
}
