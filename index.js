import express from "express"
import bodyParser from "body-parser"

const app = express()
const port = 3000
const posts = []

app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static("public"))

app.get("/", (req, res) => {
    res.render("index.ejs", {posts})
})

app.post("/submit", (req, res) => {
    posts.push({ title: req.body.title, body: req.body.blogPost });
    res.redirect("/");
})

app.listen(port, () => 
{
    console.log(`Port number: ${port}`)
})