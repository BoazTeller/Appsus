const { useEffect, useRef, Fragment } = React
const { Link } = ReactRouterDOM

import { MailSort } from "./MailSort.jsx"
import { MailPreview } from "./MailPreview.jsx"
import { Loader } from "./Loader.jsx"

export function MailList({
    mails, filterBy, sortBy, folder, isLoading, onOpenMailEdit,
    onRemoveMail, onToggleStarred, onSetFilterBy, onSetSortBy
}) {

    const mailListRef = useRef(null)

    // useEffect(() => {
    //     if (mailListRef.current) {
    //         mailListRef.current.style.height = `calc(100vh - 181px)`;
    //     }
    // }, [mails]) 

    function getEmptyFolderMessage() {
        switch (folder) {
            case 'inbox':
                return 'Your inbox is empty.'
            case 'sent':
                return <Fragment>No sent messages! <a href="#" className="send-link" onClick={onOpenMailEdit}>Send</a> one now!</Fragment>
            case 'starred':
                return 'No starred messages. Stars let you give messages a special status to make them easier to find. ' + 
                       'To star a message, click on the star outline beside any message or conversation.'
            case 'trash':
                return 'No conversations in Trash folder.'
            case 'drafts':
                return 'You don\'t have any saved drafts.\n' +
                       'Saving a draft allows you to keep a message you aren\'t ready to send yet.'
            default:
                return `No mails in the ${folder} folder.`
        }
    }
    
    return (
        <Fragment>
            <MailSort 
                onSetSortBy={onSetSortBy}
                sortBy={sortBy} 
                onSetFilterBy={onSetFilterBy} 
                filterBy={filterBy} 
            />

            <ul className="mail-list clean-list" ref={mailListRef}>
                {isLoading && <Loader />}

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

                {!isLoading && (!mails || mails.length === 0) && (
                    <p className="empty-folder-msg">{getEmptyFolderMessage()}</p>
                )}
            </ul>
        </Fragment>
    )
}