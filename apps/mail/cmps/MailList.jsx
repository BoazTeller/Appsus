const { Link } = ReactRouterDOM

import { MailSort } from "./MailSort.jsx"
import { MailPreview } from "./MailPreview.jsx"

export function MailList({
    mails, filterBy, sortBy, folder, isLoading,
    onRemoveMail, onToggleStarred, onSetFilterBy, onSetSortBy
}) {

    return (
        <React.Fragment>
            <MailSort 
                onSetSortBy={onSetSortBy}
                sortBy={sortBy} 
                onSetFilterBy={onSetFilterBy} 
                filterBy={filterBy} 
            />

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
                                    onRemoveMail={onRemoveMail}
                                    onToggleStarred={onToggleStarred}
                                />
                            </Link>
                        </li>
                    ))
                )}
            </ul>
        </React.Fragment>
    )
}