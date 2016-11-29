#!/usr/bin/env node

var http = require('http')
var server = http.createServer()
var exec = require('child_process').exec
var port = +(process.argv[2] || '8000')
var open = require('open')

var data = ''
process.stdin.on('data', append)
process.stdin.on('end', start)

function append (chunk) { data += chunk }

function start () {
  transform()
  open(`http://localhost:${port}`)
}

server.on('request', serve)

function serve (q, r) {
  r.setHeader('Content-Type', 'text/html; charset=utf-8')
  r.setHeader('Access-Control-Allow-Origin', '*')
  r.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  )
  r.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  if (q.method === 'OPTIONS') {
    r.end()
  } else {
    r.end(data)
  }
}

server.listen(port)

function transform () {
  if (data.indexOf('<') === 0) return
  data = `<!DOCTYPE html>
    <meta name="viewport" content="width=device-width,height=device-height, initial-scale=1.0,maximum-scale=1.0,user-scalable=0">
    <html>
    <body></body><script>${data}</script></html>`
}
