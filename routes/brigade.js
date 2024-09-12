import express from 'express'
import BrigadeController from '../controllers/brigadeController.js'


const router = new express.Router()

router.get('/getall', BrigadeController.getAll)
router.get('/getone/:id([0-9]+)', BrigadeController.getOne)
router.post('/create',  BrigadeController.create)
router.put('/createRegion/:id([0-9]+)', BrigadeController.createRegion)
router.put('/update/:id([0-9]+)',  BrigadeController.update)
router.delete('/delete/:id([0-9]+)',  BrigadeController.delete)



export default router