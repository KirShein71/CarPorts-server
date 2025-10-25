import express from 'express'
import ExaminationController from '../controllers/examinationController.js'


const router = new express.Router()

router.get('/getall', ExaminationController.getAll)
router.get('/getone/:id([0-9]+)', ExaminationController.getOne)
router.post('/create',  ExaminationController.create)
router.put('/update/:id([0-9]+)',  ExaminationController.update)
router.put('/updateName/:id([0-9]+)',  ExaminationController.updateName)
router.put('/updateNumber/:id([0-9]+)',  ExaminationController.updateNumber)
router.delete('/delete/:id([0-9]+)',  ExaminationController.delete)


export default router