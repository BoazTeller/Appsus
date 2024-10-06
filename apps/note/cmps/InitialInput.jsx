export function InitialInput({ onOpenInput }) {

    return (
        <div className="inputs-grid">
            <input type="text"
                placeholder="Whats on your mind..."
                className="main-input"
                disabled
            />
            <div className="icons">
                <button className="fa-regular fa-image icon" onClick={() => onOpenInput('NoteImg')} />
                <button className="fa-regular fa-comment icon" onClick={() => onOpenInput('NoteTxt')} />
            </div>
        </div>
    )
}