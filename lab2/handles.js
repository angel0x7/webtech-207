// ./handles.js
const url = require('url')
const qs = require('querystring')
const fs = require('fs')
const path = require('path')

function serverHandle(req, res) {
  const route = url.parse(req.url)
  const pathname = route.pathname
  const params = qs.parse(route.query)
// default route
  if (pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(`
      <h1>Bienvenue</h1>
      <p>Links to test:</p>
      <ul>
        <li><a href="http://localhost:8080/">http://localhost:8080/</a></li>
        <li><a href="http://localhost:8080/hello?name=John">http://localhost:8080/hello?name=John</a></li>
        <li><a href="http://localhost:8080/about">http://localhost:8080/about</a></li>
      </ul>
    `)
  }
// hello route
  else if (pathname === '/hello') {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    if ('name' in params) {   
        res.end('Hello ' + params.name)
      
    } else {
      res.end('Hello anonymous')
    }
  }
// about route
  else if (pathname === '/about') {
    const filePath = path.join(__dirname, 'content', 'about.json')
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8')
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(data)
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('about.json not found')
    }
  }

  else {
    const fileName = pathname.replace('/', '') + '.json'
    const filePath = path.join(__dirname, 'content', fileName)

    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8')
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(data)
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('404 Not Found')
    }
  }
}

module.exports = { serverHandle }
