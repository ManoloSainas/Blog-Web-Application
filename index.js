import express from "express"
import bodyParser from "body-parser"

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static("public"))

app.get("/", (req, res) => {
    res.render("index.ejs")
})

app.post("/submit", (req, res) => {
    res.render("index.ejs", {
        title: req.body["title"],
        bodyPost: req.body["blogPost"]
    })
})

app.listen(port, () => 
{
    console.log(`Port number: ${port}`)
})