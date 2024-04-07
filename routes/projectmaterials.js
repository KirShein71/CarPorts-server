import express from 'express'
import ProjectMaterialsController from '../controllers/projectMaterialsController.js'

const router = new express.Router()


router.post('/create',  ProjectMaterialsController.create)
router.put('/createCheckProjectMaterials/:id([0-9]+)',  ProjectMaterialsController.createCheckProjectMaterials)
router.delete('/deleteCheckProjectMaterials/:check', ProjectMaterialsController.deleteCheckProjectMaterials)
router.put('/createReadyDateProjectMaterials/:id([0-9]+)',  ProjectMaterialsController.createReadyDateProjectMaterials)
router.put('/createShippingDateProjectMaterials/:id([0-9]+)',  ProjectMaterialsController.createShippingDateProjectMaterials)
router.put('/createPaymentDateProjectMaterials/:id([0-9]+)',  ProjectMaterialsController.createPaymentDateProjectMaterials)
router.put('/createExpirationMaterialDateProjectMaterials/:id([0-9]+)',  ProjectMaterialsController.createExpirationMaterialDateProjectMaterials)
router.get('/getall', ProjectMaterialsController.getAll)
router.get('/getone/:id([0-9]+)', ProjectMaterialsController.getOne)
router.delete('/delete/:id([0-9]+)', ProjectMaterialsController.delete)
router.get('/getproject/:projectId([0-9]+)', ProjectMaterialsController.getProject)

export default router