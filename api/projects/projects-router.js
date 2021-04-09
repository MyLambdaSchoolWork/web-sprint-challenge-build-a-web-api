// Write your "projects" router here!
const express = require('express')

const projects = require('./projects-model.js')

const router = express.Router()

function validiateProjectId(req, res, next){
  projects.get(req.params.id)
    .then( project => {
      if(project){
        req.project = project
        next()
      } else {
        res.status(404).json({message: `Could not find project with id ${req.params.id}`})
      }
    })
    .catch( error => {
      res.status(500).json({message: 'Server error', error})
    })
}

function validateProject(req, res, next){
  const { name, description, completed } = req.body
  if(name && description){
    // completed is optional and defaults to false if not provided
    if(completed){
      req.newProject = { name, description, completed: completed === true ? 1 : 0 }
    } else {
      req.newProject = { name, description, completed: 0 }
    }
    next()
  } else {
    res.status(400).json({message: 'Project name and description are required'})
  }
}

router.get('/', (_, res) => {
  projects.get()
    .then( projects => {
      res.status(200).json(projects)
    })
    .catch( error => {
      res.status(500).json({message: 'Server error', error})
    })
})

router.get('/:id', validiateProjectId, (req, res) => {
  res.status(200).json(req.project)
})

router.post('/', validateProject, (req, res) => {
  projects.insert(req.newProject)
    .then( project => {
      res.status(201).json(project)
    })
    .catch( error => {
      console.log({message: 'Server error', error})
    })
})

router.put('/:id', validateProject, validiateProjectId, (req, res) => {
  projects.update(req.params.id, req.newProject)
    .then( updated => {
      res.status(200).json(updated)
    })
    .catch( error => {
      res.status(500).json({message: 'Server error', error})
    })
})

router.delete('/:id', validiateProjectId, (req, res) => {
  projects.remove(req.params.id)
    .then( () => {
      res.status(204).json() // unfortunatly the readme says not to return :(
      // that's also why I'm using 204 instead of 200

      // if I did return it would be res.stauts(200).json(req.project)
    })
    .catch( error => {
      res.status(500).json({message: 'Server error', error})
    })
})

module.exports = router