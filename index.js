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

app.get("/editPost", (req, res) => {
    const index = req.query.index; 
    res.render("editPost.ejs", {posts, index})
})

app.post("/submit", (req, res) => {
    const title = req.body.title.trim()
    const body = req.body.blogPost.trim()
    if(title && body){
           posts.push({ title, body });
    }
    res.redirect("/");
})

app.post("/editPost", (req, res) => {
    const index = req.body.index;
    if (posts[index]) {
        posts[index].title = req.body.title.trim();
        posts[index].body = req.body.blogPost.trim();
    }
    res.redirect("/");
});

app.post("/deletePost", (req, res) => {
    const index = req.body.index;
    posts.splice(index, 1);
    res.redirect("/");
})

app.listen(port, () => 
{
    console.log(`Port number: ${port}`)
})