{/* <MailIndex>
• Gets mails to show from service
• Renders the list and the filter components (both top filter with search,
and side filter for different folders) */}

import { mailService } from "../services/mail.service.js"
import { showSuccessMsg, showErrorMsg } from "../../../services/event-bus.service.js"

import { MailFolderList } from "../cmps/MailFolderList.jsx"
import { MailList } from "../cmps/MailList.jsx"
import { showSuccessMsg, showErrorMsg } from "../../../services/event-bus.service.js"

const { useState, useEffect } = React

export function MailIndex() {

    const [mails, setMails] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [filterBy, setFilterBy] = useState(mailService.getDefaultFilter())

    useEffect(() => {
        loadMails()
    }, [])

    function loadMails() {
        setIsLoading(true)
        mailService.query(filterBy, sortBy)
            .then(mails => {
                setMails(mails)
                setIsLoading(false)
            })
            .catch(err => {
                console.error('Had issues loading mails', err)
                showErrorMsg('Had issues loading mails')
                setIsLoading(false)
            })
    }

    function onToggleStarred(mail) {
        const updatedMail = { ...mail, isStarred: !mail.isStarred }

        mailService.save(updatedMail)
            .then(updatedMail => {
                setMails(prevMails =>
                    prevMails.map(mail => mail.id === updatedMail.id ? updatedMail : mail)
                )
            })
            .catch((err) => {
                console.error('Error updating mail star status:', err)
            })
    }

    function onRemoveMail(mailId) {
        mailService.remove(mailId)
            .then((res) => {
                if (res.msg === 'moved_to_trash') {
                    showSuccessMsg('Mail moved to trash')
                } else if (res.msg === 'deleted_permanently') {
                    showSuccessMsg('Mail deleted permanently')
                }
            })
    }

    return (
        <section className="mail-index">
            <MailFolderList />

            <MailList mails={mails} />
        </section>
    )
}



