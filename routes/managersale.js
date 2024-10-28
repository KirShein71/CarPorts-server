import express from 'express'
import ManagerSaleContoller from '../controllers/managerSaleController.js'
import authMiddleware from '../middleware/authMiddleware.js'


const router = new express.Router()

router.post('/signup', ManagerSaleContoller.signup)
router.post('/login', ManagerSaleContoller.login)
router.get('/check', authMiddleware, ManagerSaleContoller.check)

router.get('/getall', ManagerSaleContoller.getAll)
router.get('/getone/:id([0-9]+)', ManagerSaleContoller.getOne)
router.post('/create',  ManagerSaleContoller.create)
router.put('/updatePassword/:id([0-9]+)', ManagerSaleContoller.updatePassword)
router.delete('/delete/:id([0-9]+)',  ManagerSaleContoller.delete)


export default router