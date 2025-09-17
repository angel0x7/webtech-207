const express = require('express')
const routes = require('/src/handles')

const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use('/', routes)


const PORT = 8080
app.listen(PORT, () => {
  console.log('Server running at:')
  console.log(`http://localhost:${PORT}/`)
})
