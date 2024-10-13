export function InitialInput({ onOpenInput, onOpenCanvas }) {

    return (
        <div className="inputs-grid">
            <div className="input-container">
                <input type="text"
                    placeholder="Whats on your mind..."
                    className="main-input"
                    onClick={onOpenInput}
                    disabled
                />
                <div className="icons">
                    <button className="fa-regular fa-image icon" onClick={() => onOpenInput('NoteImg')} />
                    <button className="fa-regular fa-comment icon" onClick={() => onOpenInput('NoteTxt')} />
                    <button className="fa-regular fa-check-square icon" onClick={() => onOpenInput('NoteTodos')} />
                    <button className="fa-solid fa-pen icon" onClick={onOpenCanvas}/>
                </div>
            </div>
        </div>
    )
}