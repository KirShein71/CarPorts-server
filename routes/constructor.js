import express from 'express'
import ConstructorController from '../controllers/constructorController.js'
import authMiddleware from '../middleware/authMiddleware.js'


const router = new express.Router()

router.post('/signup', ConstructorController.signup)
router.post('/login', ConstructorController.login)
router.get('/check', authMiddleware, ConstructorController.check)

router.get('/getall', ConstructorController.getAll)
router.get('/getone/:id([0-9]+)', ConstructorController.getOne)
router.post('/create',  ConstructorController.create)
router.put('/updatePassword/:id([0-9]+)', ConstructorController.updatePassword)
router.delete('/delete/:id([0-9]+)',  ConstructorController.delete)


export default router