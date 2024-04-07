import express from 'express'
import StockAntypicalController from '../controllers/stockAntypicalController.js'


const router = new express.Router()


router.post('/create',  StockAntypicalController.create)
router.put('/update/:id([0-9]+)', StockAntypicalController.update)
router.get('/getone/:id([0-9]+)', StockAntypicalController.getOne)



export default router