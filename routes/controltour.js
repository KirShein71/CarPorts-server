import express from 'express'
import ControlTourController from '../controllers/controlTourController.js'

const router = new express.Router()


router.post('/create',  ControlTourController.create)
router.get('/getall', ControlTourController.getAll)
router.get('/getone/:id([0-9]+)', ControlTourController.getOne)
router.put('/updateControlTour/:id([0-9]+)', ControlTourController.updateControlTour)
router.delete('/delete/:id([0-9]+)', ControlTourController.delete)
router.get('/getAllCertainDays', ControlTourController.getAllCertainDays)

export default router