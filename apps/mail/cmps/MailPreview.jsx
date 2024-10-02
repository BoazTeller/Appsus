{/* <MailPreview>
• Present a mail preview
• Renders the subject (with text size limit)
• Gives visual indication for read/unread
• Support hover state */}

export function MailPreview({ mail }) {
    return (
        <tr className={`mail-preview ${mail.unread ? 'unread' : ''}`}>
          <td className="star-cell">
            <div className="star-toggle">
              <img src={mail.starred ? 'images/star-on.svg' : 'images/star-off.svg'} alt="" />
            </div>
          </td>
          
          <td className="importance-cell">
            <div className="importance-toggle">
              <img src={mail.important ? 'images/importance-on.svg' : 'images/importance-off.svg'} alt="" />
            </div>
          </td>
          
          <td className="sender-cell">
            <span className="mail-sender">{mail.sender}</span>
          </td>
          
          <td className="subject-cell">
            <span className="mail-subject">{mail.subject}</span>
          </td>
          
          <td className="snippet-cell">
            <span className="mail-snippet">{mail.snippet}</span>
          </td>
          
          <td className="date-cell">
            <span className="mail-date">{mail.date}</span>
          </td>
          
          <td className="actions-cell">
            <div className="mail-actions">
              <button className="action-archive"><img src="images/archive.svg" alt="Archive" /></button>
              <button className="action-delete"><img src="images/delete.svg" alt="Delete" /></button>
              <button className="action-read"><img src="images/mark-as-read.svg" alt="Read" /></button>
              <button className="action-snooze"><img src="images/snooze.svg" alt="Snooze" /></button>
            </div>
          </td>
        </tr>
    )  
}