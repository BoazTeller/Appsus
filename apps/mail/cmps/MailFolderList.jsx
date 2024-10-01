{/* <MailFolderList>
• Allow filtering by different folders: inbox / sent / trash/ draft */}

export function MailFolderList() {

    return (
        <div class="sidebar">
            <button class="compose-btn">Compose</button>
            <ul class="menu">
                <li class="menu-item active"><span>Inbox</span></li>
                <li class="menu-item"><span>Starred</span></li>
                <li class="menu-item"><span>Sent</span></li>
                <li class="menu-item"><span>Drafts</span></li>
                <li class="menu-item"><span>Trash</span></li>
            </ul>
        </div>
    )
}
