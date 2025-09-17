const express = require('express')
const fs = require('fs')
const { promises: fsPromises } = fs
const path = require('path')
const db = require('../db')
const router = express.Router()


router.get('/', (req, res) => {
  res.send(`
    <h1>Bienvenue</h1>
    <p>Links to test:</p>
    <ul>
      <li><a href="http://localhost:8080/">http://localhost:8080/</a></li>
      <li><a href="http://localhost:8080/hello?name=John">http://localhost:8080/hello?name=John</a></li>
      <li><a href="http://localhost:8080/about">http://localhost:8080/about</a></li>
      <li><a href="http://localhost:8080/GETarticles">http://localhost:8080/GETarticles</a></li>
      <li><a href="http://localhost:8080/articles/6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b">http://localhost:8080/articles/6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b</a></li>
    </ul>
  `)
})


router.get('/hello', (req, res) => {//working
  const { name } = req.query
  res.send(name ? `Hello ${name}` : 'Hello Man')
})

router.get('/GETarticles', (req, res) => {//working
  res.json(db.articles)
});

router.get('/about', (req, res) => {

  const filePath = path.join(__dirname, '..', 'content', 'about.json')

  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8')
    res.type('json').send(data)
  } else {
    res.status(404).send('about.json not found')
  }
})


router.get('/articles/:id', (req, res) => {// working
  const article = db.articles.find(a => a.id === req.params.id);
  if (article) {
    res.json(article);
  } else {
    res.status(404).send('Article not found');
  }
});


router.post('/articles', (req, res) => {//working
  const { title, content, author } = req.body;
  if (!title || !content || !author) {
    return res.status(400).send('Title, content, and author are required');
  }

  const newArticle = {
    id: require('crypto').randomUUID(),
    title,
    content,
    author,
    date: new Date().toLocaleDateString()
  };
  db.articles.push(newArticle);
  res.status(201).json(newArticle);
});


router.get('/:filename', async (req, res) => {
  const fileName = req.params.filename + '.json'
  const filePath = path.join(__dirname, '..', 'content', fileName)

  try {
    const data = await fsPromises.readFile(filePath, 'utf8')

    const obj = JSON.parse(data)
    res.json(obj)
  } catch (err) {
    if (err.code === 'ENOENT') {
      res.status(404).send('404 Not Found')
    } else {
      console.error(err)
      res.status(500).send('Server error')
    }
  }
})


module.exports = router
