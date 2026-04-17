import express from 'express'
import AddWarehouseController from '../controllers/addWarehouseController.js'


const router = new express.Router()

router.get('/getall', AddWarehouseController.getAll)
router.post('/create',  AddWarehouseController.create)
router.put('/update/:id([0-9]+)', AddWarehouseController.update)
router.get('/getone/:id([0-9]+)', AddWarehouseController.getOne)
router.get('/getSumOneWarehouseDetail', AddWarehouseController.getSumOneWarehouseDetail)
router.get('/getCostPriceOneWarehouseDetail', AddWarehouseController.getCostPriceOneWarehouseDetail)
router.delete('/delete/:stock_date',  AddWarehouseController.delete)


export default router