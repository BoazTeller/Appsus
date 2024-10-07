export function ImgInput({ handleInput, newNote, onSubmitForm, isEditing }) {
    return (
        <div className="inputs-grid">
            <form action="submit" onSubmit={onSubmitForm}>
                <div className="inputs-grid">
                    <input type="text" placeholder="Title" name="title" value={newNote.info.title} className="main-input title-input" onInput={handleInput}></input>
                    <input type="url" name="url" placeholder="Image URL:" value={newNote.info.url} className="main-input new-note-input" onInput={handleInput}></input>
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
