import express from 'express'
import ServiceController from '../controllers/serviceController.js'


const router = new express.Router()

router.get('/getall', ServiceController.getAll)
router.get('/getone/:id([0-9]+)', ServiceController.getOne)
router.post('/create',  ServiceController.create)
router.put('/update/:id([0-9]+)',  ServiceController.update)
router.delete('/delete/:id([0-9]+)',  ServiceController.delete)


export default router