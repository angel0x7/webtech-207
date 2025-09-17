const express = require('express')
const router = express.Router()
const db = require('./db')  // <-- importation

// GET /articles/:articleId/comments
router.get('/:articleId/comments', (req, res) => {
  const comments = db.comments.filter(c => c.articleId === req.params.articleId)
  res.json(comments)
})

// POST /articles/:articleId/comments
router.post('/:articleId/comments', (req, res) => {
  const { content, author } = req.body
  const newComment = {
    id: Date.now().toString(),
    timestamp: Date.now(),
    content,
    articleId: req.params.articleId,
    author
  }
  db.comments.push(newComment)
  res.status(201).json(newComment)
})

// GET /articles/:articleId/comments/:commentId
router.get('/:articleId/comments/:commentId', (req, res) => {
  const comment = db.comments.find(
    c => c.articleId === req.params.articleId && c.id === req.params.commentId
  )
  if (!comment) return res.status(404).json({ error: 'Comment not found' })
  res.json(comment)
})

module.exports = router
