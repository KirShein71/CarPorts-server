import express from 'express'
import CoefficientController from '../controllers/coefficientController.js'



const router = new express.Router()

router.get('/getall', CoefficientController.getAll)
router.get('/getone/:id([0-9]+)', CoefficientController.getOne)
router.post('/create',  CoefficientController.create)
router.put('/updateCoefficientName/:id([0-9]+)',  CoefficientController.updateCoefficientName)
router.put('/updateCoefficientNumber/:id([0-9]+)',  CoefficientController.updateCoefficientNumber)
router.delete('/delete/:id([0-9]+)',  CoefficientController.delete)



export default router