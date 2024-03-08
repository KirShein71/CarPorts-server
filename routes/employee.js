import express from 'express'
import EmployeeController from '../controllers/employeeController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'

const router = new express.Router()

router.post('/signup', EmployeeController.signup)
router.post('/login', EmployeeController.login)
router.get('/check', authMiddleware, EmployeeController.check)

router.get('/getall', EmployeeController.getAll)
router.get('/getOne/:id([0-9]+)', EmployeeController.getOne)
router.post('/create', EmployeeController.create)
router.delete('/delete/:id([0-9]+)', EmployeeController.delete)

export default router