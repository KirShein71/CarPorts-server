import express from 'express'
import StockDetailsController from '../controllers/stockDetailsController.js'


const router = new express.Router()

router.get('/getall', StockDetailsController.getAll)
router.post('/create',  StockDetailsController.create)
router.put('/update/:id([0-9]+)', StockDetailsController.update)
router.get('/getone/:id([0-9]+)', StockDetailsController.getOne)
router.get('/getSumOneDetail', StockDetailsController.getSumOneDetail)


export default router