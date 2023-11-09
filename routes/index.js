import express from 'express'

import user from './user.js'
import project from './project.js'
import projectmaterials from './projectmaterials.js'
import materials from './materials.js'



const router = new express.Router()

router.use('/user', user)
router.use('/project', project)
router.use('/projectmaterials', projectmaterials)
router.use('/materials', materials)



export default router