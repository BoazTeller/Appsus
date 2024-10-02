{/* <MailIndex>
• Gets mails to show from service
• Renders the list and the filter components (both top filter with search,
and side filter for different folders) */}

import { mailService } from "../services/mail.service.js"

import { MailFolderList } from "../cmps/MailFolderList.jsx"
import { MailList } from "../cmps/MailList.jsx"
import { showSuccessMsg, showErrorMsg } from "../../../services/event-bus.service.js"

const { useState, useEffect } = React

export function MailIndex() {

    const [mails, setMails] = useState(null)
    const [filterBy, setFilterBy] = useState(mailService.getDefaultFilter())

    useEffect(() => {
        loadMails()
    }, [])

    useEffect(() => {
        console.log(mails)
    }, [mails])

    function loadMails() {
        mailService.query()
            .then(mails => {
                setMails(mails)
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



