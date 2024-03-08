import express from 'express'
import AdminController from '../controllers/adminController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'

const router = new express.Router()

router.post('/signup', AdminController.signup)
router.post('/login', AdminController.login)
router.get('/check', authMiddleware, AdminController.check)

router.get('/getall', AdminController.getAll)
router.get('/getOne/:id([0-9]+)', AdminController.getOne)
router.delete('/delete/:id([0-9]+)', authMiddleware, adminMiddleware, AdminController.delete)

export default router