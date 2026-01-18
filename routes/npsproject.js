import express from 'express'
import NpsProjectController from '../controllers/npsProjectController.js'


const router = new express.Router()

router.get('/getall', NpsProjectController.getAll)
router.get('/getone/:id([0-9]+)', NpsProjectController.getOne)
router.get('/getForProject/:id([0-9]+)', NpsProjectController.getForProject)
router.post('/create',  NpsProjectController.create)
router.put('/updateScore/:id([0-9]+)',  NpsProjectController.updateScore)
router.delete('/delete/:id([0-9]+)',  NpsProjectController.delete)
router.get('/getNoteForProject/:id([0-9]+)', NpsProjectController.getNoteForProject)
router.post('/createNote',  NpsProjectController.createNote)
router.put('/updateNote/:id([0-9]+)',  NpsProjectController.updateNote)
router.delete('/deleteNote/:id([0-9]+)',  NpsProjectController.deleteNote)


export default router