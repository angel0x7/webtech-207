const express = require('express')
const fs = require('fs')
const { promises: fsPromises } = fs
const path = require('path')
const db = require('./db')
const router = express.Router()


router.get('/', (req, res) => {
  res.send(`
    <h1>Bienvenue</h1>
    <p>Links to test:</p>
    <ul>
      <li><a href="http://localhost:8080/">http://localhost:8080/</a></li>
      <li><a href="http://localhost:8080/hello?name=John">http://localhost:8080/hello?name=John</a></li>
      <li><a href="http://localhost:8080/about">http://localhost:8080/about</a></li>
    </ul>
  `)
})


router.get('/hello', (req, res) => {//working
  const { name } = req.query
  res.send(name ? `Hello ${name}` : 'Hello Man')
})

router.get('/articles', (req, res) => {//working
  res.json(db.articles)
});

router.get('/about', (req, res) => {// not working

  const filePath = path.join(__dirname, '..', 'about.json')

  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8')
    res.type('json').send(data)
  } else {
    res.status(404).send('about.json not found')
  }
})


router.get('/articles/:id', (req, res) => {
  const article = db.articles.find(a => a.id === req.params.id);
  if (article) {
    res.json(article);
  } else {
    res.status(404).send('Article not found');
  }
});



router.get('/:filename', async (req, res) => {
  const fileName = req.params.filename + '.json'
  const filePath = path.join(__dirname, 'content', fileName)

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
