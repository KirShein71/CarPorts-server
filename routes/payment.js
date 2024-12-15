import express from 'express'
import PaymentController from '../controllers/paymentController.js'

const router = new express.Router()


router.post('/create',  PaymentController.create)
router.get('/getall', PaymentController.getAll)
router.get('/getone/:id([0-9]+)', PaymentController.getOne)
router.put('/updatePaymentDate/:id([0-9]+)', PaymentController.updatePaymentDate)
router.put('/updatePaymentSum/:id([0-9]+)', PaymentController.updatePaymentSum)
router.delete('/delete/:id([0-9]+)', PaymentController.delete)
router.get('/getAllPaymentForBrigade/:id([0-9]+)', PaymentController.getAllPaymentForBrigade)



export default router