{/* <MailIndex>
• Gets mails to show from service
• Renders the list and the filter components (both top filter with search,
and side filter for different folders) */}

import { mailService } from "../services/mail.service.js"
import { showSuccessMsg, showErrorMsg } from "../../../services/event-bus.service.js"

import { MailFolderList } from "../cmps/MailFolderList.jsx"
import { MailList } from "../cmps/MailList.jsx"
import { MailFilterSearch } from "../cmps/MailFilterSearch.jsx"
import { MailEdit } from "../cmps/MailEdit.jsx"

const { useState, useEffect } = React
const { useParams, useSearchParams, Outlet } = ReactRouterDOM

export function MailIndex() {

    const params = useParams()
    const [searchParams, setSearchParams] = useSearchParams()

    const [mails, setMails] = useState(null)
    const [isMailEdit, setIsMailEdit] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [unreadCount, setUnreadCount] = useState(0)

    const [filterBy, setFilterBy] = useState(mailService.getFilterFromParams(searchParams))
    const [sortBy, setSortBy] = useState(mailService.getDefaultSortBy())

    mailService.getUnreadMailsCount()
        .then(unreadMailsCount =>
            setUnreadCount(unreadMailsCount))
        .catch(err => {
            console.error('Had issues getting unread mails count', err)
    })

    useEffect(() => {
        setSearchParams(filterBy)
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
        let newDir

        if (currDir === 1) {
            newDir = -1
        } else if (currDir === -1) {  
            newDir = null
        } else {
            newDir = 1
        }
    
        setSortBy({ [sortType]: newDir })
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
                showErrorMsg('Couldn\'t update starred status')
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
            .catch(err => {
                console.error('Error trying to remove mail', err)
                showErrorMsg('Couldn\'t delete mail')
            })
    }

    const { folder, txt, isRead } = filterBy
    
    return (
        <section className="mail-index">
            <MailFolderList 
                onSetFilterBy={onSetFilterBy} 
                filterBy={{ folder }} 
                unreadCount={unreadCount}
                onOpenMailEdit={() => setIsMailEdit(true)}
            />

            {isMailEdit &&
                <MailEdit onCloseMailEdit={() => setIsMailEdit(false)} />
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
                        onToggleStarred={onToggleStarred}
                        folder={folder}
                        isLoading={isLoading}
                    />
                </div>
            }        

            {params.mailId && 
                <Outlet context={{ onOpenMailEdit: () => setIsMailEdit(true) }} />
            }     
        </section>
    )
}



