const actions = require('./actions-model.js')
const projects = require('../projects/projects-model.js')

module.exports = {
  validateActionId,
  validateAction
}

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