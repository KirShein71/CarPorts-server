import express from 'express'
import DeliveryDetailsController from '../controllers/deliveryDetailsController.js'
const router = new express.Router()


router.post('/create',  DeliveryDetailsController.create)
router.get('/getall', DeliveryDetailsController.getAll)
router.get('/getone/:id([0-9]+)', DeliveryDetailsController.getOne)
router.put('/update/:id([0-9]+)', DeliveryDetailsController.update)
router.get('/getSumOneDeliveryDetail', DeliveryDetailsController.getSumOneDeliveryDetail)
router.delete('/delete/:projectId',  DeliveryDetailsController.delete)


export default router