const express = require('express');
const helmet = require('helmet')

const projectsRouter = require('./projects/projects-router')
const server = express();
server.use(express.json())
server.use(helmet()) // saw helmet in package.json so thought I'd add it
server.use('/api/projects', projectsRouter)

// Complete your server here!
// Do NOT `server.listen()` inside this file!

module.exports = server;
