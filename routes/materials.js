import express from 'express'
import MaterialsController from '../controllers/materialsController.js'


const router = new express.Router()

router.get('/getall', MaterialsController.getAll)
router.get('/getone/:id([0-9]+)', MaterialsController.getOne)
router.post('/create',  MaterialsController.create)
router.put('/update/:id([0-9]+)',  MaterialsController.update)
router.put('/createSupplier/:id([0-9]+)',  MaterialsController.createSupplier)
router.delete('/delete/:id([0-9]+)',  MaterialsController.delete)


export default router