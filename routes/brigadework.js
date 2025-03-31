import express from 'express'
import BrigadeWorkController from '../controllers/brigadeWorkController.js'

const router = new express.Router()

router.post('/create',  BrigadeWorkController.create)
router.get('/getall', BrigadeWorkController.getAll)
router.get('/getone/:id([0-9]+)', BrigadeWorkController.getOne)
router.get('/getOneBrigadeWorkRegionId/:id([0-9]+)', BrigadeWorkController.getOneBrigadeWorkRegionId)
router.put('/updateCount/:id([0-9]+)', BrigadeWorkController.updateCount)

export default router

