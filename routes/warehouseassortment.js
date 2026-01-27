import express from 'express'
import WarehouseAssortmentController from '../controllers/warehouseAssortmentController.js'


const router = new express.Router()

router.get('/getall', WarehouseAssortmentController.getAll)
router.get('/getAllActiveWarehouseAssortement', WarehouseAssortmentController.getAllActiveWarehouseAssortement)
router.get('/getone/:id([0-9]+)', WarehouseAssortmentController.getOne)
router.post('/create',  WarehouseAssortmentController.create)
router.put('/update/:id([0-9]+)',  WarehouseAssortmentController.update)
router.patch('/updateActiveWarehouseAssortment/:id([0-9]+)',  WarehouseAssortmentController.updateActiveWarehouseAssortment)
router.delete('/delete/:id([0-9]+)',  WarehouseAssortmentController.delete)

export default router