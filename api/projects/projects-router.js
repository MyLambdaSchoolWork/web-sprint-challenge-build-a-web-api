// Write your "projects" router here!
const express = require('express')

const projects = require('./projects-model.js')

const {
  validateProjectId,
  validateProject
} = require('./projects-middleware.js')

const router = express.Router()

router.get('/', (_, res) => {
  projects.get()
    .then( projects => {
      res.status(200).json(projects)
    })
    .catch( error => {
      res.status(500).json({message: 'Server error', error: error.toString()})
    })
})

router.get('/:id', validateProjectId, (req, res) => {
  res.status(200).json(req.project)
})

router.get('/:id/actions', validateProjectId, (req, res) => {
  projects.getProjectActions(req.params.id)
    .then( actions => {
      res.status(200).json(actions)
    })
    .catch( error => {
      res.status(500).json({message: 'Server error', error: error.toString()})
    })
})

router.post('/', validateProject, (req, res) => {
  projects.insert(req.newProject)
    .then( project => {
      res.status(201).json(project)
    })
    .catch( error => {
      console.log({message: 'Server error', error: error.toString()})
    })
})

router.put('/:id', validateProject, validateProjectId, (req, res) => {
  projects.update(req.params.id, req.newProject)
    .then( updated => {
      res.status(200).json(updated)
    })
    .catch( error => {
      res.status(500).json({message: 'Server error', error: error.toString()})
    })
})

router.delete('/:id', validateProjectId, (req, res) => {
  projects.remove(req.params.id)
    .then( () => {
      res.status(204).json() // unfortunatly the readme says not to return :(
      // that's also why I'm using 204 instead of 200

      // if I did return it would be res.stauts(200).json(req.project)
    })
    .catch( error => {
      res.status(500).json({message: 'Server error', error: error.toString()})
    })
})

module.exports = router