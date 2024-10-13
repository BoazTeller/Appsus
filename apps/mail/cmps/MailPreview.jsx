const { useState } = React
const { useSearchParams } = ReactRouterDOM

import { mailService } from "../services/mail.service.js"
import { utilService } from "../../../services/util.service.js"

export function MailPreview({ mail, onRemoveMail, onToggleStarred, onToggleRead }) {
    const [searchParams] = useSearchParams()

    const [isHovered, setIsHovered] = useState(false)

    function onStarClick(ev) {
        // Prevent navigating to MailDetails when CTE button is clicked
        ev.stopPropagation()
        onToggleStarred(mail)
    }

    function onReadClick(ev) {
        ev.stopPropagation()
        onToggleRead(mail)
    }

    function onRemoveClick(ev) {
        ev.stopPropagation()
        onRemoveMail(mail)
    }

    function onSaveAsNoteClick(ev) {
        ev.stopPropagation()
    }

    function getToOrFromDetails() {
        const { email: userMail } = mailService.getLoggedInUser()
        const folder = searchParams.get('folder')

        if (folder === 'drafts') return 'Draft'
        if (folder === 'sent') {
            return mail.to === userMail ? 'To: me' : `To: ${mail.to}`
        }
        return mail.from
    }

    function displayDateOrHoveredBtns() {
        if (isHovered) {
            return (
                <div className="actions-container flex align-center">
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
            )
        }
    
        // If not hovered then return formatted date or nothing (for drafts that haven't been sent yet)
        return (
            <span className="mail-sent-at">
                {mail.sentAt ? utilService.getFormattedDate(mail.sentAt) : ''}
            </span>
        )
    }
    
    const starClass = mail.isStarred ? 'faSolid yellow-star starred' : 'faRegular star'
    const readClass = !mail.isRead ? 'is-read' : 'un-read'

    return (
        <article 
            className={`mail-preview ${readClass}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        
        >
            {/* Mark as Starred btn */}
            <button 
                className={`btn-star ${starClass}`} 
                onClick={onStarClick}
                title={mail.isStarred ? 'Starred' : 'Unstarred'}
            ></button>

            {/* Mail from: show 'To:' for sent mails, sender address for received mails and 'Draft' for unsent mails */}
            <span className={`mail-from ${!mail.sentAt ? 'draft': ''}`}>
                {getToOrFromDetails()}
            </span>

            {/* Main mail content: Subject and a preview of the body */}
            <section className="mail-content flex">
                <p className="mail-subject">
                    {mail.subject || '(no subject)'}
                </p>

                {mail.body && (
                    <p className="mail-body">{'- '}{mail.body}</p>
                )}
            </section>

            {/* When not hovered: display sent at date or nothing at all for drafts
            When hovered: display CTE buttons */}
            {displayDateOrHoveredBtns()}
        </article>
    )
}