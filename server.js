const express = require('express')
const http = require('http')
const path = require('path')
const reload = require('reload')
const bodyParser = require('body-parser')
const logger = require('morgan')
const { exec } = require('child_process')
const app = express()
app.use(express.static('public'))
const publicDir = path.join(__dirname, 'public')

const parseLevels = require('./lib/parse_levels')
app.set('port', process.env.PORT || 3000)
app.use(logger('dev'))
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.sendFile(path.join(publicDir, 'index.html'))
})
app.get('/level', function (req, res) {
  res.json(
    parseLevels())
})

const server = http.createServer(app)

// Reload code here
reload(app).then(function (reloadReturned) {
  // reloadReturned is documented in the returns API in the README
  exec('./install', (error, stdout, stderr) => error ? console.error('error', error) : console.log('no error', stdout))
  // Reload started, start web server
  server.listen(app.get('port'), function () {
    console.log('Web server listening on port ' + app.get('port'))
  })
}).catch(function (err) {
  console.error('Reload could not start, could not start server/sample app', err)
})
