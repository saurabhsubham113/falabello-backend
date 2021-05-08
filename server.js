if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}
require("./DB/dbConfig")

const express = require("express")
const cors = require("cors")

//routes
const userRoute = require("./routes/register")
const adminRoute = require("./routes/admin")

//app creation
const app = express()

app.use(cors("*"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (process.env.NODE_ENV !== "production") {
    app.use(require("morgan")("dev"))
}

//routing
app.use("/api", userRoute)
app.use("/api", adminRoute)

const port = process.env.PORT
app.listen(port, () => {
    console.log(`server listening on port ${port}`)
})
