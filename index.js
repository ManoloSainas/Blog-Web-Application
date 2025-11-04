import express from 'express';
import bodyParser from 'body-parser';

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
const posts = [];
let selectedIndex = 0;

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/bootstrap-icons', express.static(__dirname + '/node_modules/bootstrap-icons/font'));

app.get("/", (req, res) => {
  res.render("index", { posts, selectedIndex });
});

app.get("/next", (req, res) => {
  if (posts.length > 0) {
    if (selectedIndex < posts.length - 1) {
      selectedIndex++;
    } else {
      selectedIndex = 0; 
    }
  }
  res.redirect("/");
});

app.get("/prev", (req, res) => {
  if (posts.length > 0) {
    if (selectedIndex > 0) {
      selectedIndex--;
    } else {
      selectedIndex = posts.length - 1; 
    }
  }
  res.redirect("/");
});

app.get('/editPost', (req, res) => {
  const index = req.query.index;
  res.render('editPost.ejs', { posts, index });
});

app.post('/submit', (req, res) => {
  const title = req.body.title.trim();
  const body = req.body.blogPost.trim();
  const date = new Date().toLocaleString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });;
  if (title && body) {
    posts.push({ title, body, date });
  }
  res.redirect('/');
});

app.post('/editPost', (req, res) => {
  const index = req.body.index;
  if (posts[index]) {
    posts[index].title = req.body.title.trim();
    posts[index].body = req.body.blogPost.trim();
  }
  res.redirect('/');
});

app.post('/deletePost', (req, res) => {
  const index = parseInt(req.body.index);
  if (posts[index]) {
    posts.splice(index, 1);

    if (selectedIndex >= posts.length) {
      selectedIndex = posts.length - 1;
    }
  }

  if (posts.length === 0) {
    selectedIndex = 0;
  }

  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Port number: ${port}`);
});
