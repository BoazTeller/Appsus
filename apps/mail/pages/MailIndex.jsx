{/* <MailIndex>
• Gets mails to show from service
• Renders the list and the filter components (both top filter with search,
and side filter for different folders) */}

import { mailService } from "../services/mail.service.js"

import { MailFolderList } from "../cmps/MailFolderList.jsx"

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

    return (
        <section className="mail-index">
            <MailFolderList />

        </section>
    )
}



