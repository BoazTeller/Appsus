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
    getSortedMails,
    getUnreadMailsCount,
    getDraftMailsCount,
    getUnreadAndDraftCounts,
    getLoggedInUser
}

window.ms = mailService

function query(filterBy = getDefaultFilter(), sortBy = getDefaultSortBy()) {
    return storageService.query(MAIL_KEY)
        .then(mails => {
            mails = _getFilteredMails(mails, filterBy)

            mails = getSortedMails(mails, sortBy)

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
        mails = mails.filter(mail => mail.from === loggedinUser.email && mail.sentAt && !mail.removedAt)
    }
    if (filterBy.folder === 'drafts') {
        mails = mails.filter(mail => mail.from === loggedinUser.email && !mail.sentAt && !mail.removedAt)
    }
    if (filterBy.folder === 'trash') {
        mails = mails.filter(mail => mail.removedAt)
    }
    
    // Text search - Mail Subject / Body / From / To
    if (filterBy.txt) {
        mails = _searchMailsByWords(mails, filterBy.txt)
    }

    // Filter by read (true)/unread (false), (skip if null)
if (filterBy.isRead !== null) {
    mails = mails.filter(mail => mail.isRead === filterBy.isRead)
}

    return mails
}

function _searchMailsByWords(mails, txt) {
    const words = txt
        .split(' ')
        .map(word => new RegExp(word, 'i'))

    // Using 'every' means retrieve only mails that contain all searched words
    // Using 'some' will retrieve all means that contain of any of the words
    return mails.filter(mail => 
        words.every(regExp => 
            regExp.test(mail.to) ||
            regExp.test(mail.from) ||
            regExp.test(mail.subject) ||
            regExp.test(mail.body)
        )
    )
}

function getSortedMails(mails, sortBy) {
    // Sort alphabetically by To Sender address
    if (sortBy.to) {
        mails = mails.toSorted((mail1, mail2) => mail1.to.localeCompare(mail2.to) * sortBy.to)
    }
    // Sort alphabetically by From Sender address
    if (sortBy.from) {
        mails = mails.toSorted((mail1, mail2) => mail1.from.localeCompare(mail2.from) * sortBy.from)
    }
    // Sort alphabetically by mail subject
    if (sortBy.subject) {
        mails = mails.toSorted((mail1, mail2) => mail1.subject.localeCompare(mail2.subject) * sortBy.subject)
    }
    // Sort alphabetically by date mail was sent
    if (sortBy.date) {
        mails = mails.toSorted((mail1, mail2) => (mail1.sentAt - mail2.sentAt) * sortBy.date)
    }

    return mails
}

/// Factory and Utility functions ///
function getDefaultFilter() {
    return {
        folder: 'inbox',
        txt: '',
        isRead: null
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
    const isRead = utilService.convertStrToNullableBool(searchParams.get('isRead'))

    return {
        folder,
        txt,
        isRead
    }
}

function getLoggedInUser() {
    return loggedinUser
}

// Initial setup and data creation functions
function _createMails() {
    let mails = utilService.loadFromStorage(MAIL_KEY)
    if (!mails || !mails.length) {
        mails = []
        // Create mails as a base for inbox
        // for (let i = 0; i < 8; i++) {
        //     mails.push(_createMail())
        // }
        // Create mails for trash
        // for (let i = 0; i < 3; i++) {
        //     mails.push(_createTrashMail())
        // }
        // Create mails for starred
        // for (let i = 0; i < 0; i++) {
        //     mails.push(_createStarredMail())
        // }

        mails = getDemoMails()
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

function getDemoMails() {
    return [
        {
            id: "mail001",
            subject: "Exciting News Awaits!",
            body: "We're thrilled to share some exciting updates with you. Stay tuned for more information coming soon.",
            isRead: Math.random() > 0.5,
            isStarred: Math.random() < 0.5,
            sentAt: new Date().getTime(),
            removedAt: null,
            from: "updates@info.com",
            to: loggedinUser.email
        },
        {
            id: "mail002",
            subject: "Your Weekly Tech Update",
            body: "Discover the latest trends in technology and how they can impact your business in our weekly roundup.",
            isRead: Math.random() > 0.5,
            isStarred: Math.random() < 0.5,
            sentAt: new Date().getTime() - Math.floor(Math.random() * 10000000),
            removedAt: null,
            from: "newsletter@techworld.com",
            to: loggedinUser.email
        },
        {
            id: "mail003",
            subject: "Special Invitation: Join Our Webinar",
            body: "You're invited to join our exclusive webinar this Friday. Don't miss out on expert insights and live Q&A.",
            isRead: Math.random() > 0.5,
            isStarred: Math.random() < 0.5,
            sentAt: new Date().getTime() - Math.floor(Math.random() * 200000000),
            removedAt: null,
            from: "events@community.com",
            to: loggedinUser.email
        },
        {
            id: "mail004",
            subject: "Important Account Update",
            body: "Please review the recent changes to our privacy policy and account settings to ensure your information remains secure.",
            isRead: Math.random() > 0.5,
            isStarred: Math.random() < 0.5,
            sentAt: new Date().getTime() - Math.floor(Math.random() * 500000000),
            removedAt: null,
            from: "support@service.com",
            to: loggedinUser.email
        },
        {
            id: "mail005",
            subject: "Thank You For Your Purchase",
            body: "We appreciate your business and hope you enjoy your new purchase. Let us know if you have any questions.",
            isRead: Math.random() > 0.5,
            isStarred: Math.random() < 0.5,
            sentAt: new Date().getTime() - Math.floor(Math.random() * 1000000000),
            removedAt: null,
            from: "sales@store.com",
            to: loggedinUser.email
        },
        {
            id: "mail006",
            subject: "Exclusive Deal Just for You!",
            body: "As a valued subscriber, we've included a special deal in this email. Check it out before it expires!",
            isRead: Math.random() > 0.5,
            isStarred: Math.random() < 0.5,
            sentAt: new Date().getTime() - Math.floor(Math.random() * 1500000000),
            removedAt: null,
            from: "promotions@deals.com",
            to: loggedinUser.email
        },
        {
            id: "mail007",
            subject: "Welcome to the Community!",
            body: "Thank you for signing up to our community! We're glad to have you and look forward to engaging with you.",
            isRead: Math.random() > 0.5,
            isStarred: Math.random() < 0.5,
            sentAt: new Date().getTime() - Math.floor(Math.random() * 2000000000),
            removedAt: null,
            from: "community@forums.com",
            to: loggedinUser.email
        },
        {
            id: "mail008",
            subject: "System Maintenance Notification",
            body: "Please be advised that we will have a scheduled system maintenance this weekend. We apologize for any inconvenience.",
            isRead: Math.random() > 0.5,
            isStarred: Math.random() < 0.5,
            sentAt: new Date().getTime() - Math.floor(Math.random() * 2500000000),
            removedAt: null,
            from: "it.support@techsupport.com",
            to: loggedinUser.email
        },
        {
            id: "mail009",
            subject: "Happy Birthday!",
            body: "Wishing you all the best on your special day! Have a wonderful birthday full of joy and laughter.",
            isRead: Math.random() > 0.5,
            isStarred: Math.random() < 0.5,
            sentAt: new Date().getTime() - Math.floor(Math.random() * 3000000000),
            removedAt: null,
            from: "greetings@wellwishes.com",
            to: loggedinUser.email
        },
        {
            id: "mail010",
            subject: "Your Subscription Has Been Renewed",
            body: "",
            isRead: Math.random() > 0.5,
            isStarred: Math.random() < 0.5,
            sentAt: new Date().getTime() - Math.floor(Math.random() * 3500000000),
            removedAt: null,
            from: "subscriptions@online.com",
            to: loggedinUser.email
        },
        {
            id: "mail011",
            subject: "Your Monthly Statement is Ready",
            body: "Please review your latest monthly statement. We have noticed some unusual activity that might interest you.",
            isRead: Math.random() > 0.5,
            isStarred: Math.random() < 0.5,
            sentAt: new Date().getTime() - Math.floor(Math.random() * 4000000000),
            removedAt: null,
            from: "finance@bank.com",
            to: loggedinUser.email
        },
        {
            id: "mail012",
            subject: "Reminder: Upcoming Payment Due",
            body: "Just a friendly reminder that your next payment is due soon. Please ensure your payment method is up to date.",
            isRead: Math.random() > 0.5,
            isStarred: Math.random() < 0.5,
            sentAt: new Date().getTime() - Math.floor(Math.random() * 4500000000),
            removedAt: null,
            from: "billing@services.com",
            to: loggedinUser.email
        },
        {
            id: "mail013",
            subject: "New Features Available Now",
            body: "We've rolled out new features that we think you'll love. Take a look and let us know what you think!",
            isRead: Math.random() > 0.5,
            isStarred: Math.random() < 0.5,
            sentAt: new Date().getTime() - Math.floor(Math.random() * 5000000000),
            removedAt: null,
            from: "updates@software.com",
            to: loggedinUser.email
        },
        {
            id: "mail014",
            subject: "Action Required: Update Your Profile",
            body: "To continue receiving the best experience, please update your profile with your latest information.",
            isRead: Math.random() > 0.5,
            isStarred: Math.random() < 0.5,
            sentAt: new Date().getTime() - Math.floor(Math.random() * 5500000000),
            removedAt: null,
            from: "support@accounts.com",
            to: loggedinUser.email
        },
        {
            id: "mail015",
            subject: "You're Invited: Exclusive Event",
            body: "Join us for an exclusive event that you won't want to miss. RSVP soon as space is limited!",
            isRead: Math.random() > 0.5,
            isStarred: Math.random() < 0.5,
            sentAt: new Date().getTime() - Math.floor(Math.random() * 6000000000),
            removedAt: null,
            from: "events@exclusive.com",
            to: loggedinUser.email
        },
        {
            id: "mail016",
            subject: "Thank You for Attending",
            body: "Thank you for attending our recent event. We hope you found it insightful and enjoyable.",
            isRead: Math.random() > 0.5,
            isStarred: Math.random() < 0.5,
            sentAt: new Date().getTime() - Math.floor(Math.random() * 6500000000),
            removedAt: null,
            from: "feedback@events.com",
            to: loggedinUser.email
        },
        {
            id: "mail017",
            subject: "Your Opinion Matters",
            body: "We value your feedback. Please take a moment to complete our short survey and let us know how we're doing.",
            isRead: Math.random() > 0.5,
            isStarred: Math.random() < 0.5,
            sentAt: new Date().getTime() - Math.floor(Math.random() * 7000000000),
            removedAt: null,
            from: "surveys@feedback.com",
            to: loggedinUser.email
        },
        {
            id: "mail018",
            subject: "Important Security Alert",
            body: "Please be aware of recent phishing attempts. Do not share your personal information.",
            isRead: Math.random() > 0.5,
            isStarred: Math.random() < 0.5,
            sentAt: new Date().getTime() - Math.floor(Math.random() * 7500000000),
            removedAt: null,
            from: "security@onlineprotection.com",
            to: loggedinUser.email
        },
        {
        id: "mail019",
            subject: "Annual Report Released",
            body: "Our annual report is now available. Discover key insights into our performance and strategic direction.",
            isRead: Math.random() > 0.5,
            isStarred: Math.random() < 0.5,
            sentAt: new Date().getTime() - Math.floor(Math.random() * 8000000000),
            removedAt: null,
            from: "communications@corp.com",
            to: loggedinUser.email
        },
        {
            id: "mail020",
            subject: "Feature Request Approved",
            body: "Your request for the new feature has been approved! Expect it in the next update.",
            isRead: Math.random() > 0.5,
            isStarred: Math.random() < 0.5,
            sentAt: new Date().getTime() - Math.floor(Math.random() * 8500000000),
            removedAt: null,
            from: "development@innovations.com",
            to: loggedinUser.email
        }
    ]
}