const { User } = require("../models/user")
const { welcomeMail } = require("../mail/sendMail")
const createResponse = require("../utils")

exports.register = async (req, res) => {
    const user = new User(req.body)

    try {
        //saving user to the database
        await user.save()
        //invoking the welcome email
        await welcomeMail(req.body.email)

        //sending response to the cliend
        res.send(createResponse(undefined, "sucessfully registered"))

    } catch (e) {
        res.send(createResponse(e.message))
    }

}
