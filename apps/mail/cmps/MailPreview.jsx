{/* <MailPreview>
• Present a mail preview
• Renders the subject (with text size limit)
• Gives visual indication for read/unread
• Support hover state */}

import { utilService } from "../../../services/util.service.js"

export function MailPreview({ mail, onToggleStarred }) {
  
  function onStarClick(ev) {
    // preventDefault otherwise clicking star will enter MailDetails
    ev.preventDefault()
    // stop the ev from bubbling further
    ev.stopPropagation()
    onToggleStarred(mail)
  }

  const starClass = mail.isStarred ? 'solid yellow-star' : 'fa star'
  const readClass = mail.isRead ? 'is-read' : ''
  const formattedDate = mail.sentAt ? utilService.getFormattedDate(mail.sentAt) : ''

  return (
    <article className={`mail-preview ${readClass}`}>
        <div className={`star-icon ${starClass}`} onClick={onStarClick}></div>

        <div className="mail-content">
          <h3 className="mail-from">{mail.from}</h3>
          <h3 className="mail-subject">{mail.subject} <span className="mail-body">- {mail.body}</span></h3>
          <h3 className="mail-date">{formattedDate}</h3>
        </div>
    </article>
  )
}