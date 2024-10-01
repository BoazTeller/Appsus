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

function query() {
    return storageService.query(MAIL_KEY)
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
