const { useState, useEffect } = React
const { useParams, useSearchParams, useNavigate, Outlet } = ReactRouterDOM

import { mailService } from "../services/mail.service.js"
import { utilService } from "../../../services/util.service.js"
import { showSuccessMsg, showErrorMsg } from "../../../services/event-bus.service.js"

import { MailHeader } from "../cmps/MailHeader.jsx"
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
                showErrorMsg(`Oops! Couldn't load mails. Please try again.`)
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
        
        showSuccessMsg('Saving draft...')
        
        mailService.save(draftToSave)
            .then(() => {
                if (searchParams.get('folder') === 'drafts') {
                    setMails(prevMails => [...mails, draftToSave])
                }
                showSuccessMsg('Draft saved')
            })
            .catch(err => {
                console.error('Had issues saving draft', err)
                showErrorMsg(`Oops! Couldn't save draft. Please try again.`)
            })
    }

    function onOpenMailDetails(mail) {
        if (!mail.isRead && mail.sentAt) onReadMail(mail)
        navigate(`/mail/${mail.id}`)
    }

    function onSendMail(newMail) {
        showSuccessMsg('Sending...')

        const mailToSend = { 
            ...newMail, 
            sentAt: Date.now(),
            isRead: false 
        }

        mailService.save(mailToSend)
            .then(() => {
                setMails(prevMails => 
                    mailService.getSortedMails([...prevMails, mailToSend], sortBy)
                )
                onCloseMailEdit()
                showSuccessMsg('Message sent')
            })
            .catch(err => {
                console.error('Had issues sending mail', err)
                showErrorMsg(`Oops! Couldn't send mail. Please try again.`)
            })
    }

    /**
     * Marks the mail as read to trigger a re-render and update the unread mail count.
     * Called only when an unread mail is opened.
     */
    function onReadMail(mail) {
        const updatedMail = { ...mail, isRead: true }

        mailService.save(updatedMail)
            .then(() => {
                setMails(prevMails =>
                    prevMails.map(mail => mail.id === updatedMail.id ? updatedMail : mail)
                )
            })
            .catch((err) => {
                console.error('Error setting mail read status to true:', err)
                showErrorMsg(`Oops! Couldn't update read status. Please try again.`)
            })
    }
    
    // Toggles read status optimistically and reverts on error
    function onToggleRead(mail) {
        const updatedMail = { ...mail, isRead: !mail.isRead }
    
        setMails(prevMails =>
            prevMails.map(m => m.id === mail.id ? updatedMail : m)
        )
    
        mailService.save(updatedMail)
            .catch((err) => {
                console.error('Error updating mail read status:', err)
                showErrorMsg(`Oops! Couldn't update read status. Please try again.`)
                setMails(prevMails =>
                    prevMails.map(m => m.id === mail.id ? mail : m) 
                )
            })
    }

    // Toggles starred status optimistically and reverts on error
    function onToggleStarred(mail) {
        const updatedMail = { ...mail, isStarred: !mail.isStarred }

        setMails(prevMails =>
            prevMails.map(m => m.id === mail.id ? updatedMail : m)
        )
        
        mailService.save(updatedMail)
            .catch((err) => {
                console.error('Error updating mail star status:', err)
                showErrorMsg(`Oops! Couldn't update starred status. Please try again.`)
                setMails(prevMails =>
                    prevMails.map(m => m.id === mail.id ? mail : m) 
                )
            })
    }

    function onRemoveMail(mail) {
        mail.removedAt ? removeMail(mail.id) : moveToTrash(mail)
    }

    function removeMail(mailId) {
        mailService.remove(mailId)
            .then(() => {
                setMails(prevMails =>prevMails.filter(mail => mail.id !== mailId))
                showSuccessMsg('Conversation deleted forever.')
                navigate('/mail')
            })
            .catch(err => {
                console.error('Had issues removing mail', err)
                showErrorMsg(`Oops! Couldn't delete mail. Please try again.`)
            })
    }

    function moveToTrash(mail) {
        const updatedMail = { ...mail, removedAt: Date.now() }

        mailService.save(updatedMail)
            .then(() => {
                setMails(prevMails =>
                    prevMails.filter(currMail => currMail.id !== updatedMail.id)
                )  
                showSuccessMsg(`Conversation moved to Trash.`)
                navigate('/mail')
            })
            .catch(err => {
                console.error('Had issues removing mail to trash', err)
                showErrorMsg(`Oops! Couldn't move to trash. Please try again.`)
            })
    }
    
    function onSaveAsNote(mail) {
        const newNoteParams = new URLSearchParams({
            subject: mail.subject || '',
            body: mail.body || '',
            from: mail.from || '',
            to: mail.to || ''
        })

        setSearchParams(newNoteParams)

        navigate({
            pathname: '/note',
            search: `?${newNoteParams.toString()}`,
            replace: true
        })
    }

    const { folder, txt, isRead } = filterBy
    return (
        <section className="mail-index">
            <MailHeader
                onSetFilterBy={onSetFilterBy} 
                filterBy={{ folder }} 
            />

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
                    <MailList 
                        mails={mails} 
                        onSetSortBy={onSetSortBy}
                        sortBy={sortBy}
                        onSetFilterBy={onSetFilterBy} 
                        filterBy={{ isRead }} 
                        onRemoveMail={onRemoveMail}
                        onOpenMailEdit={onOpenMailEdit}
                        onOpenMailDetails={onOpenMailDetails}
                        onToggleStarred={onToggleStarred}
                        onToggleRead={onToggleRead}
                        onReadMail={onReadMail}
                        onSaveAsNote={onSaveAsNote}
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