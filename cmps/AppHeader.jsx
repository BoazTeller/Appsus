const { Link } = ReactRouterDOM

import { AppHeaderNavLink } from "./AppHeaderNavLink.jsx"

export function AppHeader() {
    const navLinks = [
        { title: 'Home', path: '' },
        { title: 'About', path: 'about' },
        { title: 'Mail', path: 'mail' },
        { title: 'Note', path: 'note' }
    ]

    return (
        <header className="app-header">
            <Link to="/">
                <h3 className="logo">Appsus</h3>
            </Link>

            <nav className="app-nav">
                {navLinks.map(navLink => 
                    <AppHeaderNavLink 
                        key={navLink.title} 
                        navLink={navLink}
                    />
                )}
            </nav>
        </header>
    )
}
