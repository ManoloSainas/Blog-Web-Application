import express from 'express';
import bodyParser from 'body-parser'; // viene utilizzato per gestire il passaggio di informazioni tra FE e BE

// Gestione dinamica dell'url dell'utente (per selezionare in modo corretto determinate cartelle e file)
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

// Creazione app e porta
const app = express();
const port = 3000;

// Array contenente tutti i post
const posts = [];
// Indice che indica il post mostrato nella homepage
let selectedIndex = 0;

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/bootstrap-icons', express.static(__dirname + '/node_modules/bootstrap-icons/font'));

// Get della homepage
app.get("/", (req, res) => {
  res.render("index", { posts, selectedIndex });
});

// Get per spostarsi verso il post successivo (dopo aver premuto la freccia a destra)
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

// Get per spostarsi verso il post precedente (dopo aver premuto la freccia a sinistra)
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

// Get per accedere alla schermata in cui poter editare il post selezionato
app.get('/editPost', (req, res) => {
  const index = req.query.index;
  res.render('editPost.ejs', { posts, index });
});

// Post per inserire un nuovo "post"
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

// Post per confermare le modifiche effettuate su un determinato post 
app.post('/editPost', (req, res) => {
  const index = req.body.index;
  if (posts[index]) {
    posts[index].title = req.body.title.trim();
    posts[index].body = req.body.blogPost.trim();
  }
  res.redirect('/');
});

// Post per cancellare un determinato "post" selezionato
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
