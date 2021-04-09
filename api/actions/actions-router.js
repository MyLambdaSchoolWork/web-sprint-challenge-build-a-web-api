// Write your "actions" router here!
const express = require('express')

const actions = require('./actions-model.js')

const {
  validateActionId,
  validateAction
} = require('./actions-middleware.js')

const router = express.Router()


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