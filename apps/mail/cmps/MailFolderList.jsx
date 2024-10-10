const { useState, useEffect } = React

export function MailFolderList({ onSetFilterBy, filterBy, mailCount, onOpenMailEdit }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])
   
    function handleFilter(value) {
        setFilterByToEdit(prevFilter => ({...prevFilter, folder: value }))
    }
    
    const folders = [
        { key: 'inbox', icon: 'inbox', label: 'Inbox', count: mailCount.unreadCount },
        { key: 'starred', icon: 'star', label: 'Starred' },
        { key: 'sent', icon: 'send', label: 'Sent' },
        { key: 'drafts', icon: 'draft', label: 'Drafts', count: mailCount.draftsCount },
        { key: 'trash', icon: 'delete', label: 'Trash' }
    ]    

    const { folder } = filterByToEdit 
    return (
        <section className="folder-list">
            <div className="btn-compose-container">
                <button onClick={() => onOpenMailEdit()} className="btn-compose">
                    <div className="materials">edit</div>
                    <span className="label">Compose</span>
                </button>
            </div>

            {folders.map(folderItem => (
                <button 
                    key={folderItem.key}
                    className={`btn-${folderItem.key} btn-folder ${folder === folderItem.key ? 'active' : ''}`}
                    onClick={() => handleFilter(folderItem.key)}
                >
                    <div className={`materials`}>{folderItem.icon}</div>
                    <span className="label">{folderItem.label}</span>
                    {folderItem.count !== undefined && <span className="unread">{folderItem.count || ''}</span>}
                </button>
            ))}
        </section>
    )
}