import express from 'express'
import ComplaintPaymentController from '../controllers/complaintPaymentController.js'

const router = new express.Router()


router.post('/create',  ComplaintPaymentController.create)
router.get('/getall', ComplaintPaymentController.getAll)
router.get('/getone/:id([0-9]+)', ComplaintPaymentController.getOne)
router.put('/updatePaymentDate/:id([0-9]+)', ComplaintPaymentController.updatePaymentDate)
router.put('/updatePaymentSum/:id([0-9]+)', ComplaintPaymentController.updatePaymentSum)
router.delete('/delete/:id([0-9]+)', ComplaintPaymentController.delete)
router.get('/getAllPaymentForBrigade/:id([0-9]+)', ComplaintPaymentController.getAllPaymentForBrigade)



export default router