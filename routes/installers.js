import express from 'express'
import InstallersController from '../controllers/installersController.js'


const router = new express.Router()

router.get('/getall', InstallersController.getAll)
router.get('/getone/:id([0-9]+)', InstallersController.getOne)


export default router