import express from 'express'
import InstallersController from '../controllers/installersController.js'



const router = new express.Router()

router.get('/getall', InstallersController.getAll)
router.get('/getone/:id([0-9]+)', InstallersController.getOne)
router.post('/create',  InstallersController.create)
router.put('/update/:id([0-9]+)',  InstallersController.update)
router.delete('/delete/:id([0-9]+)',  InstallersController.delete)




export default router