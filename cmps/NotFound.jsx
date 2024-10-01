const { Link } = ReactRouterDOM

export function NotFound() {

    return (
        <section className="not-found-container">
            <section className="not-found">
                <h1>Oh NO!</h1>
                <h2>Cannot found route!</h2>
            </section>
            
            <Link to="/">Back</Link>
        </section>
    )
}