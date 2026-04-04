import express from 'express'
import DeliveryDetailsController from '../controllers/deliveryDetailsController.js'
const router = new express.Router()


router.post('/create',  DeliveryDetailsController.create)
router.get('/getall', DeliveryDetailsController.getAll)
router.get('/getone/:id([0-9]+)', DeliveryDetailsController.getOne)
router.get('/getAllDeliveryDetailsForProject/:projectId([0-9]+)', DeliveryDetailsController.getAllDeliveryDetailsForProject)
router.put('/update/:id([0-9]+)', DeliveryDetailsController.update)
router.get('/getSumOneDeliveryDetail', DeliveryDetailsController.getSumOneDeliveryDetail)
router.delete('/delete/:projectId',  DeliveryDetailsController.delete)
router.delete('/deleteOneDeliveryDetail/:id([0-9]+)',  DeliveryDetailsController.deleteOneDeliveryDetail)


export default router