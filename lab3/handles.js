const express = require('express')
const fs = require('fs')
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


router.get('/hello', (req, res) => {
  const { name } = req.query
  res.send(name ? `Hello ${name}` : 'Hello anonymous')
})


router.get('/about', (req, res) => {

  const filePath = path.join(__dirname, '..', 'about.json')

  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8')
    res.type('json').send(data)
  } else {
    res.status(404).send('about.json not found')
  }
})



router.get('/:filename', (req, res) => {
  const fileName = req.params.filename + '.json'
  const filePath = path.join(__dirname, '..', 'content', fileName)

  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8')
    res.type('json').send(data)
  } else {
    res.status(404).send('404 Not Found')
  }
})

module.exports = router
