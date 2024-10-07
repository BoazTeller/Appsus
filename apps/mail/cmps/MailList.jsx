{/* <MailList>
• Renders a list of <MailPreview> pass down a mail prop */}

import { MailPreview } from "./MailPreview.jsx"

const { Link } = ReactRouterDOM

export function MailList({ mails, onToggleStarred, folder, isLoading }) {

    return (
        <ul className="mail-list clean-list">
            {isLoading && (
                <span className="loader1"></span>
            )}

            {!isLoading && (!mails || mails.length === 0) && (
                <p className="empty-folder-msg">No mails in {folder} folder.</p>
            )}

            {!isLoading && mails && mails.length > 0 && (
                mails.map(mail => (
                    <li key={mail.id}>
                        <Link to={`/mail/${mail.id}`}>
                            <MailPreview 
                                mail={mail}
                                onToggleStarred={onToggleStarred}
                            />
                        </Link>
                    </li>
                ))
            )}
        </ul>
    )
}
