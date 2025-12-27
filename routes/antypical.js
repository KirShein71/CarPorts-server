import express from 'express'
import AntypicalController from '../controllers/antypicalController.js'


const router = new express.Router()

router.get('/getall', AntypicalController.getAll)
router.get('/getAllAntypiclasForProject/:id([0-9]+)', AntypicalController.getAllAntypiclasForProject)
router.get('/getAllForAntypicalsShipment', AntypicalController.getAllForAntypicalsShipment)
router.get('/getone/:id([0-9]+)', AntypicalController.getOne)
router.post('/create',  AntypicalController.create)
router.put('/createColor/:id([0-9]+)',  AntypicalController.createColor)
router.put('/createName/:id([0-9]+)',  AntypicalController.createName)
router.put('/createAntypicalsQuantity/:id([0-9]+)',  AntypicalController.createAntypicalsQuantity)
router.put('/createAntypicalsShipmentQuantity/:id([0-9]+)',  AntypicalController.createAntypicalsShipmentQuantity)
router.put('/createAntypicalsWeldersQuantity/:id([0-9]+)',  AntypicalController.createAntypicalsWeldersQuantity)
router.put('/createAntypicalsDeliveryQuantity/:id([0-9]+)',  AntypicalController.createAntypicalsDeliveryQuantity)
router.put('/update/:id([0-9]+)',  AntypicalController.update)
router.delete('/delete/:id([0-9]+)', AntypicalController.delete)

export default router