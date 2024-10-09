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
    const [unreadCount, setUnreadCount] = useState(0)

    mailService.getUnreadMailsCount()
        .then(unreadMailsCount =>
            setUnreadCount(unreadMailsCount))
        .catch(err => {
            console.error('Had issues getting unread mails count', err)
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
        const newDir = getNewSortDir(currDir)
        setSortBy({ [sortType]: newDir })
    }

    function onOpenMailEdit() {
        setIsMailEdit(true)
    }

    function onCloseMailEdit() {
        setIsMailEdit(false)
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
                unreadCount={unreadCount}
                onOpenMailEdit={onOpenMailEdit}
            />

            {isMailEdit &&
                <MailEdit onCloseMailEdit={onCloseMailEdit} />
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