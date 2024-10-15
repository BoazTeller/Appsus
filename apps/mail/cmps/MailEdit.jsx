const { useState, useEffect, useRef } = React
const { useParams, useNavigate } = ReactRouterDOM

import { mailService } from '../services/mail.service.js'
import { showSuccessMsg, showErrorMsg } from '../../../services/event-bus.service.js'
import { Loader } from './Loader.jsx'

export function MailEdit({ onCloseMailEdit, onSendMail }) {
    const params = useParams() 
    const navigate = useNavigate()

    const [mailToEdit, setMailToEdit] = useState(mailService.getEmptyMail())
    const [draftSubject, setDraftSubject] = useState('New Message')
    const [isMinimized, setIsMinimized] = useState(false)
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

    function onToggleIsMinimized() {
        setIsMinimized(prevIsMinimized => !prevIsMinimized)
    }

    function handleKeyDown(ev) {
        if (ev.ctrlKey && ev.key === 'Enter') {
            onSubmitMail(ev)
        }
    }

    const { to, subject, body } = mailToEdit
    return (
        <section 
            id="mailEdit"
            className={`mail-edit ${isMinimized ? 'minimized' : ''}`} 
            title={isMinimized ? 'Maximize' : ''}
        >
    
            <header className="compose-header">
                <h1>{isLoading ? 'Loading draft...' : draftSubject}</h1>

                <section className="actions-container">
                    <button 
                        onClick={onToggleIsMinimized} 
                        title={isMinimized ? 'Maximize' : 'Minimize'}
                    >
                        <span className="materials">remove</span>
                    </button>
                    
                    <button 
                        onClick={() => handleCloseEdit()} 
                        title="Save & close"
                    >
                            <span className="materials">close</span>
                    </button>
                </section>
            </header>

            {!isMinimized && !isLoading && 
                <form onSubmit={onSubmitMail} onKeyDown={handleKeyDown}>
                    <div className="email">
                        <input
                            ref={toInputRef}
                            type="email"
                            placeholder="Recipients"
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
                    
                    <textarea
                        type="text"
                        name="body"
                        onChange={handleChange}
                        value={body}
                    />

                    <div className="btn-container flex align-center">
                        <button className="send-btn" title="Send {Ctrl-Enter}">Send</button>
                    </div>
                </form>
            }

            {isLoading && <Loader loaderNum={3} />}
        </section>
    )
}