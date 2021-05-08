const express = require("express")
const router = express.Router()
const { auth, login, signUp, getAllUser, sendAll } = require("../controller/admin")

router.post("/admin/login", login)
router.post("/admin/signup", signUp)

router.get("/admin/alluser", auth, getAllUser)

router.post("/admin/sendall", auth, sendAll)

module.exports = router