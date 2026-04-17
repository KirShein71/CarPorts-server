import express from 'express'
import TotalWarehouseController from '../controllers/totalWarehouseController.js'


const router = new express.Router()

router.get('/getTotalWarehouseData', TotalWarehouseController.getTotalWarehouseData)


export default router