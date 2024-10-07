{/* <MailFolderList>
• Allow filtering by different folders: inbox / sent / trash/ draft */}

const { useState, useEffect } = React
const { useNavigate } = ReactRouterDOM

export function MailFolderList({ onSetFilterBy, filterBy, unreadCount }) {

    const navigate = useNavigate()

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])
   
    function handleFilter(value) {
        setFilterByToEdit(prevFilter => ({...prevFilter, folder: value }))
        navigate('/mail')
    }

    return (
        <div className="sidebar">
            <button className="compose-btn">Compose</button>
            <ul className="menu">
                <li className="menu-item active" onClick={() => handleFilter('inbox')}><span>Inbox</span><span className="unread-count">{unreadCount || ''}</span></li>
                <li className="menu-item" onClick={() => handleFilter('starred')}><span>Starred</span></li>
                <li className="menu-item" onClick={() => handleFilter('sent')}><span>Sent</span></li>
                <li className="menu-item" onClick={() => handleFilter('drafts')}><span>Drafts</span></li>
                <li className="menu-item" onClick={() => handleFilter('trash')}><span>Trash</span></li>
            </ul>
        </div>
    )
}
