import express from 'express'
import SetController from '../controllers/setController.js'



const router = new express.Router()


router.get('/getall', SetController.getAll)
router.get('/getAllActiveSet', SetController.getAllActiveSet)
router.get('/getone/:id([0-9]+)', SetController.getOne)
router.post('/create',  SetController.create)
router.put('/update/:id([0-9]+)',  SetController.update)
router.patch('/updateActiveSet/:id([0-9]+)',  SetController.updateActiveSet)
router.delete('/delete/:id([0-9]+)',  SetController.delete)



export default router