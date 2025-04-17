import express from 'express'
import BrigadeController from '../controllers/brigadeController.js'
import authMiddleware from '../middleware/authMiddleware.js'


const router = new express.Router()

router.post('/signup', BrigadeController.signup)
router.post('/login', BrigadeController.login)
router.get('/check', authMiddleware, BrigadeController.check)

router.get('/getall', BrigadeController.getAll)
router.get('/getone/:id([0-9]+)', BrigadeController.getOne)
router.post('/create',  BrigadeController.create)
router.put('/createRegion/:id([0-9]+)', BrigadeController.createRegion)
router.put('/createPassword/:id([0-9]+)', BrigadeController.createPassword)
router.put('/update/:id([0-9]+)',  BrigadeController.update)
router.put('/updateBrigadeName/:id([0-9]+)',  BrigadeController.updateBrigadeName)
router.put('/updateBrigadePhone/:id([0-9]+)',  BrigadeController.updateBrigadePhone)
router.delete('/delete/:id([0-9]+)',  BrigadeController.delete)



export default router