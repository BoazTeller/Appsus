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
function remove(mailId) {
    return storageService.get(MAIL_KEY, mailId)
        .then(mail => {
            if (!mail.removedAt) {
                const toTrashMail = { ...mail, removedAt: Date.now()}
                return storageService.put(MAIL_KEY, toTrashMail)
            } else {
                return storageService.remove(MAIL_KEY, mailId)
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