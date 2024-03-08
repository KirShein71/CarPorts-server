import express from 'express'
import DetailsController from '../controllers/detailsController.js'


const router = new express.Router()

router.get('/getall', DetailsController.getAll)
router.get('/getone/:id([0-9]+)', DetailsController.getOne)
router.post('/create',  DetailsController.create)
router.put('/update/:id([0-9]+)',  DetailsController.update)
router.delete('/delete/:id([0-9]+)',  DetailsController.delete)


export default router