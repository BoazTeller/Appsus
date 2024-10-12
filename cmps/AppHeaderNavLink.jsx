const { NavLink } = ReactRouterDOM

export function AppHeaderNavLink({ navLink }) {

    return(
        <NavLink
            to={`/${navLink.path}`}
            className="nav-link"
            title={`Go to ${navLink.title} page`}
        >
            {navLink.title}
        </NavLink>
    )
}