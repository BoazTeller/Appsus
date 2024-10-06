export function TextInput({ handleInput, onSubmitForm, newNote }) {
    return (
        <div className="inputs-grid">
            <form action="submit" onSubmit={onSubmitForm}>
                <div className="inputs-grid">
                    <input type="text" placeholder="Title" name="title" value={newNote.info.title} className="main-input title-input" onInput={handleInput}></input>
                    <input type="text" name="txt" placeholder="New Note" value={newNote.info.txt} className="main-input new-note-input" onInput={handleInput}></input>
                    <button className="submit-btn">Add</button>
                </div>
            </form>
        </div>
    )
}