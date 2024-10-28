import express from 'express'
import ManagerProductionController from '../controllers/ManagerProductionController.js'
import authMiddleware from '../middleware/authMiddleware.js'


const router = new express.Router()

router.post('/signup', ManagerProductionController.signup)
router.post('/login', ManagerProductionController.login)
router.get('/check', authMiddleware, ManagerProductionController.check)

router.get('/getall', ManagerProductionController.getAll)
router.get('/getone/:id([0-9]+)', ManagerProductionController.getOne)
router.post('/create',  ManagerProductionController.create)
router.put('/updatePassword/:id([0-9]+)', ManagerProductionController.updatePassword)
router.delete('/delete/:id([0-9]+)',  ManagerProductionController.delete)


export default router