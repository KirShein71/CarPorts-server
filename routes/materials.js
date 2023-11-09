import express from 'express'
import MaterialsController from '../controllers/materialsController.js'


const router = new express.Router()

router.get('/getall', MaterialsController.getAll)
router.get('/getone/:id([0-9]+)', MaterialsController.getOne)


export default router