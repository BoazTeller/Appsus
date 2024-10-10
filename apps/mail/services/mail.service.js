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
    getFilterFromParams,
    getDefaultSortBy,
    getEmptyMail,
    getUnreadMailsCount,
    getDraftMailsCount,
    getUnreadAndDraftCounts
}

window.ms = mailService

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

function remove(mailId) {
    return storageService.remove(MAIL_KEY, mailId)
}

function save(mail) {
    if (mail.id) {
        return storageService.put(MAIL_KEY, mail)
    } else {
        return storageService.post(MAIL_KEY, mail)
    }
}

// Inbox unread and drafts count
function getUnreadAndDraftCounts() {
    return storageService.query(MAIL_KEY)
        .then(mails => mails.reduce((acc, mail) => {
            if (!mail.removedAt && mail.to === loggedinUser.email && !mail.isRead && mail.sentAt) {
                acc.unreadCount = (acc.unreadCount || 0) + 1
            }
            else if (!mail.removedAt && mail.from === loggedinUser.email && !mail.sentAt) {
                acc.draftsCount = (acc.draftsCount || 0) + 1
            }
            return acc
        }, { unreadCount: 0, draftsCount: 0 }))
}

// Unread count for Inbox mails
function getUnreadMailsCount() { 
    return storageService.query(MAIL_KEY)
        .then(mails => mails.reduce((acc, mail) => {
            if (!mail.removedAt && mail.to === loggedinUser.email && !mail.isRead && mail.sentAt) {
                acc++
            }
            return acc
        }, 0))
}

// Mail count inside Drafts
function getDraftMailsCount() { 
    return storageService.query(MAIL_KEY)
        .then(mails => mails.reduce((acc, mail) => {
            if (!mail.removedAt && mail.from === loggedinUser.email && !mail.sentAt) {
                acc++
            }
            return acc
        }, 0))
}

function _getFilteredMails(mails, filterBy) {
    // Folder (status) filtering
    if (filterBy.folder === 'inbox') {
        mails = mails.filter(mail => 
            mail.to === loggedinUser.email &&   
            !mail.removedAt &&                  
            mail.sentAt &&                      
            (mail.from !== loggedinUser.email || mail.to === loggedinUser.email) 
        )
    }
    if (filterBy.folder === 'starred') {
        mails = mails.filter(mail => mail.isStarred && !mail.removedAt)
    }
    if (filterBy.folder === 'sent') {
        mails = mails.filter(mail => mail.from === loggedinUser.email && mail.sentAt)
    }
    if (filterBy.folder === 'drafts') {
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

    // Filter by read/unread (skip if empty)
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
        mails.sort((mail1, mail2) => (mail1.sentAt - mail2.sentAt) * sortBy.date)
    }

    return mails
}

/// Factory and Utility functions ///
function getDefaultFilter() {
    return {
        folder: 'inbox',
        txt: '',
        isRead: ''
    } 
}

function getDefaultSortBy() {
    return {
        date: -1
    } 
}

function getEmptyMail() {
    return {
        id: '',
        subject: '', 
        body: '',
        isRead: false, 
        isStarred: false, 
        sentAt: null,
        removedAt: null, 
        from: loggedinUser.email, 
        to: '',
    }
}

function getFilterFromParams(searchParams = {}) {
    const folder = searchParams.get('folder') || 'inbox'
    const txt = searchParams.get('txt') || ''
    const isRead = searchParams.get('isRead') || ''

    return {
        folder,
        txt,
        isRead: ''
    }
}

// Initial setup and data creation functions
function _createMails() {
    let mails = utilService.loadFromStorage(MAIL_KEY)
    if (!mails || !mails.length) {
        mails = []
        // Create mails as a base for inbox
        for (let i = 0; i < 10; i++) {
            mails.push(_createMail())
        }
        // Create mails for trash
        for (let i = 0; i < 3; i++) {
            mails.push(_createTrashMail())
        }
        // Create mails for starred
        for (let i = 0; i < 3; i++) {
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