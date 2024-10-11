const { Route, Routes } = ReactRouterDOM
const Router = ReactRouterDOM.HashRouter

// Main App Components
import { AppHeader } from "./cmps/AppHeader.jsx"

// Page Views
import { Home } from "./pages/Home1.jsx"
import { About } from "./pages/About.jsx"

// Mail App Components
import { MailIndex } from "./apps/mail/pages/MailIndex.jsx"
import { MailDetails } from "./apps/mail/pages/MailDetails.jsx"

// Note App Components
import { NoteIndex } from "./apps/note/pages/NoteIndex.jsx"

// Utility Components (UserMsg, NotFound)
import { UserMsg } from "./cmps/UserMsg.jsx"
import { NotFound } from "./cmps/NotFound.jsx"

export function App() {
    return (
        <Router>
            <section className="app">
                <AppHeader />

                <main className="app-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />

                        <Route path="/mail" element={<MailIndex />} >
                            <Route path="/mail/:mailId" element={<MailDetails />} />
                        </Route>

                        <Route path="/note" element={<NoteIndex />} />
                    
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>

                <UserMsg />
            </section>
        </Router>
    )
}