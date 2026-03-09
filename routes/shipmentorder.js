import express from 'express'
import shipmentOrderController from '../controllers/shipmentOrderController.js';

const router = new express.Router()

router.post('/createShipmentOrder/:date/:projectId', shipmentOrderController.createShipmentOrder);
router.get('/getall', shipmentOrderController.getAll)
router.get('/getAllForShipmentOrderProject/:projectId/:date', shipmentOrderController.getAllForShipmentOrderProject)
router.put('/createDateInShipmentOrderWithNoDate/:projectId', shipmentOrderController.createDateInShipmentOrderWithNoDate);
router.delete('/deleteOneShipmentOrderDetail/:id([0-9]+)',  shipmentOrderController.deleteOneShipmentOrderDetail)
router.put('/update/:id([0-9]+)', shipmentOrderController.update)
router.post('/create',  shipmentOrderController.create)
router.get('/getone/:id([0-9]+)', shipmentOrderController.getOne)
router.post('/createAntypical',  shipmentOrderController.createAntypical)



export default router