import express from 'express'
import ProjectDetailsController from '../controllers/projectDetailsController.js'

const router = new express.Router()


router.post('/create',  ProjectDetailsController.create)
router.put('/update/:id([0-9]+)', ProjectDetailsController.update)
router.get('/getall', ProjectDetailsController.getAll)
router.get('/getone/:id([0-9]+)', ProjectDetailsController.getOne)
router.get('/getproject/:projectId([0-9]+)', ProjectDetailsController.getProject)
router.delete('/delete/:projectId',  ProjectDetailsController.delete)

export default router