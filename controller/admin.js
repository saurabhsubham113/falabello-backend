const jwt = require('jsonwebtoken')
const { promotionalEmail } = require("../mail/sendMail")
const { Admin, User } = require('../models/user')
const createResponse = require('../utils')

exports.signUp = async (req, res) => {

    const admin = new Admin(req.body)

    try {
        await admin.save()

        res.send(createResponse(undefined, admin))
    } catch (error) {
        res.send(createResponse(error.message))
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        const admin = await Admin.findByCredentials(email, password)
        const token = await admin.generateAuthToken()

        res.send(createResponse(undefined, { user: admin, token }))

    } catch (error) {
        res.send(createResponse({ error, msg: ' Please check your email or Password' }))
    }
}

//getting a list of all user
exports.getAllUser = async (req, res) => {
    try {
        const user = await User.find({})
        res.send(createResponse(undefined, user))
    } catch (error) {
        res.send(createResponse(error.message))
    }
}

exports.sendAll = async (req, res) => {
    const { sub, message } = req.body
    try {
        const users = await User.find({})
        if (users.length <= 0)
            throw new Error("No user found")

        const senderEmails = users.map(user => {
            return user.email
        })

        await promotionalEmail(senderEmails, sub, message)
        res.send(createResponse(undefined, "successfully sent"))
    } catch (error) {
        res.send(createResponse(error.message));

    }

}
//middlewares
exports.auth = async (req, res, next) => {
    try {
        const token = req.headers['x-auth-token']
        const decode = jwt.verify(token, process.env.TOKEN_SECRET)
        //getting user from the token provided
        const user = await Admin.findOne({ _id: decode._id, 'tokens.token': token })
        if (!user) throw new Error('please authenticate')
        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.send(utils.createResponse(e.message))
    }
}
