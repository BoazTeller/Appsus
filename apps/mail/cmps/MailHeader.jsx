import { MailFilterSearch } from "./MailFilterSearch.jsx"

export function MailHeader(props) {
    const { onToggleIsSidebarOpen } = props

    return (
        <section className="mail-header">
            <section className="logo-menu-container flex">
                <div 
                    className="ham-menu-btn flex" 
                    onClick={onToggleIsSidebarOpen}
                    title="Main menu">
                        <svg focusable="false" viewBox="0 0 24 24">
                            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
                        </svg>
                </div>

                <img src="assets/img/mail-logo.png" className="mail-logo" alt="Gmail Logo" title="Gmail"/>
            </section>

            <MailFilterSearch {...props} />
        </section>
    )
}