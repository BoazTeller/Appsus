export function Home() {
    const appName = 'Appsus'

    return ( 
        <section className="home">
            <header className="logo">
                {appName
                    .split('')
                    .map((letter, idx) => (
                        `<span key=${idx}>${letter}</span`
                    ))
                }
            </header>

            <h1>Welcome to our home page!</h1>

            <footer>Powered by Appsus — where emails and notes find their home!</footer>
        </section>
    )
}
