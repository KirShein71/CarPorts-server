import express from 'express'

import user from './user.js'
import project from './project.js'
import projectmaterials from './projectmaterials.js'
import materials from './materials.js'
import details from './details.js'
import projectdetails from './projectdetails.js'
import installers from './installers.js' 
import projectinstallers from './projectinstallers.js'



const router = new express.Router()

router.use('/user', user)
router.use('/project', project)
router.use('/projectmaterials', projectmaterials)
router.use('/materials', materials)
router.use('/details', details)
router.use('/projectdetails', projectdetails)
router.use('/installers', installers)
router.use('/projectinstallers', projectinstallers)



export default router