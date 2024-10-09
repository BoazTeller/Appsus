const { useState, useEffect } = React
const { useParams, useOutletContext, useNavigate  } = ReactRouter

import { mailService } from "../services/mail.service.js"
import { showErrorMsg } from "../../../services/event-bus.service.js"

export function MailDetails() {
    const { mailId } = useParams()
    const { onOpenMailEdit, onRemoveMail } = useOutletContext()
	const navigate = useNavigate()

	const [mail, setMail] = useState(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		loadMail()
	}, [mailId])

	function loadMail() {
		setIsLoading(true)
	    mailService.get(mailId)
            .then(mail => {
                setMail(mail)
            })
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
                {!mail.sentAt && <button className="btn-edit" onClick={onOpenMailEdit}>Edit</button>}
                <button className="btn-delete" onClick={() => onRemoveMail(mail.id)}>
                    {!mail.removedAt ? 'Delete' : 'Delete Forever'}
                </button>
                <button className="btn-back-inbox" onClick={() => {navigate('/mail')}}>Back</button>
            </section>
        </section>
    )
}