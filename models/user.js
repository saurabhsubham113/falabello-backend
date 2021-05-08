const mongoose = require('mongoose')
const validator = require("validator")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// user schema
const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('invalid email')
            }
        }
    }

})


//admin schema
const AdminSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('invalid email')
            }
        }
    },
    role: {
        type: Number,
        default: 1
    },
    password: {
        type: String,
        trim: true,
        minlength: 4,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

})

//it is used to create methods on instances not on models(User) also called instance method
//generating jwt token for authentication
AdminSchema.methods.generateAuthToken = async function () {
    const user = this

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
    user.tokens = user.tokens.concat({ token })

    await user.save()

    return token
}

//creating your own custom function, it is accesible on model also called model function
//finding profile using email and password 
AdminSchema.statics.findByCredentials = async (email, password) => {
    const admin = await Admin.findOne({ email: email })

    if (!admin)
        throw new Error('unable to login')

    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch)
        throw new Error('unable to login')

    return admin
}

//hashing the password before saving it to database
AdminSchema.pre('save', async function (next) {
    const user = this

    //if password is modified then only hash the password 
    if (user.isModified('password'))
        user.password = await bcrypt.hash(user.password, 10)

    next()
})


const User = mongoose.model('User', UserSchema)
const Admin = mongoose.model("Admin", AdminSchema)


module.exports = { User, Admin }