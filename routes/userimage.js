import express from 'express'
import UserImageController from '../controllers/userImageController.js'


const router = new express.Router()

router.get('/getall', UserImageController.getAll)
router.get('/getone/:id([0-9]+)', UserImageController.getOne)
router.get('/getall/:id([0-9]+)', UserImageController.getAllByUserId)
router.post('/create',  UserImageController.create)
router.put('/update/:id([0-9]+)',  UserImageController.update)
router.delete('/delete/:id([0-9]+)',  UserImageController.delete)



export default router