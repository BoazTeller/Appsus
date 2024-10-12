const { useState, useEffect } = React
const { useNavigate } = ReactRouterDOM

import { MailComposeButton } from "./MailComposeButton.jsx" 
import { MailFolderItem } from "./MailFolderItem.jsx"

export function MailFolderList({ onSetFilterBy, filterBy, mailCount, onOpenMailEdit }) {
    const navigate = useNavigate()

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])
   
    function handleFilter(value) {
        setFilterByToEdit(prevFilter => ({...prevFilter, folder: value }))
        navigate('/mail')
    }
    
    const { unreadCount, draftsCount } = mailCount
    const folders = [
        { key: 'inbox', icon: 'inbox', label: 'Inbox', count: unreadCount },
        { key: 'starred', icon: 'star', label: 'Starred' },
        { key: 'sent', icon: 'send', label: 'Sent' },
        { key: 'drafts', icon: 'draft', label: 'Drafts', count: draftsCount },
        { key: 'trash', icon: 'delete', label: 'Trash' }
    ]    

    const { folder: currFolder } = filterByToEdit 
    return (
        <section className="folder-list">
            <MailComposeButton onOpenMailEdit={onOpenMailEdit} />

            {folders.map(folderItem => (
                <MailFolderItem 
                    key={folderItem.key}
                    folderItem={folderItem}
                    handleFilter={handleFilter}
                    currFolder={currFolder}
                />
            ))}
        </section>
    )
}