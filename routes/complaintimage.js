import express from 'express'
import ComplaintImageController from '../controllers/complaintImageController.js'


const router = new express.Router()

router.get('/getall', ComplaintImageController.getAll)
router.get('/getone/:id([0-9]+)', ComplaintImageController.getOne)
router.post('/create',  ComplaintImageController.create)
router.get('/getAllByComplaintId/:id([0-9]+)', ComplaintImageController.getAllByComplaintId)
router.put('/update/:id([0-9]+)',  ComplaintImageController.update)
router.delete('/delete/:id([0-9]+)',  ComplaintImageController.delete)



export default router 