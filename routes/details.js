import express from 'express'
import DetailsController from '../controllers/DetailsController.js'


const router = new express.Router()

router.get('/getall', DetailsController.getAll)
router.get('/getone/:id([0-9]+)', DetailsController.getOne)


export default router