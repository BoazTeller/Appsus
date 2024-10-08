{/* <MailDetails>
• Routable component (page)
• show the entire mail
• Allow deleting a mail (using the service)
• Allow navigating back to the list */}

import { mailService } from "../services/mail.service.js"
import { showSuccessMsg, showErrorMsg } from "../../../services/event-bus.service.js"

const { useState, useEffect } = React
const { useParams, useNavigate } = ReactRouter

export function MailDetails() {

    const { mailId } = useParams()
	const navigate = useNavigate()

	const [isLoading, setIsLoading] = useState(true)
	const [mail, setMail] = useState(null)

	useEffect(() => {
		loadMail()
	}, [mailId])

	function loadMail() {
		setIsLoading(true)
	    mailService.get(mailId)
			.then(mail => {
                if (!mail.isRead) {
                    const readMail = { ...mail, isRead: true }
                    return mailService.save(readMail)
                } else {
                    return mail
                }
            })
            .then(mail => setMail(mail))
			.catch(err => {
				console.error('Had issues loading mail', err)
                showErrorMsg('Had issues loading mail')
				navigate('/mail')
			})
			.finally(() => {
				setIsLoading(false)
			})
	}
    
    if (isLoading) return <div className="loader1"></div>
    if (!mail) return <div>Mail deleted</div>

	return (
        <section className="mail-details">
            <h2 className="mail-subject">{mail.subject}</h2>

            <section className="mail-send-info">
                <h3 className="mail-from"><span>From: </span>{mail.from}</h3>
                <h3 className="mail-to"><span>To: </span>{mail.to}</h3>
            </section>

            <section className="mail-body">
                <pre>{mail.body}</pre>
            </section>

            <section className="mail-actions">
                <button className="btn-delte">
                    {!mail.removedAt ? 'Delete' : 'Delete Permanently'}
                </button>
                <button className="btn-back-inbox">Inbox</button>
            </section>
        </section>
    )
}