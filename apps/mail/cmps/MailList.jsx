{/* <MailList>
• Renders a list of <MailPreview> pass down a mail prop */}

export function MailList({ mails }) {

    return (
        <table className="mail-list">
            <tbody>
                {mails.map(mail => 
                    <MailPreview 
                        key={mail.id}
                        mail={mail}
                    />
                )}
            </tbody>
        </table>
    )
}
