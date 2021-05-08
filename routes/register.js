const express = require("express")
const router = express.Router()

const { register } = require("../controller/register")

router.post("/user/register", register)

module.exports = router