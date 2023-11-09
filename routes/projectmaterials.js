import express from 'express'
import ProjectMaterialsController from '../controllers/projectMaterialsController.js'

const router = new express.Router()


router.post('/create',  ProjectMaterialsController.create)
router.get('/getall', ProjectMaterialsController.getAll)
router.get('/getone/:id([0-9]+)', ProjectMaterialsController.getOne)
router.get('/getproject/:projectId([0-9]+)', ProjectMaterialsController.getProject)

export default router