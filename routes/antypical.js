import express from 'express'
import AntypicalController from '../controllers/antypicalController.js'


const router = new express.Router()

router.get('/getall', AntypicalController.getAll)
router.get('/getone/:id([0-9]+)', AntypicalController.getOne)
router.post('/create',  AntypicalController.create)
router.put('/update/:id([0-9]+)',  AntypicalController.update)
router.delete('/delete/:id([0-9]+)', AntypicalController.delete)

export default router