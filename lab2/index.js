// ./index.js
const http = require('http')
const handles = require('./handles')

http
  .createServer(handles.serverHandle)
  .listen(8080, () => {
    console.log('Server running at: \n')
    console.log('http://localhost:8080/')
    console.log('http://localhost:8080/hello?name=John')
    console.log('http://localhost:8080/about')
  })
