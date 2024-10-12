export function MailComposeButton({ onOpenMailEdit }) {
    
    return (
        <div className="btn-compose-container">
            <button onClick={() => onOpenMailEdit()} className="btn-compose">
                <div className="materials">edit</div>
                <span className="label">Compose</span>
            </button>
        </div>
    )
}
