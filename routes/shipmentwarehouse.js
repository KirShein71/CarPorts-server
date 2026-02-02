import express from 'express'
import ShipmentWarehouseController from '../controllers/shipmentWarehouseController.js'

const router = new express.Router()


router.post('/create',  ShipmentWarehouseController.create)
router.get('/getall', ShipmentWarehouseController.getAll)
router.get('/getone/:id([0-9]+)', ShipmentWarehouseController.getOne)
router.patch('/createNote/:id([0-9]+)', ShipmentWarehouseController.createNote)
router.delete('/deleteNote/:note', ShipmentWarehouseController.deleteNote)
router.delete('/delete/:id([0-9]+)',  ShipmentWarehouseController.delete)


export default router