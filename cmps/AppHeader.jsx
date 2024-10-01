const { Link, NavLink } = ReactRouterDOM

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
                    <NavLink
                        key={navLink.path}
                        to={`/${navLink.path}`}
                        className="nav-link"
                        title={`Go to ${navLink.title} page`}
                    >
                        {navLink.title}
                    </NavLink>
                )}
            </nav>
        </header>
    )
}
