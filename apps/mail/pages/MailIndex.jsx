{/* <MailIndex>
• Gets mails to show from service
• Renders the list and the filter components (both top filter with search,
and side filter for different folders) */}

import { mailService } from "../services/mail.service.js"

import { MailFolderList } from "../cmps/MailFolderList.jsx"
import { MailList } from "../cmps/MailList.jsx"

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

    return (
        <section className="mail-index">
            <MailFolderList />

            <MailList mails={mails} />
        </section>
    )
}



