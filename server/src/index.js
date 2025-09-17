const express = require('express')
const app = express()
const port = 3000
// Other routes paths
const articlesRouter = require('./routes/articles')
const commentsRouter = require('./routes/comments')


app.use(express.json())



app.get('/', (req, res) => {
  res.send(`
    <p><a href="/articles">See Articles</a></p>
    <p><a href="/comments">See Comments</a></p>
    `)
})
app.use('/articles', articlesRouter)
app.use('/comments', commentsRouter)



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

//Other routes
app.use('/articles', articlesRouter)
