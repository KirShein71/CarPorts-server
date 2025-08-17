import express from 'express'
import UserController from '../controllers/userController.js'
import AdminController from '../controllers/adminController.js'
import authMiddleware from '../middleware/authMiddleware.js'


const router = new express.Router()

router.post('/signup', UserController.signup)
router.post('/login', UserController.login)
router.get('/check', authMiddleware, UserController.check)

router.get('/getall', UserController.getAll)
router.get('/getOneAccount/:id([0-9]+)', UserController.getOneAccount)
router.get('/getOne/:id([0-9]+)', UserController.getOne)
router.get('/getUserForBrigade/:projectId([0-9]+)', UserController.getUserForBrigade)
router.post('/create', UserController.create)
router.put('/createManager/:id([0-9]+)',  UserController.createManager)
router.put('/createBrigade/:id([0-9]+)',  UserController.createBrigade)
router.put('/createMainImage/:id([0-9]+)',  UserController.createMainImage)
router.delete('/delete/:id([0-9]+)',  UserController.delete)
router.post('/verifyToken', UserController.verifyToken)


export default router