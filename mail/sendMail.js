const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SG_API)

const welcomeMail = async (senderEmail) => {

    const msg = {
        to: senderEmail,
        from: { name: "", email: process.env.EMAIL },
        subject: 'Sending with SendGrid is Fun',
        templateId: "d-653ddceca6f540ef9fafdddd43e07f02",

    }

    sgMail.send(msg)
        .then(res => "successfully message delivered")
        .catch(err => err.message)

}

const promotionalEmail = (senderEmails = [], sub, message) => {

    const msg = {
        to: senderEmails,
        from: { name: "dev mode", email: process.env.EMAIL },
        subject: sub,
        text: message
    }

    sgMail.send(msg)
        .then(res => "successfully message delivered")
        .catch(err => err.message)
}


module.exports = { welcomeMail, promotionalEmail }