import express from 'express'
import ManagerProjectController from '../controllers/managerProjectController.js'
import authMiddleware from '../middleware/authMiddleware.js'


const router = new express.Router()

router.post('/signup', ManagerProjectController.signup)
router.post('/login', ManagerProjectController.login)
router.get('/check', authMiddleware, ManagerProjectController.check)

router.get('/getall', ManagerProjectController.getAll)
router.get('/getone/:id([0-9]+)', ManagerProjectController.getOne)
router.post('/create',  ManagerProjectController.create)
router.put('/updatePassword/:id([0-9]+)', ManagerProjectController.updatePassword)
router.delete('/delete/:id([0-9]+)',  ManagerProjectController.delete)


export default router