const projects = require('./projects-model.js')

module.exports = {
  validateProjectId,
  validateProject
}

function validateProjectId(req, res, next){
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
      res.status(500).json({message: 'Server error', error: error.toString()})
    })
}

function validateProject(req, res, next){
  const { name, description, completed } = req.body
  if(name && description){
    // completed is optional and defaults to false if not provided
    req.newProject = {
      name,
      description,
      completed: completed === true ? 1 : 0
    }
    next()
  } else {
    res.status(400).json({message: 'Project name and description are required'})
  }
}