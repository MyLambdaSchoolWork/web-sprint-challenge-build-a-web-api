const express = require('express');
const helmet = require('helmet')

const projectsRouter = require('./projects/projects-router.js')
const actionsRouter = require('./actions/actions-router.js')

const server = express();

server.use(express.json())
server.use(helmet()) // saw helmet in package.json so thought I'd add it
server.use('/api/projects', projectsRouter)
server.use('/api/actions', actionsRouter)

// Complete your server here!
// Do NOT `server.listen()` inside this file!

module.exports = server;
