const express = require('express')
const fs = require('fs')
const { promises: fsPromises } = fs
const path = require('path')
const db = require('../db')
const router = express.Router()

// GET /
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

// GET /hello
router.get('/hello', (req, res) => {//working
  const { name } = req.query
  res.send(name ? `Hello ${name}` : 'Hello Man')
})

router.get('/GETarticles', (req, res) => {//working
  res.json(db.articles)
});
// GET /about
router.get('/about', (req, res) => {

  const filePath = path.join(__dirname, '..', 'content', 'about.json')

  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8')
    res.type('json').send(data)
  } else {
    res.status(404).send('about.json not found')
  }
})

// GET /articles/:id
router.get('/articles/:id', (req, res) => {// working
  const article = db.articles.find(a => a.id === req.params.id);
  if (article) {
    res.json(article);
  } else {
    res.status(404).send('Article not found');
  }
});

// POST /articles
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


// GET /articles/:articleId/comments
router.get('/articles/:articleId/comments', (req, res) => {//working
  const { articleId } = req.params;
  const article = db.articles.find(a => a.id === articleId);

  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }

  const comments = db.comments.filter(c => c.articleId === articleId);
  res.json(comments);
});

// POST /articles/:articleId/comments
router.post('/articles/:articleId/comments', (req, res) => {//working
  const { articleId } = req.params;
  const { content, author } = req.body;

  const article = db.articles.find(a => a.id === articleId);
  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }

  if (!content || !author) {
    return res.status(400).json({ error: 'Content and author are required' });
  }

  const newComment = {
    id: require('crypto').randomUUID(),
    timestamp: Math.floor(Date.now() / 1000),
    content,
    articleId,
    author
  };

  db.comments.push(newComment);
  res.status(201).json(newComment);
});

// GET /articles/:articleId/comments/:commentId
router.get('/articles/:articleId/comments/:commentId', (req, res) => {//working
  const { articleId, commentId } = req.params;

  const article = db.articles.find(a => a.id === articleId);
  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }

  const comment = db.comments.find(
    c => c.articleId === articleId && c.id === commentId
  );

  if (!comment) {
    return res.status(404).json({ error: 'Comment not found for this article' });
  }

  res.json(comment);
});




module.exports = router
