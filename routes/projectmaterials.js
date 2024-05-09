import express from 'express'
import ProjectMaterialsController from '../controllers/projectMaterialsController.js'

const router = new express.Router()


router.post('/create',  ProjectMaterialsController.create)
router.put('/createCheckProjectMaterials/:id([0-9]+)',  ProjectMaterialsController.createCheckProjectMaterials)
router.delete('/deleteCheckProjectMaterials/:check', ProjectMaterialsController.deleteCheckProjectMaterials)
router.put('/createReadyDateProjectMaterials/:id([0-9]+)',  ProjectMaterialsController.createReadyDateProjectMaterials)
router.put('/createShippingDateProjectMaterials/:id([0-9]+)',  ProjectMaterialsController.createShippingDateProjectMaterials)
router.put('/createPaymentDateProjectMaterials/:id([0-9]+)',  ProjectMaterialsController.createPaymentDateProjectMaterials)
router.delete('/deletePaymentDateProjectMaterials/:date_payment', ProjectMaterialsController.deletePaymentDateProjectMaterials)
router.put('/createColorProjectMaterials/:id([0-9]+)', ProjectMaterialsController.createColorProjectMaterials)
router.put('/createExpirationMaterialDateProjectMaterials/:id([0-9]+)',  ProjectMaterialsController.createExpirationMaterialDateProjectMaterials)
router.get('/getall', ProjectMaterialsController.getAll)
router.get('/getAllMaterialProject', ProjectMaterialsController.getAllMaterialProject)
router.get('/getone/:id([0-9]+)', ProjectMaterialsController.getOne)
router.delete('/delete/:id([0-9]+)', ProjectMaterialsController.delete)


export default router