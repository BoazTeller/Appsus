const { useState, useEffect, useRef } = React
const { useParams, useNavigate } = ReactRouterDOM

import { mailService } from '../services/mail.service.js'
import { showSuccessMsg, showErrorMsg } from '../../../services/event-bus.service.js'

export function MailEdit({ onCloseMailEdit, onSendMail }) {
    const params = useParams() 
    const navigate = useNavigate()

    const [mailToEdit, setMailToEdit] = useState(mailService.getEmptyMail())
    const [draftSubject, setDraftSubject] = useState('New Message')
    const [isLoading, setIsLoading] = useState(true)
    const [isDraftUpdated, setIsDraftUpdated] = useState(false) 
    
    const isSentRef = useRef(false)
    const intervalRef = useRef()
    const mailBackUpRef = useRef()
    const toInputRef = useRef() 

    useEffect(() => {
        if (params.mailId) {
            loadMail()
        } else {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        if (!isLoading && toInputRef.current) {
            toInputRef.current.focus()
        }
    }, [isLoading])

    useEffect(() => {    
        intervalRef.current = setInterval(() => {
            saveDraft()
        }, 1000) 
    
        return () => clearInterval(intervalRef.current)
    }, [mailToEdit])

    function isDraftReadyToSave() {
        return !isSentRef.current && (mailToEdit.to || mailToEdit.subject || mailToEdit.body)
    }

    function saveDraft() {
        if (isDraftReadyToSave()) {
            const draftMail = { ...mailToEdit }
            mailService.save(draftMail)
                .then((savedDraft) => {
                    if (!mailToEdit.id) { 
                    // After the first save, the draft gets a unique ID from storage
                    // Set the mailId in the component state so we can use it for future updates
                        setMailToEdit(prevDraft => ({ ...prevDraft, id: savedDraft.id })) 
                    }
                })
                .catch(err => {
                    console.error(`Error saving draft:`, err)
                    showErrorMsg(`Couldn't save draft`)
                })
        }
    }

    function loadMail() {
        mailService.get(params.mailId)
            .then(mail => {
                setMailToEdit(mail)
                setDraftSubject(mail.subject)
                setIsLoading(false)                
            })
            .catch(err => {
                console.error(`Coundn't load saved draft to edit`, err)
                showErrorMsg(`Couldn't load saved draft`)
                setIsLoading(false)  
            })
    }

    function handleChange({ target }) {
        const { value, name: field } = target
        setMailToEdit(prevMail => ({ ...prevMail, [field]: value }))
    }

    function hasChanges() {
        return JSON.stringify(mailToEdit) !== JSON.stringify(mailBackUpRef)
    }

    function handleCloseEdit() {
        const shouldSaveDraft = hasChanges() && isDraftReadyToSave()

        shouldSaveDraft ? onCloseMailEdit(mailToEdit) : onCloseMailEdit()  
    }

    function onSubmitMail(ev) {
        ev.preventDefault()
        clearInterval(intervalRef.current)
        isSentRef.current = true
        onSendMail(mailToEdit)
    }

    const { to, subject, body } = mailToEdit

    return (
        <section className="mail-edit">
            <header>
                <h1>{isLoading ? 'Loading draft...' : draftSubject}</h1>
                <button onClick={() => handleCloseEdit()}>x</button>
            </header>

            {isLoading && <span className="loader1"></span>}

            {!isLoading && 
                <form onSubmit={onSubmitMail} >
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
            }
        </section>
    )
}