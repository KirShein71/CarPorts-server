import express from 'express'
import UserFileController from '../controllers/userFileController.js'


const router = new express.Router()

router.get('/getall', UserFileController.getAll)
router.get('/getone/:id([0-9]+)', UserFileController.getOne)
router.post('/create',  UserFileController.create)
router.get('/getall/:id([0-9]+)', UserFileController.getAllByUserId)
router.put('/update/:id([0-9]+)',  UserFileController.update)
router.delete('/delete/:id([0-9]+)',  UserFileController.delete)



export default router