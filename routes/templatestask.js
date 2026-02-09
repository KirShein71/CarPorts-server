import express from 'express'
import TemplatesTaskController from '../controllers/templatesTaskController.js'


const router = new express.Router()

router.get('/getall', TemplatesTaskController.getAll)
router.get('/getAllActiveWTemplatesTask', TemplatesTaskController.getAllActiveTemplatesTask)
router.get('/getone/:id([0-9]+)', TemplatesTaskController.getOne)
router.post('/create',  TemplatesTaskController.create)
router.put('/update/:id([0-9]+)',  TemplatesTaskController.update)
router.patch('/updateActiveTemplatesTask/:id([0-9]+)',  TemplatesTaskController.updateActiveTemplatesTask)
router.delete('/delete/:id([0-9]+)',  TemplatesTaskController.delete)

export default router