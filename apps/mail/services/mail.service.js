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
    deleteMail,
    save,
    getDefaultFilter,
    getEmptyMail
}

function query(filterBy = {}) {
    return storageService.query(MAIL_KEY)
        .then(mails => {
            mails = _getFilteredMails(mails, filterBy)
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
    
    // Text search - Mail Subject / Body
    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.status, 'i')
        mails = mails.filter(mail => regExp.test(mail.subject) || regExp.test(mail.body))
    }

    // Filter mails by readStatus (true for read, false for unread, no filter if undefined)
    if (filterBy.readStatus !== undefined) {
        mails = mails.filter(mail => mail.isRead === filterBy.readStatus)
    }

    return mails
}

function getDefaultFilter() {
    return {
        folder: 'inbox',
        txt: ''       
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
    console.log("hola")
    let mails = utilService.loadFromStorage(MAIL_KEY)
    if (!mails || !mails.length) {
        mails = []
        // Create 100 mails as a base for inbox
        for (let i = 0; i < 100; i++) {
            mails.push(_createMail())
        }
        // Create 10 mails for trash
        for (let i = 0; i < 10; i++) {
            mails.push(_createTrashMail())
        }
        // Create 15 mails for starred
        for (let i = 0; i < 15; i++) {
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