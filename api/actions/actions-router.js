// Write your "actions" router here!
const express = require('express')

const actions = require('./actions-model.js')
const projects = require('../projects/projects-model.js')

const router = express.Router()

function validateActionId(req, res, next){
  actions.get(req.params.id)
    .then( action => {
      if(action){
        req.action = action
        next()
      } else {
        res.status(404).json({message: `Could not find action with id ${req.params.id}`})
      }
    })
    .catch( error => {
      res.status(500).json({message: 'Server error', error: error.toString()})
    })
}

async function validateAction(req, res, next){
  const { project_id, description, notes, completed } = req.body
  // I'd like to reuse validateProjectId but I can't really do that without it being really jank
  if(description && description.length < 128 && notes){
    const project = await projects.get(project_id)
    
    if(project){
      req.project = project // not needed but it's there if I do need it ig
      
      req.newAction = {
        project_id,
        description,
        notes,
        completed: completed === true ? 1 : 0
      }
      next()

    } else {
      res.status(404).json({message: `Could not find project with id ${project_id}`})
    }

  } else {
    res.status(400).json({message: 'Description or notes missing, or description longer than 128 chars'})
  }
}

router.get('/', (_, res) => {
  actions.get()
    .then( actions => {
      res.status(200).json(actions)
    })
    .catch( error => {
      res.status(500).json({message: 'Server error', error: error.toString()})
    })
})

router.get('/:id', validateActionId, (req, res) => {
  res.status(200).json(req.action)
})

router.post('/', validateAction, (req, res) => {
  actions.insert(req.newAction)
    .then( newAction => {
      res.status(200).json(newAction)
    })
    .catch( error => {
      res.status(500).json({message: 'Server error', error: error.toString()})
    })
})

router.put('/:id', validateAction, validateActionId, (req, res) => {
  actions.update(req.params.id, req.newAction)
    .then( updated => {
      res.status(200).json(updated)
    })
    .catch( error => {
      res.status(500).json({message: 'Server error', error: error.toString()})
    })
})

router.delete('/:id', validateActionId, (req, res) => {
  actions.remove(req.params.id)
    .then( () => {
      res.status(204).json()
    })
    .catch( error => {
      res.status(500).json({message: 'Server error', error: error.toString()})
    })
})

module.exports = router