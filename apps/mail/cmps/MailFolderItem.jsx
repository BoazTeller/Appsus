export function MailFolderItem(props) {
    const { folderItem, handleFilter, currFolder } = props

    return (
        <button 
            key={folderItem.key}
            className={`btn-${folderItem.key} btn-folder ${currFolder === folderItem.key ? 'active' : ''}`}
            onClick={() => handleFilter(folderItem.key)}
            title={folderItem.label}
        >
            <div className={`materials`}>{folderItem.icon}</div>
            <span className="label">{folderItem.label}</span>
            {folderItem.count !== undefined && <span className="unread">{folderItem.count || ''}</span>}
        </button>
    )
}