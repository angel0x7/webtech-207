const express = require('express')
const router = express.Router()
const db = require('./db')  

router.get('/', (req, res) => {
  res.json(db.articles)
})

router.post('/', (req, res) => {
  const { title, content, author } = req.body
  const newArticle = {
    id: Date.now().toString(),
    title,
    content,
    date: new Date().toLocaleDateString(),
    author
  } 
  db.articles.push(newArticle)
  res.status(201).json(newArticle)
})

router.get('/:articleId', (req, res) => {
  const article = db.articles.find(a => a.id === req.params.articleId)
  if (!article) return res.status(404).json({ error: 'Article not found' })
  res.json(article)
})

module.exports = router
