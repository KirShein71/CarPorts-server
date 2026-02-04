import express from 'express'
import ProjectDetailsController from '../controllers/projectDetailsController.js'

const router = new express.Router()


router.post('/create',  ProjectDetailsController.create)
router.put('/createColor/:id([0-9]+)', ProjectDetailsController.createColor)
router.post('/addToProduction',  ProjectDetailsController.addToProduction)
router.put('/update/:id([0-9]+)', ProjectDetailsController.update)
router.get('/getall', ProjectDetailsController.getAll)
router.get('/getone/:id([0-9]+)', ProjectDetailsController.getOne)
router.delete('/delete/:projectId',  ProjectDetailsController.delete)
router.delete('/deleteOneProjectDetail/:id([0-9]+)',  ProjectDetailsController.deleteOneProjectDetail)

export default router