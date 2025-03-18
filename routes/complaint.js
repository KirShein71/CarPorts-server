import express from 'express'
import ComplaintController from '../controllers/complaintController.js'


const router = new express.Router()

router.get('/getall', ComplaintController.getAll)
router.get('/getone/:id([0-9]+)', ComplaintController.getOne)
router.post('/create',  ComplaintController.create)
router.put('/createDateFinish/:id([0-9]+)', ComplaintController.createDateFinish)
router.delete('/deleteDateFinish/:date_finish', ComplaintController.deleteDateFinish)
router.put('/updateNote/:id([0-9]+)', ComplaintController.updateNote)
router.delete('/delete/:id([0-9]+)',  ComplaintController.delete)


export default router