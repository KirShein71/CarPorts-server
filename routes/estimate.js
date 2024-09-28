import express from 'express'
import EstimateController from '../controllers/estimateController.js'

const router = new express.Router()


router.post('/create',  EstimateController.create)
router.get('/getall', EstimateController.getAll)
router.get('/getAllEstimateForBrigade', EstimateController.getAllEstimateForBrigade)
router.get('/getone/:id([0-9]+)', EstimateController.getOne)
router.put('/updateEstimatePrice/:id([0-9]+)', EstimateController.updateEstimatePrice)
router.delete('/delete/:id([0-9]+)', EstimateController.delete)

export default router