import express from 'express'
import ShipmentDetailsController from '../controllers/shipmentDetailsController.js'

const router = new express.Router()


router.post('/create',  ShipmentDetailsController.create)
router.get('/getall', ShipmentDetailsController.getAll)
router.get('/getone/:id([0-9]+)', ShipmentDetailsController.getOne)
router.put('/update/:id([0-9]+)', ShipmentDetailsController.update)
router.get('/getproject/:projectId([0-9]+)', ShipmentDetailsController.getProject)
router.get('/getSumOneShipmentDetail', ShipmentDetailsController.getSumOneShipmentDetail)
router.delete('/delete/:projectId',  ShipmentDetailsController.delete)

export default router