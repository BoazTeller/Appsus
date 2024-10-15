export function About() {
    return (
        <section className="about">
            <h1 className="headline-about">About Us</h1>

            <div className="profile">
                <img src="assets\img\boaz.png" alt="Boaz" className="profile-pic" />

                <div className="description">
                    <h2>Boaz</h2>
                    <p>I am Boaz, responsible for the 'Mail' section in our React project. Together with Tal, I am learning JavaScript and working on mastering new concepts with each project we build.</p>
                </div>
            </div>

            <div className="profile">
                <img src="assets\img\tal.png" alt="Tal" className="profile-pic" />
                
                <div className="description">
                    <h2>Tal</h2>
                    <p>I am Tal, 26 years old and working in Automation. In our first major React project, I am responsible for the 'Notes' section. Boaz and I are both learning JavaScript and enjoying the challenges along the way.</p>
                </div>
            </div>
        </section>
    )
}
