const { useState, useEffect } = React
const { useParams, useSearchParams, useNavigate, Outlet } = ReactRouterDOM

import { mailService } from "../services/mail.service.js"
import { utilService } from "../../../services/util.service.js"
import { showSuccessMsg, showErrorMsg } from "../../../services/event-bus.service.js"

import { MailFolderList } from "../cmps/MailFolderList.jsx"
import { MailList } from "../cmps/MailList.jsx"
import { MailFilterSearch } from "../cmps/MailFilterSearch.jsx"
import { MailEdit } from "../cmps/MailEdit.jsx"

export function MailIndex() {
    const params = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()

    const [mails, setMails] = useState(null)
    const [filterBy, setFilterBy] = useState(mailService.getFilterFromParams(searchParams))
    const [sortBy, setSortBy] = useState(mailService.getDefaultSortBy())

    const [isMailEdit, setIsMailEdit] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [mailCount, setMailCount] = useState(0)

    mailService.getUnreadAndDraftCounts()
        .then(count =>
            setMailCount(count))
            .catch(err => {
                console.error('Had issues getting unread mails and drafts count', err)
            })

    useEffect(() => {
        setSearchParams(utilService.getTruthyValues(filterBy))
        loadMails()
    }, [filterBy])

    useEffect(() => {
        loadMails()
    }, [sortBy])

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

    function onSetFilterBy(fieldsToUpdate) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...fieldsToUpdate }))
    }

    function onSetSortBy(sortType) {
        const currDir = sortBy[sortType]
        const newDir = utilService.getNewSortDir(currDir)
        setSortBy({ [sortType]: newDir })
    }

    function onOpenMailEdit() {
        setIsMailEdit(true)
    }

    function onCloseMailEdit(draftToSave = null) {
        setIsMailEdit(false)
        if (!draftToSave) return

        mailService.save(draftToSave)
            .then(() => {
                setMails(prevMails => [draftToSave, ...mails])
                showSuccessMsg('Draft saved')
            })
            .catch(err => {
                console.error('Had issues saving draft', err)
                showErrorMsg(`Couldn't save draft`)
            })
    }

    function onSendMail(newMail) {
        const mailToSend = { 
            ...newMail, 
            sentAt: Date.now(),
            isRead: false 
        }

        mailService.save(mailToSend)
            .then(() => {
                setMails(prevMails => [mailToSend, ...prevMails])
                onCloseMailEdit()
                showSuccessMsg('Mail sent successfully')
            })
            .catch(err => {
                console.error('Had issues sending mail', err)
                showErrorMsg('Had issues sending mail')
            })
    }

    function onReadMail(mail) {
        const updatedMail = { ...mail, isRead: true }
        mailService.save(updatedMail)
        .then(() => {
            setMails(prevMails =>
                prevMails.map(mail => mail.id === updatedMail.id ? updatedMail : mail)
            )
        })
        .catch((err) => {
            console.error('Error updating mail read status to true:', err)
            showErrorMsg(`Couldn't update read status`)
        })
        
    }
    
    function onToggleRead(mail) {
        const updatedMail = { ...mail, isRead: !mail.isRead }
        
        mailService.save(updatedMail)
            .then(() => {
                setMails(prevMails =>
                    prevMails.map(mail => mail.id === updatedMail.id ? updatedMail : mail)
                )
            })
            .catch((err) => {
                console.error('Error updating mail read status:', err)
                showErrorMsg(`Couldn't update read status`)
            })
    }

    function onToggleStarred(mail) {
        const updatedMail = { ...mail, isStarred: !mail.isStarred }
        mailService.save(updatedMail)
            .then(() => {
                setMails(prevMails =>
                    prevMails.map(mail => mail.id === updatedMail.id ? updatedMail : mail)
                )
            })
            .catch((err) => {
                console.error('Error updating mail star status:', err)
                showErrorMsg(`Couldn't update starred status`)
            })
    }

    function onRemoveMail(mailId) {
        const mail = mails.find(m => m.id === mailId)
        if (!mail) {
            console.error('Mail not found')
            showErrorMsg('Mail not found')
            return
        } 

        mail.removedAt ? removeMail(mail.id) : moveToTrash(mail)  
    }
    
    function moveToTrash(mail) {
        const mailToTrash = { ...mail, removedAt: Date.now() }
        mailService.save(mailToTrash)
            .then(() => {
                setMails(prevMails =>
                    prevMails.map(mail => mail.id === mailToTrash.id ? mailToTrash : mail)
            )
            showSuccessMsg(`Conversation moved to Trash.`)
            navigate('/mail')
        })
        .catch(err => {
            console.error('Had issues removing mail', err)
            showErrorMsg(`Could not remove mail`)
        })
    }
    
    function removeMail(mailId) {
        mailService.remove(mailId)
            .then(() => {
                setMails(prevMails =>
                    prevMails.filter(mail => mail.id !== mailId)
                )
                showSuccessMsg('Conversation deleted forever.')
                navigate('/mail')
            })
            .catch(err => {
                console.error('Had issues removing mail', err)
                showErrorMsg('Could not remove mail')
            })
    }

    const { folder, txt, isRead } = filterBy
    return (
        <section className="mail-index">
            <MailFolderList 
                onSetFilterBy={onSetFilterBy} 
                filterBy={{ folder }} 
                mailCount={mailCount}
                onOpenMailEdit={onOpenMailEdit}
            />

            {isMailEdit &&
                <MailEdit 
                    onCloseMailEdit={onCloseMailEdit} 
                    onSendMail={onSendMail}
                />
             }

            {!params.mailId &&
                <div>
                    <MailFilterSearch 
                        onSetFilterBy={onSetFilterBy} 
                        filterBy={{ txt }} 
                    />

                    <MailList 
                        mails={mails} 
                        onSetSortBy={onSetSortBy}
                        sortBy={sortBy}
                        onSetFilterBy={onSetFilterBy} 
                        filterBy={{ isRead }} 
                        onRemoveMail={onRemoveMail}
                        onToggleStarred={onToggleStarred}
                        onToggleRead={onToggleRead}
                        onReadMail={onReadMail}
                        folder={folder}
                        isLoading={isLoading}
                    />
                </div>
            }        

            {params.mailId && (
                <Outlet 
                    context={{
                        onOpenMailEdit,
                        onRemoveMail
                    }} 
                />
            )}    
        </section>
    )
}