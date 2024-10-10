export function InitialInput({ onOpenInput }) {

    return (
        <div className="inputs-grid">
            <div className="input-container">
                <input type="text"
                    placeholder="Whats on your mind..."
                    className="main-input"
                    disabled
                />
                <div className="icons">
                    <button className="fa-regular fa-image icon" onClick={() => onOpenInput('NoteImg')} />
                    <button className="fa-regular fa-comment icon" onClick={() => onOpenInput('NoteTxt')} />
                    <button className="fa fa-check-square icon" onClick={() => onOpenInput('NoteTodos')} />
                </div>
            </div>
        </div>
    )
}