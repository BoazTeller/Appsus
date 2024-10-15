export function MailFolderItem(props) {
    const { folderItem, handleFilter, currFolder, collapsedClass } = props

    // count of unread mails in inbox or drafts in drafts folder
    const isCount = folderItem.count !== undefined && folderItem.count > 0
    
    // class that will change the folder item background if active
    const activeClass = currFolder === folderItem.key ? 'active' : ''
    
    // class that will set a ::before to btn-folder displaying a red dot
    const unreadMarkClass = isCount && collapsedClass ? 'unread' : ''

    return (
        <button 
            key={folderItem.key}
            className={`btn-${folderItem.key} btn-folder ${activeClass} ${unreadMarkClass}`}
            onClick={() => handleFilter(folderItem.key)}
            title={folderItem.label}
        >
            {/* materials folder icon */}
            <div className={`materials`}>{folderItem.icon}</div>
            
            {/* folder name/label */}
            <span className="label">{folderItem.label}</span>
            
            {/* only render unread / drafts count */}
            {isCount &&  !collapsedClass &&
                    <span className="unread">{folderItem.count} </span>
            }
        </button>
    )
}