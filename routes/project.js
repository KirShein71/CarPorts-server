import express from 'express'
import ProjectController from '../controllers/projectController.js'



const router = new express.Router()

router.get('/getall', ProjectController.getAll)
router.get('/getone/:id([0-9]+)', ProjectController.getOne)
router.post('/create',  ProjectController.create)
router.put('/update/:id([0-9]+)',  ProjectController.update)
router.delete('/delete/:id([0-9]+)',  ProjectController.delete)






export default router