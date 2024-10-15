const { useNavigate } = ReactRouterDOM

export function MailDetailsActionBar({ 
    mail, onRemoveMail, onToggleRead, onToggleStarred, onSaveAsNote
 }) {
    const navigate = useNavigate()

    function onGoBackClick() {
        navigate('/mail')
    }
    
    // function onStarClick() {
    //     onToggleStarred(mail)
    // }

    function onReadClick() {
        onToggleRead(mail)
    }

    function onRemoveClick() {
        onRemoveMail(mail)
    }

    function onSaveAsNoteClick() {
        onSaveAsNote(mail)
    }

    function onPrevMailClick() {

    }

    function onNextMailClick() {

    }

    return (
        <div className="actions-container flex align-center">
            {/* Go back to mail list */}
            <button 
                className="btn-go-back" 
                onClick={onGoBackClick}
                title="Go back">
                <span className="material-symbols-outlined">arrow_back</span>
            </button>

            <div className="mail-cte-btns">
                {/* Remove mail hover button */}
                 <button 
                    className="btn-delete" 
                    onClick={onRemoveClick}
                    title="Delete">
                    <span className="material-symbols-outlined">delete</span>
                </button>

                {/* Read mail hover button */}
                {!mail.isRead && (
                    <button 
                        className="btn-read" 
                        onClick={onReadClick}
                        title="Mark as read">
                        <span className="material-symbols-outlined">drafts</span>
                    </button>
                )}

                {/* Unread mail hover button */}
                {mail.isRead && (
                    <button 
                        className="btn-unread" 
                        onClick={onReadClick}
                        title="Mark as unread">
                        <span className="material-symbols-outlined">mark_email_unread</span>
                    </button>
                )}

                {/* Save as Note button */}
                <button 
                    className="btn-save-note" 
                    onClick={onSaveAsNoteClick}
                    title="Save as note">
                    <span className="material-symbols-outlined">note_add</span>
                </button>
            </div>
       

            <section className="pagination-btns">
                {/* Navigate to previous mail */}
                <button 
                    className="btn-prev-mail" 
                    onClick={onPrevMailClick}
                    title="Previous mail">
                    <span className="material-symbols-outlined">navigate_before</span>
                </button>

                {/* Navigate to next mail */}
                <button 
                    className="btn-next-mail" 
                    onClick={onNextMailClick}
                    title="Next mail">
                    <span className="material-symbols-outlined">navigate_next</span>
                </button>
            </section>
        </div>
    )
}