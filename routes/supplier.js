import express from 'express'
import SupplierController from '../controllers/supplierController.js'


const router = new express.Router()

router.get('/getall', SupplierController.getAll)
router.get('/getone/:id([0-9]+)', SupplierController.getOne)
router.post('/create',  SupplierController.create)
router.put('/update/:id([0-9]+)',  SupplierController.update)
router.delete('/delete/:id([0-9]+)',  SupplierController.delete)


export default router