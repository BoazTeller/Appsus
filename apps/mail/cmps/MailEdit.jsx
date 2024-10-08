import { mailService } from '../services/mail.service.js'
import { showSuccessMsg, showErrorMsg } from '../../../services/event-bus.service.js'

const { useState, useEffect, useRef } = React
const { useParams } = ReactRouterDOM

export function MailEdit({ onCloseMailEdit }) {

    const params = useParams()

    const [mailToEdit, setMailToEdit] = useState(mailService.getEmptyMail())
    const toInputRef = useRef() 
    const intervalRef = useRef()

    useEffect(() => {
        if (params.mailId) {
            loadMail()
        }
    }, [])

    useEffect(() => {
        toInputRef.current.focus()
    }, [])

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            if (mailToEdit.to || mailToEdit.subject || mailToEdit.body) {
                const draftMail = { ...mailToEdit }
                mailService.save(draftMail)
                    .then((savedDraft) => {
                        if (!mailToEdit.id) {
                            setMailToEdit(savedDraft)
                        }
                    })  
            }
        }, 1000) 

        return () => clearInterval(intervalRef.current)
    }, [mailToEdit])

    function loadMail() {
        mailService.get(params.mailId)
            .then(mail => setMailToEdit(mail))
            .catch(err => {
                console.error('Coundn\'t load saved draft to edit', err)
                showErrorMsg('Couldn\'t load saved draft')
            })
    }

    function handleChange({ target }) {
        const { value, name: field } = target
        setMailToEdit(prevMail => ({ ...prevMail, [field]: value }))
    }

    function onSendMail(ev) {
        ev.preventDefault()

        const mailToSend = { ...mailToEdit, sentAt: Date.now() }
        mailService.save(mailToSend)
            .then(() => {
                showSuccessMsg('Mail sent successfully!')
                setMailToEdit(null)
                onCloseMailEdit()
            })
            .catch(err => {
                console.error('Had issues sending mail', err)
                showErrorMsg('Had issues sending mail')
            })
    }

    const { to, subject, body } = mailToEdit

    return (
        <section className="mail-edit">
            <header>
                <h1>New Message</h1>
                <button onClick={() => onCloseMailEdit()}>x</button>
            </header>

            <form onSubmit={onSendMail} >
                <div className="email">
                    <input
                        ref={toInputRef}
                        type="email"
                        placeholder="To"
                        name="to"
                        onChange={handleChange}
                        value={to}
                    />
                </div>

                <div className="subject">
                    <input
                        type="text"
                        placeholder="Subject"
                        name="subject"
                        onChange={handleChange}
                        value={subject}
                    />
                </div>

                <div className="body">
                    <textarea
                        type="text"
                        placeholder="Compose mail"
                        name="body"
                        onChange={handleChange}
                        value={body}
                    />
                </div>

                <button className="send-btn">Send</button>
            </form>
        </section>
    )
}