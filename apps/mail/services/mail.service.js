import { utilService } from "../../../services/util.service.js"
import { storageService } from "../../../services/async-storage.service.js"

const MAIL_KEY = 'mailDB'

const loggedinUser = {
    email: 'user@appsus.com',
    fullname: 'Mahatma Appsus'
}

_createMails()

export const mailService = {
    query,
    get,
    remove,
    save,
    getDefaultFilter,
    getEmptyMail
}

function query(filterBy = getDefaultFilter(), sortBy = getDefaultSortBy()) {
    return storageService.query(MAIL_KEY)
        .then(mails => {
            mails = _getFilteredMails(mails, filterBy)

            mails = _getSortedMails(mails, sortBy)

            return mails
        })
}

function get(mailId) {
    return storageService.get(MAIL_KEY, mailId)
}

// Move to Trash if removedAt is null otherwise delete permanently
// Function returns status for controller user feedback
function remove(mailId) {
    return storageService.get(MAIL_KEY, mailId)
        .then(mail => {
            if (!mail.removedAt) {
                const toTrashMail = { ...mail, removedAt: Date.now() }
                return storageService.put(MAIL_KEY, toTrashMail)
                    // Return status after moving mail to trash
                    .then(() => ({ status: 'removed', mail: toTrashMail }))
            } else {
                return storageService.remove(MAIL_KEY, mailId)
                    // Return status after permanently deleting mail
                    .then(() => ({ status: 'deleted_permanently', mailId }))
            }
        })
}

function save(mail) {
    if (mail.id) {
        return storageService.put(MAIL_KEY, mail)
    } else {
        return storageService.post(MAIL_KEY, mail)
    }
}

function _getFilteredMails(mails, filterBy) {
    // Folder filtering
    if (filterBy.folder === 'inbox') {
        mails = mails.filter(mail => mail.to === loggedinUser.email && !mail.removedAt)
    }
    if (filterBy.folder === 'starred') {
        mails = mails.filter(mail => mail.isStarred && !mail.removedAt)
    }
    if (filterBy.folder === 'sent') {
        mails = mails.filter(mail => mail.from === loggedinUser.email && mail.sentAt)
    }
    if (filterBy.folder === 'draft') {
        mails = mails.filter(mail => mail.from === loggedinUser.email && !mail.sentAt && !mail.removedAt)
    }
    if (filterBy.folder === 'trash') {
        mails = mails.filter(mail => mail.removedAt)
    }
    
    // Text search - Mail Subject / Body / From / To
    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        mails = mails.filter(mail => regExp.test(mail.subject) || regExp.test(mail.body) ||
                regExp.test(mail.from) || regExp.test(mail.to))
    }

    if (filterBy.isRead === 'read') {
        mails = mails.filter(mail => mail.isRead)
    }
    if (filterBy.isRead === 'unread') {
        mails = mails.filter(mail => !mail.isRead)
    }

    return mails
}

function _getSortedMails(mails, sortBy) {
    // Sort alphabetically by To Sender address
    if (sortBy.to) {
        mails.sort((mail1, mail2) => mail1.to.localeCompare(mail2.to) * sortBy.to)
    }
    // Sort alphabetically by From Sender address
    if (sortBy.from) {
        mails.sort((mail1, mail2) => mail1.from.localeCompare(mail2.from) * sortBy.from)
    }
    // Sort alphabetically by mail subject
    if (sortBy.subject) {
        mails.sort((mail1, mail2) => mail1.subject.localeCompare(mail2.subject) * sortBy.subject)
    }
    // Sort alphabetically by date mail was sent
    if (sortBy.date) {
        mails.sort((mail1, mail2) => (mail1.sentAt - mail2.sentAt) * sortBy.sentAt)
    }

    return mails
}

function getDefaultFilter() {
    return {
        folder: 'inbox',
        txt: '',
        isRead: ''
    } 
}

function getEmptyMail() {
    return {
        id: utilService.makeId(),
        subject: '', 
        body: '',
        isRead: false, 
        isStarred: false, 
        sentAt: null,
        removedAt: null, 
        from: '', 
        to: '',
    }
}

function _createMails() {
    let mails = utilService.loadFromStorage(MAIL_KEY)
    if (!mails || !mails.length) {
        mails = []
        // Create mails as a base for inbox
        for (let i = 0; i < 50; i++) {
            mails.push(_createMail())
        }
        // Create mails for trash
        for (let i = 0; i < 10; i++) {
            mails.push(_createTrashMail())
        }
        // Create mails for starred
        for (let i = 0; i < 1; i++) {
            mails.push(_createStarredMail())
        }
        utilService.saveToStorage(MAIL_KEY, mails)
        console.log("Mails created and saved:", mails)
    }
}

function _createMail() {
    return {
        id: utilService.makeId(),
        subject: utilService.makeLorem(5), 
        body: utilService.makeLorem(50), 
        isRead: Math.random() > 0.5, 
        isStarred: false, 
        sentAt: Date.now(), 
        removedAt: null, 
        from: utilService.makeLorem(1) + "@gmail.com",
        to: loggedinUser.email 
    }
}

function _createTrashMail() {
    const mail = _createMail()
    mail.removedAt = Date.now()
    return mail
}

function _createStarredMail() {
    const mail = _createMail()
    mail.isStarred = true
    return mail
}