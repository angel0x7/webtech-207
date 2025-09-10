const http = require('http')
const url = require('url')
const qs = require('querystring')
const fs = require('fs')

// HTML
const content = '<!DOCTYPE html>' +
'<html>' +
'    <head>' +
'        <meta charset="utf-8" />' +
'        <title>ECE AST</title>' +
'    </head>' + 
'    <body>' +
'       <p>Hello World!</p>' +
'    </body>' +
'</html>'

const serverHandle = function (req, res) {
  const parsedUrl = url.parse(req.url)
  const path = parsedUrl.pathname
  const queryParams = qs.parse(parsedUrl.query)

  console.log("Path:", path)
  console.log("Query params:", queryParams)

// '/?name=&email= ' route
  if (path === "/" && (queryParams.name || queryParams.email)) {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.write(content)
    res.write(`<p>Bonjour ${queryParams.name || "anonyme"} !</p>`)
    if (queryParams.email) {
      res.write(`<p>Ton email est : ${queryParams.email}</p>`)
    }
    res.end()
  }
  // reedirection from / to /my/path
  else if (path === "/") {
    res.writeHead(302, { Location: "/my/path" })
    res.end()
  } 
  // /my/path route
  else if (path === "/my/path") {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.write(content)
    if (queryParams.name) {
      res.write(`<p>Hello ${queryParams.name}</p>`)
    } else {
      res.write("<p>Bienvenue sur /my/path</p>")
    }
    res.end()
  } 
  // /hello route + query params if there are
  else if (path === "/hello") {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    if (queryParams.name === "TonNom") {
      res.end("Hello " + queryParams.name + "\nPetit texte sur moi.")
    } else if (queryParams.name) {
      res.end("Hello " + queryParams.name)
    } else {
      res.end("Hello anonymous")
    }
  } 
  // /about to read about.json
  else if (path === "/about") {
    try {
      const about = require('./content/about.json')
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(about, null, 2))
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' })
      res.end("Erreur lecture about.json")
    }
  }
  // 404 error if path is something else
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end("404 Not Found")
  }
}

http.createServer(serverHandle).listen(8080, () => {
  console.log("Server running at http://localhost:8080")
})
